/**
 * @typedef {object} Template_Context
 */
const Factory = require("fte.js-standalone").TemplateFactoryStandalone;
const templates = {};
exports.templates = templates;
const F = new Factory(templates);
function run(context, name) {
    return F.run(context, name);
}
exports.run = run;
