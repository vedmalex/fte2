module.exports = {
    script: function(context, _content, partial, slot, options) {
        var out = [];
        out.push("#!upstart\n");
        out.push("description \"run app server for Modeleditor\"\n");
        out.push("author      \"grain.js-framework\"\n");
        out.push("\n");
        out.push("#start on startup\n");
        out.push("#stop on shutdown\n");
        out.push("start on (net-device-up\n");
        out.push("          and local-filesystems\n");
        out.push("          and runlevel [2345])\n");
        out.push("stop on runlevel [016]\n");
        out.push("\n");
        out.push("script\n");
        out.push("    cd \"" + (context.grainUserRoot) + "\"\n");
        out.push("    sudo grainjs run \"Modeleditor\" 2>&1 >> server.log\n");
        out.push("end script");
        return out.join('');
    },
    compile: function() {},
    dependency: {}
};

//# sourceMappingURL=generators/server/service/grainjs.app.service.conf.njs.js.map