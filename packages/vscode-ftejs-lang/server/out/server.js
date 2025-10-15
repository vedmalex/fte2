import * as fs from 'fs';
import * as path from 'path';
import { createConnection, DiagnosticSeverity, DidChangeConfigurationNotification, Position, ProposedFeatures, Range, TextDocumentSyncKind, TextDocuments, TextEdit, } from 'vscode-languageserver/node.js';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getCompletions } from './completion.js';
import { computeDiagnostics as computeDiagnosticsExternal } from './diagnostics.js';
import { extractInstructionCodeView, extractTemplateCodeView, } from './formatterCore.js';
import { getDefinition, getHover, getReferences } from './navigation.js';
import { buildSemanticTokensFromText, semanticTokenModifiers, semanticTokenTypes, } from './semanticTokens.js';
const { formatText } = require('./adapters/format.js');
const { lintText } = require('./adapters/lint.js');
import * as url from 'url';
import { buildEndTagFor, computeOpenBlocksFromText, extractBlockAndSlotSymbols, getExtendTargetFrom as getExtendTargetFromUtil, walkAstNodes, } from './astUtils.js';
import { Parser as LocalParser } from './parser.js';
const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
let usageDocs = { functions: {}, directives: {} };
let usageWatchers = [];
let serverSettings = {
    format: { textFormatter: true, codeFormatter: true, keepBlankLines: 1 },
    docs: {},
    debug: { enabled: false },
    linter: { external: { enabled: false } },
};
let workspaceRoots = [];
const prettierConfigCache = {};
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
function log(level, context, message, details) {
    try {
        const timestamp = new Date().toISOString();
        const detailsStr = details
            ? ` | Details: ${JSON.stringify(details, null, 2)}`
            : '';
        const logMessage = `[${timestamp}] [${level}] ${context}: ${message}${detailsStr}`;
        const logFn = level === LogLevel.ERROR
            ? console.error
            : level === LogLevel.WARN
                ? console.warn
                : level === LogLevel.DEBUG
                    ? console.debug
                    : console.log;
        try {
            logFn(logMessage);
        }
        catch { }
        if (serverSettings?.debug?.enabled || level === LogLevel.ERROR) {
            const target = serverSettings?.debug?.logFile ||
                path.join(process.cwd(), 'ftejs-server.log');
            try {
                fs.appendFileSync(target, logMessage + '\n', 'utf8');
            }
            catch (fileErr) {
                console.error(`Failed to write to log file: ${fileErr}`);
            }
        }
    }
    catch (logErr) {
        try {
            console.error(`Logger error: ${logErr}`);
        }
        catch { }
    }
}
function logError(err, context, details) {
    const message = err instanceof Error ? err.stack || err.message : String(err);
    log(LogLevel.ERROR, context, message, details);
}
function logWarn(message, context, details) {
    log(LogLevel.WARN, context, message, details);
}
function logInfo(message, context, details) {
    log(LogLevel.INFO, context, message, details);
}
function logDebug(message, context, details) {
    if (serverSettings?.debug?.enabled) {
        log(LogLevel.DEBUG, context, message, details);
    }
}
const fileIndex = new Map();
const extendsChildren = new Map();
function walkDir(root, out = []) {
    try {
        const list = fs.readdirSync(root, { withFileTypes: true });
        for (const ent of list) {
            if (ent.name === 'node_modules' || ent.name.startsWith('.git'))
                continue;
            const p = path.join(root, ent.name);
            if (ent.isDirectory())
                walkDir(p, out);
            else if (/\.(njs|nhtml|nts|nmd)$/i.test(ent.name))
                out.push(p);
        }
    }
    catch { }
    return out;
}
function indexFile(absPath) {
    try {
        const uri = 'file://' + absPath;
        const text = fs.readFileSync(absPath, 'utf8');
        indexText(uri, text, absPath);
    }
    catch { }
}
function indexWorkspace() {
    for (const root of workspaceRoots) {
        const files = walkDir(root);
        for (const f of files)
            indexFile(f);
    }
}
function indexText(uri, text, absPath) {
    const blocks = new Map();
    const slots = new Map();
    const requireAs = new Map();
    const ast = parseContent(text);
    walkAstNodes(ast, (node) => {
        if (node.type === 'blockStart') {
            const name = String(node.name || node.blockName || '');
            if (name) {
                const range = {
                    start: node.pos,
                    end: node.pos + String(node.start || '').length,
                };
                blocks.set(name, range);
            }
        }
        else if (node.type === 'slotStart') {
            const name = String(node.name || node.slotName || '');
            if (name) {
                const range = {
                    start: node.pos,
                    end: node.pos + String(node.start || '').length,
                };
                slots.set(name, range);
            }
        }
    });
    walkAstNodes(ast, (node) => {
        if (node.type === 'directive' && node.content) {
            const content = String(node.content).trim();
            if (content.startsWith('requireAs')) {
                const match = content.match(/requireAs\s*\(\s*([^)]*)\s*\)/);
                if (match) {
                    const params = match[1]
                        .split(',')
                        .map((s) => s.trim().replace(/^['"`]|['"`]$/g, ''));
                    if (params.length >= 2)
                        requireAs.set(params[1], params[0]);
                }
            }
        }
    });
    const prev = fileIndex.get(uri);
    if (prev?.extendsPath) {
        const set = extendsChildren.get(prev.extendsPath);
        if (set) {
            set.delete(uri);
            if (set.size === 0)
                extendsChildren.delete(prev.extendsPath);
        }
    }
    let extendsPath;
    try {
        const parentAbs = getExtendTargetFrom(text, uri);
        if (parentAbs)
            extendsPath = parentAbs;
    }
    catch (e) {
        logError(e, 'indexText.getExtendTargetFrom');
    }
    fileIndex.set(uri, {
        uri,
        path: absPath,
        blocks,
        slots,
        requireAs,
        extendsPath,
    });
    if (extendsPath) {
        const set = extendsChildren.get(extendsPath) || new Set();
        set.add(uri);
        extendsChildren.set(extendsPath, set);
    }
}
function loadUsageDocsFrom(pathCandidates) {
    for (const p of pathCandidates) {
        try {
            const md = fs.readFileSync(p, 'utf8');
            const functions = {};
            const directives = {};
            const lines = md.split(/\r?\n/);
            let current = { type: null, buf: [] };
            const flush = () => {
                if (current.type && current.key) {
                    const text = current.buf.join('\n').trim();
                    if (current.type === 'func')
                        functions[current.key] = text;
                    if (current.type === 'dir')
                        directives[current.key] = text;
                }
                current = { type: null, buf: [] };
            };
            for (const line of lines) {
                const mFunc = line.match(/^###\s+([\w]+)\s*\(/);
                const mChunks = line.match(/^###\s+Чанки.*chunkStart\(name\).*chunkEnd\(\)/);
                const mDir = line.match(/^###\s+(\w+)/);
                if (mFunc) {
                    flush();
                    current.type = 'func';
                    current.key = mFunc[1];
                    continue;
                }
                if (mChunks) {
                    flush();
                    current.type = 'func';
                    current.key = 'chunkStart';
                    current.buf.push('chunkStart(name), chunkEnd()');
                    continue;
                }
                if (mDir) {
                    const key = mDir[1];
                    const known = [
                        'extend',
                        'context',
                        'alias',
                        'requireAs',
                        'deindent',
                        'chunks',
                        'includeMainChunk',
                        'useHash',
                        'noContent',
                        'noSlots',
                        'noBlocks',
                        'noPartial',
                        'noOptions',
                        'promise',
                        'callback',
                    ];
                    if (known.includes(key)) {
                        flush();
                        current.type = 'dir';
                        current.key = key;
                        continue;
                    }
                }
                current.buf.push(line);
            }
            flush();
            usageDocs = { functions, directives };
            return;
        }
        catch { }
    }
}
function watchUsage(candidates) {
    for (const w of usageWatchers) {
        try {
            w.close();
        }
        catch { }
    }
    usageWatchers = [];
    for (const p of candidates) {
        try {
            if (fs.existsSync(p)) {
                const w = fs.watch(p, { persistent: false }, (evt) => {
                    if (evt === 'change') {
                        loadUsageDocsFrom([p]);
                    }
                });
                usageWatchers.push(w);
            }
        }
        catch { }
    }
}
connection.onInitialize((params) => {
    try {
        logInfo('Server initializing with embedded parser', 'onInitialize', {
            workspaceFolders: params.workspaceFolders?.length || 0,
            clientInfo: params.clientInfo,
        });
        const wsFolders = params.workspaceFolders?.map((f) => url.fileURLToPath(f.uri)) || [];
        const candidates = [
            ...wsFolders.map((f) => path.join(f, 'USAGE.md')),
            path.join(process.cwd(), 'USAGE.md'),
        ];
        workspaceRoots = wsFolders;
        logDebug('Loading usage docs', 'onInitialize', { candidates });
        loadUsageDocsFrom(candidates);
        watchUsage(candidates);
        logDebug('Starting workspace indexing', 'onInitialize', { workspaceRoots });
        indexWorkspace();
        logInfo('Server initialization completed', 'onInitialize');
    }
    catch (err) {
        logError(err, 'onInitialize', { params: params.workspaceFolders });
        throw err;
    }
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: false,
                triggerCharacters: ['{', '<', '@', "'", '"'],
            },
            hoverProvider: true,
            documentSymbolProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            documentFormattingProvider: true,
            signatureHelpProvider: { triggerCharacters: ['(', '"', "'"] },
            documentOnTypeFormattingProvider: {
                firstTriggerCharacter: '>',
                moreTriggerCharacter: ['\n'],
            },
            codeActionProvider: { resolveProvider: false },
            semanticTokensProvider: {
                legend: {
                    tokenTypes: Array.from(semanticTokenTypes),
                    tokenModifiers: Array.from(semanticTokenModifiers),
                },
                range: false,
                full: true,
            },
        },
    };
});
connection.onInitialized(async () => {
    try {
        await connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }
    catch { }
});
connection.onRequest('ftejs/extractViews', (params) => {
    try {
        const doc = documents.get(params.uri);
        if (!doc) {
            return { templateCode: '', instructionCode: '' };
        }
        const text = doc.getText();
        const ast = parseContent(text);
        let host = 'javascript';
        if (params.hostLanguage) {
            host = params.hostLanguage;
        }
        else {
            const ext = (params.uri.split('.').pop() || '').toLowerCase();
            host =
                ext === 'nhtml'
                    ? 'html'
                    : ext === 'nmd'
                        ? 'markdown'
                        : ext === 'nts'
                            ? 'typescript'
                            : 'javascript';
        }
        const codeView = extractTemplateCodeView(text, ast, {
            hostLanguage: host,
        });
        const instrView = extractInstructionCodeView(text, ast, {
            hostLanguage: host,
            instructionLanguage: host === 'typescript' ? 'typescript' : 'javascript',
        });
        return { templateCode: codeView.code, instructionCode: instrView.code };
    }
    catch (e) {
        logError(e, 'extractViews');
        return { templateCode: '', instructionCode: '' };
    }
});
async function refreshSettings() {
    try {
        const cfg = await connection.workspace?.getConfiguration?.('ftejs');
        if (cfg)
            serverSettings = cfg;
        const usagePath = serverSettings?.docs?.usagePath;
        if (usagePath && fs.existsSync(usagePath)) {
            loadUsageDocsFrom([usagePath]);
            watchUsage([usagePath]);
        }
    }
    catch { }
}
connection.onDidChangeConfiguration(async () => {
    await refreshSettings();
});
function parseContent(text) {
    try {
        return LocalParser.parse(text, { indent: 2 });
    }
    catch (e) {
        logError(e, 'parseContent.embeddedParser', { textLength: text.length });
        return undefined;
    }
}
function getExtendTargetFrom(text, docUri) {
    return getExtendTargetFromUtil(text, docUri, parseContent);
}
function computeDiagnostics(doc) {
    return computeDiagnosticsExternal(doc, {
        parseContent,
        getExtendTargetFrom,
        fileIndex,
        workspaceRoots,
        logError: (e, ctx) => logError(e, ctx),
    });
}
function computeOpenBlocks(text, upTo) {
    return computeOpenBlocksFromText(text, upTo, parseContent);
}
connection.onCompletion(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return [];
    return getCompletions(doc.getText(), textDocument.uri, position, {
        usageDocs,
        parseContent,
        getExtendTargetFrom,
        fileIndex,
    });
});
connection.onHover(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return null;
    return getHover(doc.getText(), position, { usageDocs, parseContent });
});
connection.onDefinition(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return null;
    return getDefinition(doc.getText(), textDocument.uri, position, {
        parseContent,
        getExtendTargetFrom,
        fileIndex,
        workspaceRoots,
    });
});
connection.onReferences(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return [];
    return getReferences(doc.getText(), textDocument.uri, position, { fileIndex });
});
connection.onSignatureHelp(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return null;
    const text = doc.getText();
    const offset = doc.offsetAt(position);
    const before = text.slice(Math.max(0, offset - 60), offset);
    const m = before.match(/<#@\s*(\w+)\s*\([^)]*$/);
    const name = m?.[1];
    if (!name)
        return null;
    const sig = {
        label: `<#@ ${name}(...) #>`,
        documentation: `fte.js directive ${name}`,
        parameters: [{ label: '...params' }],
    };
    const help = {
        signatures: [sig],
        activeSignature: 0,
        activeParameter: 0,
    };
    return help;
});
connection.onDocumentFormatting(({ textDocument, options }) => {
    try {
        const doc = documents.get(textDocument.uri);
        if (!doc) {
            logWarn('Document not found for formatting', 'onDocumentFormatting', {
                uri: textDocument.uri,
            });
            return [];
        }
        const indentSize = options.tabSize || 2;
        const text = doc.getText();
        const originalUri = textDocument.uri;
        logDebug('Starting document formatting', 'onDocumentFormatting', {
            originalUri,
            documentVersion: doc.version,
            textLength: text.length,
            indentSize,
        });
        const finalText = formatText(text, { indentSize });
        const original = doc.getText();
        const fullRange = Range.create(Position.create(0, 0), doc.positionAt(original.length));
        const needsTerminalNewline = /\n$/.test(original);
        const replaced = needsTerminalNewline
            ? finalText.endsWith('\n')
                ? finalText
                : finalText + '\n'
            : finalText.replace(/\n$/, '');
        logDebug('Document formatting completed', 'onDocumentFormatting', {
            originalLength: original.length,
            formattedLength: replaced.length,
            hasTerminalNewline: needsTerminalNewline,
        });
        if (textDocument.uri !== originalUri) {
            logError(new Error('URI changed during formatting'), 'onDocumentFormatting', {
                original: originalUri,
                current: textDocument.uri,
            });
        }
        return [TextEdit.replace(fullRange, replaced)];
    }
    catch (err) {
        logError(err, 'onDocumentFormatting.general', {
            uri: textDocument.uri,
            options,
        });
        return [];
    }
});
connection.onDocumentOnTypeFormatting(({ ch, options, position, textDocument }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return [];
    const indentSize = options.tabSize || 2;
    const text = doc.getText();
    const offset = doc.offsetAt(position);
    const before = text.slice(0, offset);
    const lastOpenStack = computeOpenBlocks(text, offset);
    if (lastOpenStack.length === 0)
        return [];
    const last = lastOpenStack[lastOpenStack.length - 1];
    const after = text.slice(offset);
    if (after.match(/^\s*<#-?\s*end\s*-?#>/))
        return [];
    const endTag = buildEndTagFor(last);
    const currentLineStart = before.lastIndexOf('\n') + 1;
    const currentLineIndent = before.slice(currentLineStart).match(/^\s*/)?.[0]?.length ?? 0;
    const indent = ' '.repeat(Math.max(0, currentLineIndent));
    const nextIndent = ' '.repeat(Math.max(0, currentLineIndent + indentSize));
    const edits = [];
    if (ch === '>') {
        edits.push(TextEdit.insert(position, `\n${nextIndent}`));
        const insertPos = { line: position.line + 1, character: 0 };
        edits.push(TextEdit.insert(insertPos, `${indent}${endTag}`));
    }
    else if (ch === '\n') {
        edits.push(TextEdit.insert(position, `${nextIndent}`));
        const insertPos = position;
        edits.push(TextEdit.insert(insertPos, `\n${indent}${endTag}`));
    }
    return edits;
});
connection.onCodeAction(({ textDocument, range, context }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return [];
    const text = doc.getText();
    const diagnostics = context.diagnostics || [];
    const indentSize = context?.only?.length ? 2 : 2;
    const { buildCodeActions } = require('./codeActions');
    return buildCodeActions({
        text,
        uri: textDocument.uri,
        range,
        diagnostics,
        doc,
        indentSize,
        parseContent,
    });
});
documents.onDidChangeContent(({ document }) => {
    const diags = computeDiagnostics(document);
    try {
        if (serverSettings?.linter?.external?.enabled) {
            const lintIssues = lintText(document.getText());
            for (const issue of lintIssues) {
                const line = Math.max(0, (issue.line || 1) - 1);
                const char = Math.max(0, (issue.column || 1) - 1);
                const sev = issue.severity === 'error'
                    ? DiagnosticSeverity.Error
                    : issue.severity === 'warning'
                        ? DiagnosticSeverity.Warning
                        : DiagnosticSeverity.Information;
                diags.push({
                    severity: sev,
                    range: {
                        start: { line, character: char },
                        end: { line, character: char + 1 },
                    },
                    message: `${issue.ruleId}: ${issue.message}`,
                    source: 'fte.formatter',
                });
            }
        }
    }
    catch { }
    connection.sendDiagnostics({ uri: document.uri, diagnostics: diags });
    const errors = diags.filter((d) => d.severity === DiagnosticSeverity.Error).length;
    const warns = diags.filter((d) => d.severity === DiagnosticSeverity.Warning).length;
    const hints = diags.filter((d) => d.severity === DiagnosticSeverity.Hint).length;
    logInfo(`Diagnostics updated: ${errors} error(s), ${warns} warning(s), ${hints} hint(s)`, 'diagnostics', { uri: document.uri });
    try {
        indexText(document.uri, document.getText());
    }
    catch { }
});
documents.onDidOpen(({ document }) => {
    const diags = computeDiagnostics(document);
    try {
        if (serverSettings?.linter?.external?.enabled) {
            const lintIssues = lintText(document.getText());
            for (const issue of lintIssues) {
                const line = Math.max(0, (issue.line || 1) - 1);
                const char = Math.max(0, (issue.column || 1) - 1);
                const sev = issue.severity === 'error'
                    ? DiagnosticSeverity.Error
                    : issue.severity === 'warning'
                        ? DiagnosticSeverity.Warning
                        : DiagnosticSeverity.Information;
                diags.push({
                    severity: sev,
                    range: {
                        start: { line, character: char },
                        end: { line, character: char + 1 },
                    },
                    message: `${issue.ruleId}: ${issue.message}`,
                    source: 'fte.formatter',
                });
            }
        }
    }
    catch { }
    connection.sendDiagnostics({ uri: document.uri, diagnostics: diags });
    const errors = diags.filter((d) => d.severity === DiagnosticSeverity.Error).length;
    const warns = diags.filter((d) => d.severity === DiagnosticSeverity.Warning).length;
    const hints = diags.filter((d) => d.severity === DiagnosticSeverity.Hint).length;
    logInfo(`Diagnostics on open: ${errors} error(s), ${warns} warning(s), ${hints} hint(s)`, 'diagnostics', { uri: document.uri });
    try {
        indexText(document.uri, document.getText());
    }
    catch { }
});
connection.onDocumentSymbol(({ textDocument }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc)
        return [];
    const ast = parseContent(doc.getText());
    if (!ast)
        return [];
    const { blocks, slots } = extractBlockAndSlotSymbols(ast);
    const symbols = [];
    for (const b of blocks) {
        symbols.push({
            name: `block ${b.name}`,
            kind: 12,
            range: {
                start: doc.positionAt(b.startPos),
                end: doc.positionAt(b.endPos),
            },
            selectionRange: {
                start: doc.positionAt(b.startPos),
                end: doc.positionAt(Math.min(b.endPos, b.startPos + 20)),
            },
        });
    }
    for (const s of slots) {
        symbols.push({
            name: `slot ${s.name}`,
            kind: 12,
            range: {
                start: doc.positionAt(s.startPos),
                end: doc.positionAt(s.endPos),
            },
            selectionRange: {
                start: doc.positionAt(s.startPos),
                end: doc.positionAt(Math.min(s.endPos, s.startPos + 20)),
            },
        });
    }
    return symbols;
});
connection.languages.semanticTokens.on((params) => {
    try {
        const doc = documents.get(params.textDocument.uri);
        if (!doc)
            return { data: [] };
        const text = doc.getText();
        const built = buildSemanticTokensFromText(text);
        const legendTypes = Array.from(semanticTokenTypes);
        const legendMods = Array.from(semanticTokenModifiers);
        const data = [];
        let prevLine = 0;
        let prevChar = 0;
        for (const t of built.sort((a, b) => a.line - b.line || a.char - b.char)) {
            const lineDelta = t.line - prevLine;
            const charDelta = lineDelta === 0 ? t.char - prevChar : t.char;
            const tokenType = Math.max(0, legendTypes.indexOf(t.type));
            const modMask = (t.modifiers || []).reduce((acc, m) => {
                const idx = legendMods.indexOf(m);
                return idx >= 0 ? acc | (1 << idx) : acc;
            }, 0);
            data.push(lineDelta, charDelta, t.length, tokenType, modMask);
            prevLine = t.line;
            prevChar = t.char;
        }
        return { data };
    }
    catch (e) {
        logError(e, 'semanticTokens.on');
        return { data: [] };
    }
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map