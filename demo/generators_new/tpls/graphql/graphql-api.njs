<#@ context "context" -#>
<#@ alias "graphql-api" -#>
<#@ chunks "api.js" -#>
<#
const { model, nextApp } = context;
#>
<#- chunkStart(`${model.name}.js`); #>
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro'

import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import admin from 'firebase-admin'
import firebase from 'firebase/app'
import 'firebase/auth'
import fetch from 'isomorphic-unfetch'

import { merge } from 'lodash'
import firebaseServiceAccount from '../../configure/account.json'
import firebaseClientAccount from '../../configure/client.json'
import {
  AclDirective,
  FirebaseAdmin,
} from 'ra-gen-ui-lib/dist/server/firebase-admin'
import gqlLodash from 'ra-gen-ui-lib/dist/server/lodash'
import { LodashSchema } from '@grainjs/gql-lodash'
import DataProvider from 'ra-gen-ui-lib/dist/server/dataProviderFirebaseAdmin'
import trackedResources from './../../components/students/ui/resources'

import { Schema } from '@grainjs/gql-schema-builder'
<#
const gqlItems = [
...model.enums.map(i=>i.name),
...model.entities.filter(i=>!i.abstract).map(i=>i.name),
];
#>

<# gqlItems.forEach(i=>{-#>
import #{i} from '#{ nextApp ? '../../' : './'}graphql/#{i}';
<#})#>

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccount),
  })
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseClientAccount)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
}

export const dataProvider = new DataProvider({
  trackedResources,
})

const model = new Schema({
  schema:gql`
  scalar JSON
  scalar JSONObject
  scalar ID
  scalar Date

 input Pagination {
    page: Int
    perPage: Int
  }

  enum SortOrder {
    ASC
    DESC
  }

  input Sort {
    field: String!
    order: SortOrder!
  }

  type IdsResult {
    data: [ID]
  }
`,
  items:[
  <# gqlItems.forEach(i=>{ -#>
  #{i},
  <#-})-#>
    FirebaseAdmin,
    LodashSchema,
  ]
})

model.build();

const resolvers = merge({
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
},
  model.resolvers,
);

function checkPermissions(permissions, context) {
  if (permissions.length > 0) {
    if (permissions.indexOf('AUTHENTICATED') > -1) {
      return !!context.user
    } else if (context.user?.customClaims) {
      return permissions.some(
        (p) => context.user?.customClaims[p.toLowerCase()],
      )
    } else {
      return false
    }
  } else {
    return true
  }
}

const apolloServer = new ApolloServer({
  typeDefs: model.schema,
  resolvers,
  schemaDirectives: {
    acl: AclDirective,
  },
  plugins: [gqlLodash({ name: 'aggregations' })],
  context: async ({ req }) => {
    const auth = req.headers.authorization
    const token = auth ? auth.match(/Bearer (.*)/)[1] : false
    let user
    if (token) {
      try {
        user = await admin
          .auth()
          .verifyIdToken(token)
          .then((user) => admin.auth().getUser(user.uid))
      } catch (e) {
        throw new AuthenticationError(e.message)
      }
    }
    return {
      user,
      dataProvider,
      resolvers,
      admin,
      firebase,
      fetch,
      client: firebaseClientAccount,
      checkPermissions,
    }
  },
})

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: `/api/#{model.name}` });
//https://medium.com/@tomanagle/create-a-server-side-rendering-graphql-client-with-next-js-and-apollo-client-acd397f70c64
