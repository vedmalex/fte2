module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("\n");
        out.push("DEBUG_STAGE_TIMEOUT=10000DEBUG_APP=falseNO_CLIENT_CACHE=" + (context.noClientCache) + "NO_HEALTH_CHECK=" + (context.noHealthCheck) + "NO_SERVER_CACHE=" + (context.noServerCache) + "NO_TRANSLATION_TOOLS=" + (context.noTranslationTools) + "PORT=" + (context.httpPort || 3000) + "THEME=" + (context.theme || '') + "DIRECT_TIMEOUT=" + (context.directEntryTimeout || 100000) + "DIRECT_API_BUFFER=" + (context.directApiBufferTime || 0) + "TRANSLATION=falseAPP_NAME=" + (context.name) + "RTL=" + (context.rtl) + "LOCALE=" + (context.language) + "SYSTEM_URL=" + (context.dbUrl) + "LOCAL_URL=" + (context.dbUrl) + "#COOKIE_SECRET='your secret here'\n");
        out.push("\n");
        if (!context.filesDb || context.filesDb === context.dbUrl) {
            out.push("\n");
            out.push("#\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("FILES_URL=" + (context.filesDb ?? "") + "\n");
        out.push("\n");
        if (!context.usersDb || context.usersDb === context.dbUrl) {
            out.push("\n");
            out.push("#\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("USERS_URL=" + (context.usersDb ?? "") + "\n");
        out.push("\n");
        if (!context.auditDb || context.auditDb === context.dbUrl) {
            out.push("\n");
            out.push("#\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("AUDIT_URL=" + (context.auditDb ?? "") + "\n");
        out.push("\n");
        if (!context.transactionsDb || context.transactionsDb === context.dbUrl) {
            out.push("\n");
            out.push("#\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("TRANSACTIONS_URL=" + (context.transactionsDb ?? "") + "\n");
        out.push("\n");
        if (!context.sessionDb || context.sessionDb === context.dbUrl) {
            out.push("\n");
            out.push("#\n");
            out.push("\n");
        }
        out.push("\n");
        out.push("SESSION_URL=" + (context.sessionDb ?? "") + "\n");
        out.push("\n");
        if (context.env) {
            const env = JSON.parse(context.env);
            const envList = Object.keys(env);
            for(let i = 0; i < envList.length; i++){
                const key = envList[i];
                out.push("\n");
                out.push((key) + "=" + (env[key]) + "\n");
                out.push("\n");
            }
        }
        out.push("");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/app.dotenv copy.njs.js.map