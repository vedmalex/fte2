<#@ context "entity" -#>
<#@ alias 'forms-filter' -#>

import React, { useContext } from "react";
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import { UIXContext } from '../contexts';
import { useTranslate } from 'react-admin';

const FilterPanel = ({ classes, ...props }) => {
  const uix = useContext(UIXContext);
  const translate = useTranslate();
  return (
  <uix.Filter {...props} >

<#-if (entity.UI.quickSearch) {#>
    <uix.TextInput label="uix.filter.search" source="q" allowEmpty alwaysOn />
<#}#>

 <# entity.lists.all.forEach((f, index) => {
  const ctx = {
    entity,
    f,
    source:'',
    label:'',
  }
#>
  #{partial(ctx, 'display-filter-entity')}
<#});#>
  </uix.Filter>
  );
}

export default withStyles(styles)(FilterPanel);