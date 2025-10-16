module.exports = {
    chunks: "$$$main$$$",
    alias: [
        "ui-data-adapters"
    ],
    script: function(model, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = model;
            return _content(blockName, ctx, content, partial, slot);
        }
        var out = [];
        const _partial = partial;
        partial = function(obj, template) {
            const result = _partial(obj, template);
            if (Array.isArray(result)) {
                result.forEach((r)=>{
                    chunkEnsure(r.name, r.content);
                });
                return '';
            } else {
                return result;
            }
        };
        const main = '$$$main$$$';
        var current = main;
        let outStack = [
            current
        ];
        let result;
        function chunkEnsure(name, content) {
            if (!result) {
                result = {};
            }
            if (!result.hasOwnProperty(name)) {
                result[name] = content ? content : [];
            }
        }
        function chunkStart(name) {
            chunkEnsure(name);
            chunkEnd();
            current = name;
            out = [];
        }
        function chunkEnd() {
            result[current].push(...out);
            out = [];
            current = outStack.pop() || main;
        }
        chunkStart(main);
        chunkStart(`fragments.js`);
        out.push("\n");
        out.push("import gql from 'graphql-tag';\n");
        out.push("\n");
        out.push("export default {\n");
        model.entities.filter((e)=>!e.abstract).forEach((item)=>{
            out.push("\n");
            out.push("  " + (item.name) + ":{\n");
            out.push("    query: (fragments) => gql`\n");
            out.push("      fragment Query" + (item.name) + " on " + (item.name) + " {\n");
            out.push("      ");
            item.props.forEach((prop)=>{
                const { ref, embedded, stored, single } = prop;
                if (item.embedded && prop.name === 'id') return;
                if (ref && single && !embedded) {
                    out.push((prop.name) + ": " + (prop.name) + "Id");
                } else if (ref && !single && !embedded) {
                    out.push((prop.name) + ": " + (prop.name) + "Ids");
                } else {
                    out.push((prop.name) + " ");
                    if (ref) {
                        out.push(" { ...Query" + (prop.gqlType) + " } ");
                    }
                }
                out.push("\n");
                out.push("      ");
            });
            out.push("\n");
            out.push("      }\n");
            out.push("      ");
            item.props.filter((f)=>f.ref && f.embedded).forEach((prop)=>{
                const { ref } = prop;
                out.push("${fragments." + (prop.ref.entity) + ".query(fragments)}\n");
                out.push("      ");
            });
            out.push("\n");
            out.push("    `\n");
            out.push("  },\n");
        });
        out.push("\n");
        out.push("}");
        chunkStart(`data-provider.js`);
        out.push("\n");
        out.push("\n");
        out.push("import clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';\n");
        out.push("import fragments from './fragments';\n");
        out.push("import resources from './ui/resources';\n");
        out.push("import ApolloClient from 'apollo-boost';\n");
        out.push("\n");
        out.push("const client = new ApolloClient({\n");
        out.push("  uri: '/api/" + (model.name) + "',\n");
        out.push("  request: operation => {\n");
        out.push("    const token = localStorage.getItem('token');\n");
        out.push("    operation.setContext({\n");
        out.push("      headers: {\n");
        out.push("        authorization: token ? `Bearer ${token}` : '',\n");
        out.push("      },\n");
        out.push("    });\n");
        out.push("  },\n");
        out.push("});\n");
        out.push("\n");
        out.push("export default clientProvider(client, fragments, resources);");
        chunkStart(`auth-provider.js`);
        out.push("\n");
        out.push("import ApolloClient from 'apollo-boost';\n");
        out.push("\n");
        out.push("const client = new ApolloClient({\n");
        out.push("  uri: '/api/admin',\n");
        out.push("  request: operation => {\n");
        out.push("    const token = localStorage.getItem('token');\n");
        out.push("    operation.setContext({\n");
        out.push("      headers: {\n");
        out.push("        authorization: token ? `Bearer ${token}` : '',\n");
        out.push("      },\n");
        out.push("    });\n");
        out.push("  },\n");
        out.push("});\n");
        out.push("\n");
        out.push("import authProvider from 'ra-gen-ui-lib/dist/client/authProviderRemote';\n");
        out.push("export default authProvider(client);");
        chunkStart(`auth-provider-fb.js`);
        out.push("\n");
        out.push("\n");
        out.push("import firebase from 'firebase/app';\n");
        out.push("import 'firebase/auth';\n");
        out.push("\n");
        out.push("import client from '../../configure/client.json'\n");
        out.push("\n");
        out.push("if (firebase.apps.length === 0) {\n");
        out.push("  firebase.initializeApp(client);\n");
        out.push("  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);\n");
        out.push("}\n");
        out.push("\n");
        out.push("import authProvider from 'ra-gen-ui-lib/dist/client/authProviderClient';\n");
        out.push("export default authProvider(firebase.auth.Auth.Persistence.LOCAL);");
        chunkStart(`data-provider-fb-auth.js`);
        out.push("\n");
        out.push("import clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';\n");
        out.push("import { firebaseLoaded } from 'ra-gen-ui-lib/dist/client/authProviderClient';\n");
        out.push("import fragments from './fragments';\n");
        out.push("import resources from './ui/resources';\n");
        out.push("import ApolloClient from 'apollo-boost';\n");
        out.push("import firebase from 'firebase/app';\n");
        out.push("import 'firebase/auth';\n");
        out.push("\n");
        out.push("import clientKey from '../../configure/client.json'\n");
        out.push("\n");
        out.push("if (firebase.apps.length === 0) {\n");
        out.push("  firebase.initializeApp(clientKey);\n");
        out.push("  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);\n");
        out.push("}\n");
        out.push("\n");
        out.push("const client = new ApolloClient({\n");
        out.push("  uri: '/api/" + (model.name) + "',\n");
        out.push("  request: async operation => {\n");
        out.push("    await firebaseLoaded();\n");
        out.push("    if (firebase.auth().currentUser) {\n");
        out.push("      const token = await firebase.auth().currentUser.getIdToken()\n");
        out.push("      operation.setContext({\n");
        out.push("        headers: {\n");
        out.push("          authorization: token ? `Bearer ${token}` : '',\n");
        out.push("        },\n");
        out.push("      })\n");
        out.push("    } else {\n");
        out.push("      throw new Error('unauthenticated')\n");
        out.push("    }\n");
        out.push("  },\n");
        out.push("});\n");
        out.push("\n");
        out.push("export default clientProvider(client, fragments, resources);");
        chunkEnd();
        out = Object.keys(result).filter((i)=>i !== '$$$main$$$').map((curr)=>({
                name: curr,
                content: result[curr]
            }));
        if (out.some((t)=>typeof t == 'object')) {
            return out.map(chunk = ({
                ...chunk,
                content: Array.isArray(chunk.content) ? chunk.content.join('') : chunk.content
            }));
        } else {
            return out.join('');
        }
    },
    compile: function() {
        this.chunks = "$$$main$$$";
        this.alias = [
            "ui-data-adapters"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/next-js/ui-data-adapters.njs.js.map