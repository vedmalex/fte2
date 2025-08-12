<#@ context "entity" -#>
<#@ alias 'forms-index' -#>

import React, { useContext } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Title  from './title';
import SelectTitle, { inputText }  from './selectTitle';
import Filter  from './filter';
import { buttons, actions }  from './fragments';
import {
  CreateFormSimple,
  EditFormSimple,
  CreateFormTabbed,
  EditFormTabbed,
  ShowSimpleView,
  ShowTabbedView,
  TabbedForm,
  SimpleForm,
}  from './form';
import List  from './list';
import Grid  from './grid';
import CardView  from './cardView';
import GridView  from './gridView';
import ListView  from './listView';
import Preview  from './preview';
import { UIXContext } from '../contexts';

const Show = (props) => {
  const uix = useContext(UIXContext);
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const Result = isSmall ? uix.#{entity.name}.ShowSimpleView : uix.#{entity.name}.ShowTabbedView
  return (
    <Result {...props} />
  );
}

const Edit = (props) => {
  const uix = useContext(UIXContext);
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const Result = isSmall ? uix.#{entity.name}.EditFormSimple : uix.#{entity.name}.EditFormTabbed
  return (
    <Result {...props} />
  );
}

const Create = (props) => {
  const uix = useContext(UIXContext);
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const Result = isSmall ? uix.#{entity.name}.CreateFormSimple : uix.#{entity.name}.CreateFormTabbed
  return (
    <Result {...props} />
);}

export default {
  name: '#{entity.name}',
  Title,
  SelectTitle,
  inputText,
  Filter,
  List,
  Create,
  Edit,
  Show,
  TabbedForm,
  SimpleForm,
  CreateFormSimple,
  CreateFormTabbed,
  EditFormSimple,
  EditFormTabbed,
  ShowSimpleView,
  ShowTabbedView,
  Preview,
  Grid,
  CardView,
  GridView,
  ListView,
  ...buttons,
  ...actions,
};