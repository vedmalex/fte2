module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("{\n");
        out.push("  \"name\": \"" + (context.name.toLowerCase()) + "\",\n");
        out.push("  \"version\": \"0.0.1\",\n");
        out.push("  \"private\": \"true\",\n");
        out.push("  \"dependencies\": {\n");
        out.push("    \"@grainjs/grainjs\": \"" + (global.VERSION) + "\"\n");
        out.push("  },\n");
        out.push("  \"scripts\": {\n");
        out.push("    \"start\": \"npx grainjs edit\",\n");
        out.push("    \"start-mt-3\": \"npx grainjs editwt 3\",\n");
        out.push("    \"restore\": \"npx grainjs import\",\n");
        out.push("    \"debug\": \"node  --inspect-brk --trace-deprecation --trace-warnings ./node_modules/.bin/grainjs edit\"\n");
        out.push("  }\n");
        out.push("}");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.Config/package.json.njs.js.map