module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};\n");
        out.push("\n");
        out.push("let ComplexQuery  = require(\"@grainjs/loaders\").ComplexQuery;\n");
        out.push("let extractor    = require(global.USEGLOBAL('/lib/extractor')).extractor;\n");
        out.push("\n");
        out.push((partial(context, "query")) + "\n");
        out.push("\n");
        out.push((partial(context, "extractor")) + "\n");
        const [namespace, name] = context.name.split('.');
        out.push("\n");
        out.push("\n");
        out.push("let " + (name) + " = global.CustomQuery." + (name) + " = exports." + (name) + " = function (db, prm, callback) {\n");
        out.push("    ComplexQuery.execQuery(db, query(prm), function(err, data) {\n");
        out.push("        if(err) return callback(err);\n");
        if (context.extractor && context.extractor.length > 0) {
            out.push("\n");
            out.push("        extractData.call(this, db, prm, data, callback);\n");
        } else {
            out.push("\n");
            out.push("        callback(err, data);\n");
        }
        out.push("\n");
        out.push("    });\n");
        out.push("};");
        return out.join('');
    },
    compile: function() {
        this.aliases = {};
        this.aliases["query"] = "server/Meta.Query/query.query.njs";
        this.factory.ensure("server/Meta.Query/query.query.njs");
        this.aliases["extractor"] = "server/Meta.Query/query.extractor.njs";
        this.factory.ensure("server/Meta.Query/query.extractor.njs");
    },
    dependency: {
        "server/Meta.Query/query.query.njs": true,
        "query": true,
        "server/Meta.Query/query.extractor.njs": true,
        "extractor": true
    }
};

//# sourceMappingURL=generators/server/Meta.Query/meta.query.njs.js.map