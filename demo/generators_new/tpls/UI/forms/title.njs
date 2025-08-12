<#@ context "entity" -#>
<#@ alias 'forms-title' -#>

import React, { useContext } from "react";
import { UIXContext } from '../contexts';
import { useTranslate } from 'react-admin';

const Title = ({ record }) => {
  const uix = useContext(UIXContext);
  const translate = useTranslate();

  return (
  <span>
    {translate('resources.#{entity.name}.name', {smart_count : 1})} "<uix.#{entity.name}.SelectTitle record={record}/>"
  </span>
);}

export default Title;