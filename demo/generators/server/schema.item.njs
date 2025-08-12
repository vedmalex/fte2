<#@ noContent #>
var schema = require(USEGLOBAL("schemaExport/registerImport.js"));

schema.register("#{context.itemType}",#{context.itemValue});