<#@ context "entity" -#>
<#@ alias 'forms-list' -#>
<#- const listActions = entity.actions.filter(a=> a.actionType==='listAction') -#>
<#- const itemActions = entity.actions.filter(a=> a.actionType==='itemAction') -#>
import React, { useContext, cloneElement } from "react";
import { UIXContext } from '../contexts';
import {
  useTranslate,
  TopToolbar,
  ExportButton,
  sanitizeListRestProps
} from 'react-admin';

<# if(listActions.length > 0){#>

const #{entity.name}ActionButtons = (props) => {
  const uix = useContext(UIXContext);
  const translate = useTranslate();

  return (
  <React.Fragment>
<#listActions.forEach(action => {#>
    <uix.#{entity.name}.#{action.fullName} {...props} />
<#})#>
    {/* Add the default bulk delete action */}
    <uix.BulkDeleteButton {...props} />
  </React.Fragment>
);}

<#}#>

const ListView = (props) => {
  const uix = useContext(UIXContext);
  const translate = useTranslate();
  return (
  <uix.List {...props}
  filters={<uix.#{entity.name}.Filter />}
  actions={<ListActions permissions={props.permissions} />}
  title={translate("resources.#{entity.name}.name", { smart_count:2 })}
<#if(listActions.length > 0){#>
  bulkActionButtons={<#{entity.name}ActionButtons />}
<#}#>
  >
    <uix.#{entity.name}.Grid />
  </uix.List>
);}

export default ListView;

const ListActions = ({
  currentSort,
  className,
  resource,
  filters,
  displayedFilters,
  exporter, // you can hide ExportButton if exporter = (null || false)
  filterValues,
  permanentFilter,
  hasCreate, // you can hide CreateButton if hasCreate = false
  basePath,
  selectedIds,
  onUnselectItems,
  showFilter,
  maxResults,
  total,
  permissions,
  ...rest
}) => {
  const uix = useContext(UIXContext);
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
      <uix.#{entity.name}.CreateButton
        {...rest}
        label="ra.action.create"
        resource={resource}
      />
      <ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filter={{ ...filterValues, ...permanentFilter }}
        exporter={exporter}
        maxResults={maxResults}
      />
    </TopToolbar>
  );
};

ListActions.defaultProps = {
  selectedIds: [],
  onUnselectItems: () => null,
};
