module.exports = {
    chunks: "api.js",
    alias: [
        "graphql-api"
    ],
    script: function(context, _content, partial, slot, options) {
        function content(blockName, ctx) {
            if (ctx === undefined || ctx === null) ctx = context;
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
        const main = 'api.js';
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
        const { model, nextApp } = context;
        out.push("\n");
        chunkStart(`${model.name}.js`);
        out.push("\n");
        out.push("import { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro'\n");
        out.push("\n");
        out.push("import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'\n");
        out.push("\n");
        out.push("import admin from 'firebase-admin'\n");
        out.push("import firebase from 'firebase/app'\n");
        out.push("import 'firebase/auth'\n");
        out.push("import fetch from 'isomorphic-unfetch'\n");
        out.push("\n");
        out.push("import { merge } from 'lodash'\n");
        out.push("import firebaseServiceAccount from '../../configure/account.json'\n");
        out.push("import firebaseClientAccount from '../../configure/client.json'\n");
        out.push("import {\n");
        out.push("  AclDirective,\n");
        out.push("  FirebaseAdmin,\n");
        out.push("} from 'ra-gen-ui-lib/dist/server/firebase-admin'\n");
        out.push("import gqlLodash from 'ra-gen-ui-lib/dist/server/lodash'\n");
        out.push("import { LodashSchema } from '@grainjs/gql-lodash'\n");
        out.push("import DataProvider from 'ra-gen-ui-lib/dist/server/dataProviderFirebaseAdmin'\n");
        out.push("import trackedResources from './../../components/students/ui/resources'\n");
        out.push("\n");
        out.push("import { Schema } from '@grainjs/gql-schema-builder'\n");
        const gqlItems = [
            ...model.enums.map((i)=>i.name),
            ...model.entities.filter((i)=>!i.abstract).map((i)=>i.name)
        ];
        out.push("\n");
        out.push("\n");
        gqlItems.forEach((i)=>{
            out.push("\n");
            out.push("import " + (i) + " from '" + (nextApp ? '../../' : './') + "graphql/" + (i) + "';\n");
        });
        out.push("\n");
        out.push("\n");
        out.push("if (!admin.apps.length) {\n");
        out.push("  admin.initializeApp({\n");
        out.push("    credential: admin.credential.cert(firebaseServiceAccount),\n");
        out.push("  })\n");
        out.push("}\n");
        out.push("\n");
        out.push("if (firebase.apps.length === 0) {\n");
        out.push("  firebase.initializeApp(firebaseClientAccount)\n");
        out.push("  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)\n");
        out.push("}\n");
        out.push("\n");
        out.push("export const dataProvider = new DataProvider({\n");
        out.push("  trackedResources,\n");
        out.push("})\n");
        out.push("\n");
        out.push("const model = new Schema({\n");
        out.push("  schema:gql`\n");
        out.push("  scalar JSON\n");
        out.push("  scalar JSONObject\n");
        out.push("  scalar ID\n");
        out.push("  scalar Date\n");
        out.push("\n");
        out.push(" input Pagination {\n");
        out.push("    page: Int\n");
        out.push("    perPage: Int\n");
        out.push("  }\n");
        out.push("\n");
        out.push("  enum SortOrder {\n");
        out.push("    ASC\n");
        out.push("    DESC\n");
        out.push("  }\n");
        out.push("\n");
        out.push("  input Sort {\n");
        out.push("    field: String!\n");
        out.push("    order: SortOrder!\n");
        out.push("  }\n");
        out.push("\n");
        out.push("  type IdsResult {\n");
        out.push("    data: [ID]\n");
        out.push("  }\n");
        out.push("`,\n");
        out.push("  items:[\n");
        out.push("  ");
        gqlItems.forEach((i)=>{
            out.push("\n");
            out.push("  " + (i) + ",\n");
            out.push("  ");
        });
        out.push("\n");
        out.push("    FirebaseAdmin,\n");
        out.push("    LodashSchema,\n");
        out.push("  ]\n");
        out.push("})\n");
        out.push("\n");
        out.push("model.build();\n");
        out.push("\n");
        out.push("const resolvers = merge({\n");
        out.push("  JSON: GraphQLJSON,\n");
        out.push("  JSONObject: GraphQLJSONObject,\n");
        out.push("},\n");
        out.push("  model.resolvers,\n");
        out.push(");\n");
        out.push("\n");
        out.push("function checkPermissions(permissions, context) {\n");
        out.push("  if (permissions.length > 0) {\n");
        out.push("    if (permissions.indexOf('AUTHENTICATED') > -1) {\n");
        out.push("      return !!context.user\n");
        out.push("    } else if (context.user?.customClaims) {\n");
        out.push("      return permissions.some(\n");
        out.push("        (p) => context.user?.customClaims[p.toLowerCase()],\n");
        out.push("      )\n");
        out.push("    } else {\n");
        out.push("      return false\n");
        out.push("    }\n");
        out.push("  } else {\n");
        out.push("    return true\n");
        out.push("  }\n");
        out.push("}\n");
        out.push("\n");
        out.push("const apolloServer = new ApolloServer({\n");
        out.push("  typeDefs: model.schema,\n");
        out.push("  resolvers,\n");
        out.push("  schemaDirectives: {\n");
        out.push("    acl: AclDirective,\n");
        out.push("  },\n");
        out.push("  plugins: [gqlLodash({ name: 'aggregations' })],\n");
        out.push("  context: async ({ req }) => {\n");
        out.push("    const auth = req.headers.authorization\n");
        out.push("    const token = auth ? auth.match(/Bearer (.*)/)[1] : false\n");
        out.push("    let user\n");
        out.push("    if (token) {\n");
        out.push("      try {\n");
        out.push("        user = await admin\n");
        out.push("          .auth()\n");
        out.push("          .verifyIdToken(token)\n");
        out.push("          .then((user) => admin.auth().getUser(user.uid))\n");
        out.push("      } catch (e) {\n");
        out.push("        throw new AuthenticationError(e.message)\n");
        out.push("      }\n");
        out.push("    }\n");
        out.push("    return {\n");
        out.push("      user,\n");
        out.push("      dataProvider,\n");
        out.push("      resolvers,\n");
        out.push("      admin,\n");
        out.push("      firebase,\n");
        out.push("      fetch,\n");
        out.push("      client: firebaseClientAccount,\n");
        out.push("      checkPermissions,\n");
        out.push("    }\n");
        out.push("  },\n");
        out.push("})\n");
        out.push("\n");
        out.push("export const config = {\n");
        out.push("  api: {\n");
        out.push("    bodyParser: false\n");
        out.push("  }\n");
        out.push("};\n");
        out.push("\n");
        out.push("export default apolloServer.createHandler({ path: `/api/" + (model.name) + "` });\n");
        out.push("//https://medium.com/@tomanagle/create-a-server-side-rendering-graphql-client-with-next-js-and-apollo-client-acd397f70c64");
        chunkEnd();
        out = Object.keys(result).filter((i)=>i !== 'api.js').map((curr)=>({
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
        this.chunks = "api.js";
        this.alias = [
            "graphql-api"
        ];
    },
    dependency: {}
};

//# sourceMappingURL=generators_new/tpls/graphql/graphql-api.njs.js.map