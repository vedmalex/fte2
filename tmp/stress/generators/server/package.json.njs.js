module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("{\n");
        out.push("  \"name\": \"" + (context.name) + "\",\n");
        out.push("  \"version\": \"0.0.1\",\n");
        out.push("  \"description\": \"grainjs application bundle for '" + (context.name) + "'\",\n");
        out.push("  \"main\": \"start.js\",\n");
        out.push("  \"dependencies\": {");
        let modules = context.modules.toArray();
        let len = modules.length ?? 0;
        for(let i = 0; i < len; i++){
            let module = modules[i];
            out.push("\"" + (module.name) + "\":\"" + (module.version ? module.version : '*') + "\"");
            if (i != len - 1) {
                out.push(",");
            }
        }
        out.push("\n");
        out.push("  },\n");
        out.push("  \"scripts\": {\n");
        out.push("    \"start\": \"node start.js\",\n");
        out.push("    \"debug\": \"DEBUG=* node start.js\"\n");
        out.push("    }\n");
        out.push("}");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/package.json.njs.js.map