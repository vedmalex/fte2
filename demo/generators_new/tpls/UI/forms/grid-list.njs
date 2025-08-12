<#@ context "entity" -#>
<#@ alias 'forms-grid-list' -#>

import React, { useContext } from 'react';
import { UIXContext } from '../contexts';

const SmallList = (props) => {
   const uix = useContext(UIXContext);
  return (
  <uix.SimpleList {...props} primaryText={record => 
    <#- entity.UI.listName.forEach(ln=>{-#>
      record.#{ln} ||
    <#-})-#>
    record.id } />
);}

export default SmallList;
