<#@ noContent #>
<#@ requireAs('server/Meta.Query/query.query.njs','query') #>
<#@ requireAs('server/Meta.Query/query.extractor.njs','extractor') #>

if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};

let ComplexQuery  = require("@grainjs/loaders").ComplexQuery;
let extractor    = require(global.USEGLOBAL('/lib/extractor')).extractor;

#{partial(context,"query")}

#{partial(context,"extractor")}
<# const [namespace, name] = context.name.split('.');#>

let #{name} = global.CustomQuery.#{name} = exports.#{name} = function (db, prm, callback) {
    ComplexQuery.execQuery(db, query(prm), function(err, data) {
        if(err) return callback(err);
<#-if(context.extractor && context.extractor.length > 0){#>
        extractData.call(this, db, prm, data, callback);
<#-} else {#>
        callback(err, data);
<#-}#>
    });
};
