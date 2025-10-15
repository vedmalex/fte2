module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("// приложение будет хранить код Html и выдавать его по требованию клиента... код не будет лежать ни в каких старических ресурсах, тогда можно будет разделять по профилям код.... если это будет нужно\n");
        out.push("Ext.page(\"" + (context.name) + "\"," + (JSON.stringify(context.code)) + ");");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/Application.ScreenHtmlPage/serverPage.njs.js.map