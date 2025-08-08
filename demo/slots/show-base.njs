<#@ context "entity" -#>
<#@ alias 'forms-show-base' -#>

import React from "react";
import PropTypes from 'prop-types';
import {
  #{content('import-from-react-admin')}
  #{slot('import-from-react-admin-show')}
} from "react-admin";
#{slot('import-from-ra-ui-components-show')}
const ShowRecordView = (props, context) => {
  const { uix } = context;
  const { Title } = uix['#{entity.role}/#{entity.name}'];
<#-
const manyRels = entity.relations.filter(f => !f.single);
if(manyRels.length > 0){#>
<#
 const uniqueEntities = manyRels.filter(f=> !f.single/*  && !entity.UI.embedded.names.hasOwnProperty(f.field) */)
  .reduce((hash, curr)=> {
    hash[curr.ref.entity] = curr;
    return hash;
  }, {});

  Object.keys(uniqueEntities).forEach(key=>{
    let f = uniqueEntities[key];
-#>
  const #{f.ref.entity} = uix['#{entity.role}/#{f.ref.entity}'];
<#})-#>
<#-}#>
  return (
<#- slot('import-from-react-admin-show', 'Show')#>
    <Show title={<Title />} {...props}>
      #{content('view')}
    </Show>
  );
};

ShowRecordView.contextTypes = {
  uix: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
}

export default ShowRecordView;