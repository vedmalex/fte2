<#@ context "entity" -#>
<#@ alias 'forms-select-title' -#>

import React from "react";

export const inputText = record => record ? (
    <#- entity.UI.listName.forEach(ln=>{-#>
      record.#{ln} ||
    <#-})-#>
    record.id ):'';

const Title = ({ record }) => (
  <span>{record ? (
    <#- entity.UI.listName.forEach(ln=>{-#>
      record.#{ln} ||
    <#-})-#>
    record.id ):''}</span>
);

export default Title;