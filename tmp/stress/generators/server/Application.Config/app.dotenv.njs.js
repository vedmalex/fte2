module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("DEBUG_STAGE_TIMEOUT=10000\n");
        out.push("DEBUG_APP=false\n");
        out.push("NO_CLIENT_CACHE=" + (context.noClientCache) + "\n");
        out.push("NO_HEALTH_CHECK=" + (context.noHealthCheck) + "\n");
        out.push("NO_SERVER_CACHE=" + (context.noServerCache) + "\n");
        out.push("NO_TRANSLATION_TOOLS=" + (context.noTranslationTools) + "\n");
        out.push("PORT=" + (context.httpPort || 3000) + "\n");
        out.push("THEME=" + (context.theme || '') + "\n");
        out.push("DIRECT_TIMEOUT=" + (context.directEntryTimeout || 100000) + "\n");
        out.push("DIRECT_API_BUFFER=" + (context.directApiBufferTime || 0) + "\n");
        out.push("TRANSLATION=false\n");
        out.push("APP_NAME=" + (context.name) + "\n");
        out.push("RTL=" + (context.rtl) + "\n");
        out.push("LOCALE=" + (context.language) + "\n");
        out.push("SYSTEM_URL=" + (context.dbUrl) + "\n");
        out.push("LOCAL_URL=" + (context.dbUrl) + "\n");
        out.push("#COOKIE_SECRET='your secret here'\n");
        if (!context.filesDb || context.filesDb === context.dbUrl) {
            out.push("#");
        }
        out.push("FILES_URL=" + (context.filesDb ?? "") + "\n");
        if (!context.usersDb || context.usersDb === context.dbUrl) {
            out.push("#");
        }
        out.push("USERS_URL=" + (context.usersDb ?? "") + "\n");
        if (!context.auditDb || context.auditDb === context.dbUrl) {
            out.push("#");
        }
        out.push("AUDIT_URL=" + (context.auditDb ?? "") + "\n");
        if (!context.transactionsDb || context.transactionsDb === context.dbUrl) {
            out.push("#");
        }
        out.push("TRANSACTIONS_URL=" + (context.transactionsDb ?? "") + "\n");
        if (!context.sessionDb || context.sessionDb === context.dbUrl) {
            out.push("#");
        }
        out.push("SESSION_URL=" + (context.sessionDb ?? "") + "\n");
        if (context.env) {
            const env = JSON.parse(context.env);
            const envList = Object.keys(env);
            for(let i = 0; i < envList.length; i++){
                const key = envList[i];
                out.push((key) + "=" + (env[key]) + "\n");
            }
        }
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/app.dotenv.njs.js.map