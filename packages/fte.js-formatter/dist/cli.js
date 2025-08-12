#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const index_1 = require("./index");
function printHelp() {
    console.log(`fte-format - FTE template formatter/linter\n\nUsage:\n  fte-format [--write] [--check] <file...>\n  fte-format              # read from stdin, write to stdout\n\nOptions:\n  --write   Overwrite files with formatted content\n  --check   Exit with non-zero if files would change\n  -h, --help  Show help\n`);
}
async function main(argv) {
    const args = argv.slice(2);
    if (args.includes('-h') || args.includes('--help')) {
        printHelp();
        process.exit(0);
    }
    const write = args.includes('--write');
    const check = args.includes('--check');
    const files = args.filter(a => !a.startsWith('-'));
    if (files.length === 0) {
        const input = await new Promise((resolve, reject) => {
            let data = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', chunk => (data += chunk));
            process.stdin.on('end', () => resolve(data));
            process.stdin.on('error', reject);
        });
        const out = (0, index_1.format)(input);
        process.stdout.write(out);
        process.exit(0);
    }
    let wouldChange = false;
    for (const file of files) {
        const abs = path_1.default.resolve(process.cwd(), file);
        const src = fs_1.default.readFileSync(abs, 'utf8');
        const dst = (0, index_1.format)(src);
        const issues = (0, index_1.lint)(src);
        for (const issue of issues) {
            const loc = `${file}:${issue.line}:${issue.column}`;
            const sev = issue.severity.toUpperCase();
            console.log(`${sev} ${issue.ruleId} ${loc} ${issue.message}`);
        }
        if (dst !== src) {
            wouldChange = true;
            if (write) {
                fs_1.default.writeFileSync(abs, dst, 'utf8');
                console.log(`formatted ${file}`);
            }
            else if (!check) {
                console.log(`would format ${file}`);
            }
        }
    }
    if (check && wouldChange)
        process.exit(1);
}
main(process.argv).catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map