<#@ context 'pack' -#>
<#@ alias 'ui-index' -#>
<#@ chunks '$$$main$$$' -#>

<#- chunkStart(`./resources.js`); -#>
const embedded = {
<# for(let entity of pack.entities.filter(e=> e.embedded)){-#>
  #{entity.name}: {
    uploadFields:[
      <#-entity.uploadFields.forEach(f=>{#>
      "#{f}",
      <#-})#>
    ]
  },
<#}-#>
}

export default [
<# for(let entity of pack.entities.filter(e=> !e.embedded)){-#>
  {
    name: "#{entity.name}",
    resource: "#{entity.resourceName}",
    path: "#{entity.collectionName}",
    <#if(entity.filter){-#>
    filter: #{entity.filter},
    <#}-#>
    isPublic: true,
    saveFilter: {
    <#entity.props
    .filter(p=>(entity.embedded && p.name != 'id')||!entity.embedded)
    .filter(p=>!(p.ref && !p.single && !p.embedded) && !p.calculated)
    .forEach(prop=>{
      const { ref, single, stored, embedded, verb } = prop;
      const isSingle = !ref || single
      -#>
    '#{prop.name}':'#{prop.field}',
    <#})#>
    },
    readFilter: {
    <#entity.props
    .filter(p=>(entity.embedded && p.name != 'id')||!entity.embedded)
    .filter(p=>!(p.ref && !p.single && !p.embedded) && !p.calculated)
    .forEach(prop=>{
      const { ref, single, stored, embedded, verb } = prop;
      const isSingle = !ref || single
      -#>
    '#{prop.field}':'#{prop.name}',
    <#})#>
    },
    uploadFields:[
      <# entity.uploadFields.forEach(f=>{#>
      "#{f}",
      <#-})#>
      <# entity.maps.forEach(f=>{#>
        ...embedded.#{f.type}.uploadFields.map(f=>`#{f.name}.${f}`),
      <#-})#>
      <# entity.collections.forEach(f=>{#>
        ...embedded.#{f.type}.uploadFields.map(f=>`#{f.name}.${f}`),
      <#-})#>
    ],
    collections:[
      <# entity.collections.forEach(f=>{#>
      {
        field:"#{f.name}",
        path:"#{f.storage}",
        type:"#{f.type}",
        isPublic: true,
        ...embedded.#{f.type},
      },
      <#-})#>
    ],
    maps:[
      <# entity.maps.forEach(f=>{#>
      {
        field:"#{f.name}",
        path:"#{f.storage}",
        type:"#{f.type}",
        ...embedded.#{f.type},
      },
      <#-})#>
    ]
  },
<#}-#>
]

<#- chunkStart(`./index.js`); -#>
import {Fragment} from 'react';
<# for(let entity of pack.entities.filter(e=>!e.embedded)){-#>
import #{entity.name}UIX from './#{entity.name}';
<#}-#>
<# for(let en_ of pack.enums){-#>
import #{en_.name} from './#{en_.name}';
<#}#>
import React from 'react';
import Admin from './admin';
import Typography from '@material-ui/core/Typography';
import InputWithPreview from './InputWithPreview';
import QuickCreateButton from './quickCreate';
// import TimeInput from '../../modules/TimeInput';
// import TimeField from '../../modules/TimeField';
// import FixedTimeInput from '../../modules/FixedTimeInput';
// import FixedTimeField from '../../modules/FixedTimeField';

import {
  //primitives
  //input
  DateInput,
  DateTimeInput,
  TextInput,
  BooleanInput,
  ImageInput,
  FileInput,
  NumberInput,
  PasswordInput,
  //field
  TextField,
  DateField,
  BooleanField,
  NullableBooleanInput,
  ImageField,
  FileField,
  NumberField,
  RichTextField,
  UrlField,
  ChipField,
  EmailField,
  //complex
  //input
  // array
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  // select from list
  AutocompleteInput,
  AutocompleteArrayInput,
  CheckboxGroupInput,
  RadioButtonGroupInput,
  //
  //reference
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
  //field
  ArrayField,
  ReferenceManyField,
  FunctionField,
  SelectField,
  ReferenceField,
  ReferenceArrayField,
  SimpleList,
  // ref items
  SingleFieldList,
  Datagrid,
  //layout single item
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
  Create,
  Edit,
  SimpleForm,
  TabbedForm,
  FormTab,
  // layout list items
  List,
  // universal
  //layput controls
  Toolbar,
  Filter,
  Pagination,
  TopToolbar,
  // buttons
  Button,
  ShowButton,
  EditButton,
  DeleteButton,
  CloneButton,
  BulkDeleteButton,
  SaveButton,
  // functions
  required,
  //
  useTranslate,
} from 'react-admin';
import RichTextInputBase from 'ra-input-rich-text';

const HeaderLabel = ({text, ...props })=> {
  const translate = useTranslate();
  return (<Typography variant="h6" gutterBottom {...props}>{translate(text)}</Typography>);
}

const DisabledInput = (props) => (<TextInput disabled {...props}/>);
const LongTextInput = (props) => (<TextInput multiline {...props}/>);
const FileInputField = props => (
  <FileInput {...props}>
    <FileField source="src" title="name" />
  </FileInput>
);

const ImageInputField = props => (
  <ImageInput {...props}>
    <ImageField source="src" title="title" />
  </ImageInput>
);
const PasswordField = (props) => (<TextField  {...props} inputProps={{ autocomplete: 'new-password' }}/>);
const Readonly = field => ({ Input: DisabledInput, Field: field });

const ReadonlyReachTextInput = ({ label, ...props }) => {
  const translate = useTranslate();
  if (label) {
    label = translate(label);
  }
  return <RichTextInputBase label={label} {...props} disabled />;
};

const RichTextInput = ({ label, ...props }) => {
  const translate = useTranslate();
  if (label) {
    label = translate(label);
  }
  return <RichTextInputBase label={label} {...props} />;
};

const primitive = {
  Text: { Input: TextInput, Field: TextField },
  LongText: { Input: LongTextInput, Field: TextField },
  Number: { Input: NumberInput, Field: NumberField },
  Date: { Input: DateInput, Field: DateField },
  DateTime: { Input: DateTimeInput, Field: DateField },
  // Time: { Input: TimeInput, Field: TimeField },
  // FixedTime: { Input: FixedTimeInput, Field: FixedTimeField },
  Boolean: { Input: BooleanInput, Field: BooleanField },
  ID: { Input: DisabledInput, Field: TextField },
  URLFile: { Input: TextInput, Field: FileField },
  URLImage: { Input: TextInput, Field: ImageField },
  File: { Input: FileInputField, Field: FileField },
  Image: { Input: ImageInputField, Field: ImageField },
  RichText: { Input: RichTextInput, Field: RichTextField },
  ReadonlyRichText: { Input: ReadonlyReachTextInput, Field: RichTextField },
  URL: { Input: TextInput, Field: UrlField },
  Password: { Input: PasswordInput, Field: TextField },
  Email: { Input: TextInput, Field: EmailField },
  NullableBoolean: { Input: NullableBooleanInput, Field: BooleanField },
};

const readonly = Object.keys(primitive).reduce((result, cur) => {
  if(!/Readonly/i.test(cur) && !primitive[`Readonly${cur}`]){
    result[`Readonly${cur}`] = Readonly(primitive[cur]);
  }
  return result;
}, {});

export const components = {
  HeaderLabel,
  InputWithPreview,
  QuickCreateButton,
  primitive: {
  ...primitive,
  ...readonly,
<# for(let en_ of pack.enums){-#>
    #{en_.name},
<#}#>
  },
  //primitives
  //input
  DateInput,
  // TimeInput,
  // FixedTimeInput,
  TextInput,
  BooleanInput,
  DisabledInput,
  ImageInput,
  FileInput,
  LongTextInput,
  NumberInput,
  RichTextInput,
  //field
  TextField,
  // TimeField,
  // FixedTimeField,
  DateField,
  BooleanField,
  NullableBooleanInput,
  ImageField,
  FileField,
  NumberField,
  RichTextField,
  UrlField,
  ChipField,
  EmailField,
  //complex
  //input
  // array
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  // select from list
  AutocompleteInput,
  AutocompleteArrayInput,
  CheckboxGroupInput,
  RadioButtonGroupInput,
  //
  //reference
  ReferenceArrayInput,
  SelectArrayInput,
  ReferenceInput,
  SelectInput,
  //field
  ArrayField,
  ReferenceManyField,
  FunctionField,
  SelectField,
  ReferenceField,
  ReferenceArrayField,
  SimpleList,
  // ref items
  SingleFieldList,
  Datagrid,
  //layout single item
  Show,
  SimpleShowLayout,
  TabbedShowLayout,
  Tab,
  Create,
  Edit,
  SimpleForm,
  TabbedForm,
  FormTab,
  // layout list items
  List,
  // universal
  //layput controls
  Toolbar,
  Filter,
  Pagination,
  TopToolbar,
  // buttons
  Button,
  ShowButton,
  EditButton,
  DeleteButton,
  CloneButton,
  BulkDeleteButton,
  SaveButton,
  //tree
  // Tree,
  // NodeView,
  // NodeActions,
  // functions
  required,
};

export { Admin };

export const uix = {
  Fragment,
  ...components,
<#
 for(let entity of pack.entities.filter(e=>!e.embedded)){-#>
  "#{entity.name}": #{entity.name}UIX,
<#}-#>
};

export const prepareExcludeList = (name, excludeList) => {
  let result;
  if (Array.isArray(name)) {
    result = name.map(prepareExcludeList).reduce(
      (res, curr) => ({
        ...res,
        ...curr,
      }),
      {},
    );
  } else if (typeof name === 'string' && name.startsWith('!')) {
    result = { [name.slice(1)]: true };
  } else {
    result = {};
  }
  if(excludeList){
    result = {
      ...excludeList,
      ...result,
    }
  }
  return result;
};

<#- chunkStart(`./i18n/index.js`); -#>
import {merge} from 'lodash';

<# for(let entity of pack.entities){-#>
import #{entity.name}Translate from './#{entity.name}';
<#}-#>

<# for(let en_ of pack.enums){-#>
import { translation as #{en_.name} } from '../#{en_.name}';
<#}#>

<# let messages = pack.metadata?.UI?.messages || {}#>
const messages = {
  uix: {
    "filter": {
      "search": "#{messages.search || 'Search'}",
      "exists": "%{name} #{messages.exists || 'exists'}",
      "eq": "%{name} =",
      "ne": "%{name} !=",
      "lte": "%{name} <=",
      "gte": "%{name} >=",
      "lt": "%{name} <",
      "gt": "%{name} >",
      "imatch": "%{name}",
      "in": "%{name} #{messages.in || 'in'}",
      "nin": "%{name} #{messages.nin || 'not in'}",
    },
    actions:{
      "create_and_add": "#{messages.create_and_add || 'Create more...'}",
      "preview": "#{messages.preview || 'Quick View'}",
    },
  }
}

export default
  merge(
    messages,
<# for(let entity of pack.entities){-#>
    #{entity.name}Translate,
<#}-#>
<# for(let en_ of pack.enums){-#>
    #{en_.name},
<#}#>
  )

<#- chunkStart(`./resource-menu-items.js`); -#>
import React from 'react';
import ListIcon from '@material-ui/icons/view-list';
import { translate } from 'react-admin';

export default {
<# for(let entity of pack.entities.filter(e=> !e.embedded && !e.abstract)){-#>
  "#{entity.name}": { icon: <ListIcon />, visible: true, name: translate('resources.#{entity.name}.name', { smart_count:2 }) },
<#}-#>
};

<#- chunkStart(`./admin.js`); -#>
<# const language = pack.metadata?.UI?.locale || 'english'; #>
import React from 'react';
import { Admin, Resource } from 'react-admin';
import #{language}Messages from 'ra-language-#{language}';
import translation from './i18n';
import { merge } from 'lodash';
import { uix as getUIX } from './';
import { UIXContext } from './contexts';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const messages = {
  #{language}: {
    ...merge({}, #{language}Messages, translation),
  },
};

const i18nProviderGenerated = polyglotI18nProvider(locale => messages[locale], '#{language}');

export default ({ title, dataProvider, authProvider, customSagas, i18nProvider, uix, history,}) => (
  <UIXContext.Provider  value={uix || getUIX}>
    <Admin
      history={history}
      i18nProvider={i18nProvider || i18nProviderGenerated}
      title={title}
      dataProvider={dataProvider}
      authProvider={authProvider}
      customSagas={customSagas}
    >
    <# for(let entity of pack.entities.filter(e=> !(e.embedded || e.abstract))){-#>
        <Resource
          key={"#{entity.name}"}
          show={(uix || getUIX).#{entity.name}.Show}
          name={"#{entity.resourceName}"}
          edit={(uix || getUIX).#{entity.name}.Edit}
          create={(uix || getUIX).#{entity.name}.Create}
          list={(uix || getUIX).#{entity.name}.List}
          options={{ label: `resources.${(uix || getUIX).#{entity.name}.name}.name` }}
        />
    <#}-#>
    </Admin>
  </UIXContext.Provider>
);

<#- chunkStart(`./InputWithPreview.js`); -#>
import React, { useContext, useState, Fragment } from 'react';
import Drawer from '@material-ui/core/Drawer';

import { Field } from 'react-final-form';
import IconImageEye from '@material-ui/icons/RemoveRedEye';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from 'react-admin';
import { ReferenceInput } from 'react-admin';
import QuickCreateButton from './quickCreate';
import { UIXContext } from './contexts';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  }
});

const PreviewButton = ({ id, resource, basePath, showForm: ShowForm }) => {
  const [show, setView] = useState(false);
  return (
    <Fragment>
      <Button onClick={() => setView(true)} label="ra.action.show">
        <IconImageEye />
      </Button>
      <Drawer anchor="right" open={show} onClose={() => setView(false)}>
        <div>
          <Button label="ra.action.cancel" onClick={() => setView(false)}>
            <CloseIcon />
          </Button>
        </div>
        <ShowForm id={id} basePath={basePath} resource={resource} />
      </Drawer>
    </Fragment>
  );
};

const InputWithPreview = ({ optionText, preview, from, Select, children, ...props }) => {
  const uix = useContext(UIXContext);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ReferenceInput {...props} >
        <Select optionText={optionText} />
      </ReferenceInput>
      <Field
        name={props.source}
        component={({ input }) =>
          ((props.source === 'id' && !input.value) ||
            props.source !== 'id') && (
            <QuickCreateButton
              resource={props.reference}
              source={props.source}
              from={from}
            >
              {children}
            </QuickCreateButton>
          )
        }
      />
      <Field
        name={props.source}
        component={({ input }) =>
          input.value && (
            <PreviewButton
              id={input.value}
              basePath={`/${props.reference}`}
              resource={props.reference}
              showForm={uix[props.entity].Preview}
            />
          )
        }
      />
      <Field
        name={props.source}
        component={({ input }) =>
          input.value && (
            <uix.EditButton
              record={{ id: input.value }}
              basePath={`/${props.reference}`}
              resource={props.reference}
            />
          )
        }
      />
    </div>
  );
};

export default InputWithPreview;

<#- chunkStart(`./quickCreate.js`); -#>
import React, { useState, useContext, Fragment } from 'react';
import { UIXContext } from './contexts';
import {
  Button,
  useTranslate,
  SaveButton,
  useCreate,
  useNotify,
} from 'react-admin';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { createForm } from 'final-form';
import { useForm } from 'react-final-form';

export default ({ resource, source, children, ...props }) => {
  const notify = useNotify();
  const currentForm = useForm();
  const [create, { loading: saving }] = useCreate(resource);
  const [, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const translate = useTranslate();
  const formLabel = `${translate('ra.action.create')} ${translate(
    `resources.${resource}.name`,
    {
      smart_count: 1,
    },
  )}`;

  const form = createForm({
    onSubmit: (values, _, callback) => {
      create(
        { payload: { data: values } },
        {
          onSuccess: ({ data }) => {
            notify('DONE');
            currentForm.change(source, data.id);
            setShowDialog(false);
            callback();
          },
          onFailure: error => {
            setError(error);
            notify(`error while creating ${error.message}`);
            callback(error);
          },
        },
      );
    },
  });

  return (
    <Fragment>
      <Button onClick={() => setShowDialog(true)} label="ra.action.create">
        <IconContentAdd />
      </Button>
      <Dialog
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-label={formLabel}
      >
        <DialogTitle>{formLabel}</DialogTitle>
        <DialogContent>{React.cloneElement(children, {
          form,
          save:(...args) => {
            console.log(args);
          },
          toolbar:null,
          record:{}
        })}</DialogContent>
        <DialogActions>
          <SaveButton
            saving={saving}
            handleSubmitWithRedirect={() => {
              form.submit();
            }}
          />
          <Button label="ra.action.cancel" onClick={() => setShowDialog(false)}>
            <IconCancel />
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

<#- chunkStart(`./contexts.js`); -#>
import React from 'react';

export const UIXContext = React.createContext({});
