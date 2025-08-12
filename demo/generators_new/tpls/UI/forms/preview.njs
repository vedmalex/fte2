<#@ context "entity" -#>
<#@ alias 'forms-preview' -#>

import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { UIXContext } from '../contexts';

const styles = theme => ({
  field: {
    // These styles will ensure our drawer don't fully cover our
    // application when teaser or title are very long
    '& span': {
      display: 'inline-block',
      maxWidth: '30rem',
    },
  },
});

const #{entity.name}PreviewView = ({ classes, ...props }) => {
  const uix = useContext(UIXContext);
  return (
    <uix.SimpleShowLayout {...props}>
    <# const ctx={
        entity:{
        ...entity,
        props: entity.lists.preview,
      }, 
      source:'' } #>
      #{partial(ctx, 'display-show-entity')}
    </uix.SimpleShowLayout>
  );
};

const mapStateToProps = (state, props) => ({
  // Get the record by its id from the react-admin state.
  record: state.admin.resources.#{entity.name}
    ? state.admin.resources.#{entity.name}.data[props.id]
    : null,
  version: state.admin.ui.viewVersion,
});

const #{entity.name}Preview = connect(
  mapStateToProps,
  {},
)(withStyles(styles)(#{entity.name}PreviewView));

export default #{entity.name}Preview;