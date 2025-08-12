<#@ context "model" -#>
<#@ chunks "$$$main$$$" -#>
<#@ alias "ui-data-adapters" -#>
<#- chunkStart(`fragments.js`); #>
import gql from 'graphql-tag';

export default {
<# model.entities.filter(e => !e.abstract).forEach(item=> {#>
  #{item.name}:{
    query: (fragments) => gql`
      fragment Query#{item.name} on #{item.name} {
      <#
      item.props.forEach(prop=> {
      const { ref, embedded, stored, single } = prop;
        if(item.embedded && prop.name === 'id') return;
      -#>
      <#-if(ref && single && !embedded) {-#>
      #{prop.name}: #{prop.name}Id
      <#-} else if(ref && !single && !embedded) {-#>
      #{prop.name}: #{prop.name}Ids
      <#-} else {-#>
      #{prop.name} <#if(ref){#> { ...Query#{prop.gqlType} } <#}#>
      <#-}#>
      <#})#>
      }
      <#item.props.filter(f=>f.ref && f.embedded).forEach(prop=>{
      const { ref } = prop;
      -#>
      ${fragments.#{prop.ref.entity}.query(fragments)}
      <#})#>
    `
  },
<# })#>
}

<#- chunkStart(`data-provider.js`); #>

import clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';
import fragments from './fragments';
import resources from './ui/resources';
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/api/#{model.name}',
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

export default clientProvider(client, fragments, resources);

<#- chunkStart(`auth-provider.js`); #>
import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: '/api/admin',
  request: operation => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

import authProvider from 'ra-gen-ui-lib/dist/client/authProviderRemote';
export default authProvider(client);

<#- chunkStart(`auth-provider-fb.js`); #>

import firebase from 'firebase/app';
import 'firebase/auth';

import client from '../../configure/client.json'

if (firebase.apps.length === 0) {
  firebase.initializeApp(client);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
}

import authProvider from 'ra-gen-ui-lib/dist/client/authProviderClient';
export default authProvider(firebase.auth.Auth.Persistence.LOCAL);

<#- chunkStart(`data-provider-fb-auth.js`); #>
import clientProvider from 'ra-gen-ui-lib/dist/client/remoteProvider';
import { firebaseLoaded } from 'ra-gen-ui-lib/dist/client/authProviderClient';
import fragments from './fragments';
import resources from './ui/resources';
import ApolloClient from 'apollo-boost';
import firebase from 'firebase/app';
import 'firebase/auth';

import clientKey from '../../configure/client.json'

if (firebase.apps.length === 0) {
  firebase.initializeApp(clientKey);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
}

const client = new ApolloClient({
  uri: '/api/#{model.name}',
  request: async operation => {
    await firebaseLoaded();
    if (firebase.auth().currentUser) {
      const token = await firebase.auth().currentUser.getIdToken()
      operation.setContext({
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      })
    } else {
      throw new Error('unauthenticated')
    }
  },
});

export default clientProvider(client, fragments, resources);
