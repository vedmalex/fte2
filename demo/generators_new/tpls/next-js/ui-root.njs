<#@ context 'model' #>
<#@ alias 'ui-root' -#>
<#@ chunks '$$$main$$$' -#>
<#- chunkStart(`index.js`); -#>

import React from 'react';
import Admin from './ui/admin';
import dataProvider from './data-provider-fb-auth';
import authProvider from './auth-provider-fb';

export default ({ title }) => (
  <Admin
    locale="russian"
    authProvider={authProvider}
    dataProvider={dataProvider}
    title={title}
  />
);
