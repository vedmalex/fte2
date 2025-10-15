module.exports = {
    alias: [
        "forms-show-base"
    ],
    script: function(entity, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = entity;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        out.push("import React from \"react\";\n");
        out.push("import PropTypes from 'prop-types';\n");
        out.push("import {\n");
        out.push("  " + (content('import-from-react-admin')) + "\n");
        out.push("  " + (slot('import-from-react-admin-show')) + "\n");
        out.push("} from \"react-admin\";\n");
        out.push((slot('import-from-ra-ui-components-show')) + "\n");
        out.push("const ShowRecordView = (props, context) => {\n");
        out.push("  const { uix } = context;\n");
        out.push("  const { Title } = uix['" + (entity.role) + "/" + (entity.name) + "'];\n");
        const manyRels = entity.relations.filter((f)=>!f.single);
        if (manyRels.length > 0) {
            out.push("\n");
            const uniqueEntities = manyRels.filter((f)=>!f.single).reduce((hash, curr)=>{
                hash[curr.ref.entity] = curr;
                return hash;
            }, {});
            Object.keys(uniqueEntities).forEach((key)=>{
                let f = uniqueEntities[key];
                out.push("\n");
                out.push("  const " + (f.ref.entity) + " = uix['" + (entity.role) + "/" + (f.ref.entity) + "'];\n");
            });
            out.push("\n");
        }
        out.push("\n");
        out.push("  return (");
        return out.join('');
    },
    blocks: {
        "import-from-react-admin-show', 'Show": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "<Show title={<Title />} {...props}>": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "view": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "</Show>": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        ");": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "};": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "ShowRecordView.contextTypes = {": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "uix: PropTypes.object.isRequired,": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "translate: PropTypes.func.isRequired,": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "}": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        },
        "export default ShowRecordView;": function(context, _content, partial, slot, options) {
            function content(blockName, ctx) {
                if (ctx === undefined || ctx === null) ctx = context;
                return _content(blockName, ctx, content, partial, slot);
            }
            var out = [];
            return out.join('');
        }
    },
    compile: function() {
        this.alias = [
            "forms-show-base"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=slots/show-base.njs.js.map