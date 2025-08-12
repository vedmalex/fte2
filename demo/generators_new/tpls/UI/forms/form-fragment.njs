<#@ context "entity" -#>
<#@ alias 'forms-form-fragments' -#>
<# const rels = entity.props.filter(f=>f.ref).filter(r=>!r.single && !r.ref.embedded); #>

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { UIXContext } from '../contexts';
import useListParams from 'ra-core/lib/controller/useListParams';

<# if(entity.actions.length > 0){#>
import { connect } from 'react-redux';
import ExecuteActionIcon from '@material-ui/icons/Settings';
<#}#>

// action definitions
#{content('actions')}

// rel buttons
#{content('add-buttons')}

<# block 'actions' : -#>
<# entity.actions.forEach(action=>{#>
export const #{action.actionName} = '#{action.actionName}';
export const #{action.actionCreatorName} = (data) => ({
  type: #{action.actionName},
  payload: { data, resource: '#{entity.model.entityPathMapper[entity.name]}' },
  // dataProvider hack
  meta: { fetch: 'EXECUTE', resource: '#{action.actionCreatorName}' },
});

/**
  // define this method in dataProvider to use this
  async function #{action.actionCreatorName}(data, resource){

  }
*/

const #{action.fullName}Action  = ({ #{action.actionCreatorName}, record, selectedIds, children }) => {
  const uix = useContext(UIXContext);
  return (
  <uix.Button onClick={() =>
    #{action.actionCreatorName}({record, selectedIds})
  }
  label="resources.#{entity.name}.actions.#{action.name}"
  >
    {children ? children : (<ExecuteActionIcon/>)}
  </uix.Button>);}


#{action.fullName}Action.propTypes = {
  #{action.actionCreatorName}: PropTypes.func.isRequired,
  record: PropTypes.object,
};


export const #{action.fullName}Button = connect(null, {
  #{action.actionCreatorName},
})(#{action.fullName}Action);
<#})#>

export const actions = {
<# entity.actions.forEach(action=>{#>
  #{action.name}:{
    type:'#{action.actionType}',
    creator: #{action.actionCreatorName},
    action: #{action.actionName},
    button: #{action.fullName}Button,
  },
<#})#>
}

<# end #>

<# block 'add-buttons' : #>
<#@ context 'entity'#>
const Add#{entity.name} = ({ record, target, label, children }) => {
  const location = useLocation()
  const uix = useContext(UIXContext);
  const to = {
    pathname: `/#{entity.model.entityPathMapper[entity.name]}/create`,
  };

  to.state = { pathname: location.pathname };
  const newRecord = target && record && record.id ? { [target]: record.id } : undefined;
  if (newRecord) {
    to.state.record = newRecord;
  }
  return (
    <uix.Button
      component={Link}
      to={to}
      label={label}>
      {children || <AddIcon/>}
    </uix.Button>
  );
};

Add#{entity.name}.propTypes = {
  record: PropTypes.object,
  target: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

const Create#{entity.name}Button = ({ resource, label, children }) => {
  const location = useLocation()
  const uix = useContext(UIXContext);
  const [{ filterValues }] = useListParams({ resource, location });
  const record = filterValues
    ? Object.keys(filterValues).reduce((rec, fld) => {
        if (fld.match(/-eq/)) {
          rec[fld.split('-')[0]] = filterValues[fld];
        }
        return rec;
      }, {})
    : undefined;
  const to = {
    pathname: `/#{entity.model.entityPathMapper[entity.name]}/create`,
  };
  to.state = { pathname: location.pathname };
  if (record) {
    to.state.record = record;
  }
  return (
    <uix.Button component={Link} to={to} label={label}>
      {children || <AddIcon />}
    </uix.Button>
  );
};

Create#{entity.name}Button.propTypes = {
  label: PropTypes.string.isRequired,
};

export const buttons = {
  Add: Add#{entity.name},
  CreateButton: Create#{entity.name}Button,
  <# entity.actions.forEach(action=>{#>
  #{action.fullName}: #{action.fullName}Button,
  <#-})#>
}
<# end #>