<#@ context "entity" -#>
<#@ alias "forms-form" -#>
<# const rels = entity.props.filter(f=>f.ref).filter(r=>!r.single && !r.ref.embedded); #>
<# const btRels = entity.props.filter(f=>f.ref).filter(r=>r.verb === 'BelongsTo');#>

import React, { useContext } from "react";
import { UIXContext } from '../contexts';

<# block 'init-record' : -#>
<#@ context 'btRels'#>
<#if (btRels.length > 0) {#>
  let redirect = 'edit';
  if(props.location && props.location.state && props.location.state.pathname){
    redirect =  props.location.state.pathname;
  }
<#}#>
<# end #>

  const CreateFormToolbar = (props) => {
    const uix = useContext(UIXContext);
    return (
      <uix.Toolbar {...props}>
        <uix.SaveButton/>
        <uix.SaveButton
          label="uix.actions.create_and_add"
          redirect={false}
          submitOnEnter={false}
          variant="text"
        />
      </uix.Toolbar>
    );
  }

const EditSimple#{entity.name}Actions = ({ basePath, data }) => {
  const uix = useContext(UIXContext);
    return (
    <uix.TopToolbar>
  <# entity.actions.forEach(action=>{ #>
      <uix.#{entity.name}.#{action.fullName} record={data}/>
  <#})#>
      <uix.ShowButton record={data} basePath={basePath} />
    </uix.TopToolbar>
  );
}

const EditTabbed#{entity.name}Actions = ({ basePath, data }) => {
  const uix = useContext(UIXContext);
  return (
    <uix.TopToolbar>
  <# entity.actions.forEach(action=>{ #>
      <uix.#{entity.name}.#{action.fullName} record={data} />
  <#})#>
      <uix.ShowButton record={data} basePath={basePath} />
    </uix.TopToolbar>
  );
}

const ShowSimple#{entity.name}Actions = ({ basePath, data }) => {
  const uix = useContext(UIXContext);
  return (
    <uix.TopToolbar>
  <# entity.actions.forEach(action=>{ #>
      <uix.#{entity.name}.#{action.fullName} record={data}/>
  <#})#>
      <uix.EditButton record={data} basePath={basePath} />
    </uix.TopToolbar>
  );
}

const ShowTabbed#{entity.name}Actions = ({ basePath, data }) => {
  const uix = useContext(UIXContext);
  return (
  <uix.TopToolbar>
<# entity.actions.forEach(action=>{ #>
    <uix.#{entity.name}.#{action.fullName} record={data}/>
<#})#>
    <uix.EditButton record={data} basePath={basePath} />
  </uix.TopToolbar>
);}

export const SimpleForm = (props)=>{
  const uix = useContext(UIXContext);
  return (
    <uix.SimpleForm {...props}>
      <uix.HeaderLabel text="resources.#{entity.name}.summary" />
      #{partial({
        entity: {
          ...entity,
          props: entity.lists.all,
        },
        source:'',
        sectionLabel: true,
        grid: false,
      }, 'display-edit-entity')}
    </uix.SimpleForm>
  )
}

export const CreateFormSimple = (props) => {
  const uix = useContext(UIXContext);
  #{content('init-record',btRels)}
  return (
  <uix.Create {...props} >
    <uix.#{entity.name}.SimpleForm toolbar={<CreateFormToolbar />}
    <#if(btRels.length> 0){#> redirect={redirect} <#}#>
    />
  </uix.Create >
  );
};

export const EditFormSimple = (props) => {
  const uix = useContext(UIXContext);
  return (
  <uix.Edit title={<uix.#{entity.name}.Title />} {...props} actions={<EditSimple#{entity.name}Actions />} >
    <uix.#{entity.name}.SimpleForm/>
  </uix.Edit >
  );
};

export const TabbedForm = (props) =>{
  const uix = useContext(UIXContext);
  return (
    <uix.TabbedForm {...props}>
      <uix.FormTab label="resources.#{entity.name}.summary">
      #{partial({
        entity: {
          ...entity,
          props: entity.lists.summary,
        },
        source:'',
        sectionLabel: false,
        grid: false,

      }, 'display-edit-entity')}
      </uix.FormTab>

<#- entity.props.filter(f=>f.ref)
  .filter(f => (entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name]!== false)
  .forEach(f => {
    const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
    if ( f.single && !embedded ) {
      return;
    }
#>
      <uix.FormTab label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" path="#{f.name}">
        #{partial({
      entity: {
        ...entity,
        props: entity.props.filter(fl=>fl.name === f.name)
      },
      source: ``,
      sectionLabel: false,
      grid: false,

    }, 'display-edit-entity')}
      </uix.FormTab>
<#-})#>
    </uix.TabbedForm>
  )
}

// tabbed forms
export const CreateFormTabbed = (props) => {
  const uix = useContext(UIXContext);
 #{content('init-record',btRels)}
  return (
  <uix.Create {...props} >
    <uix.#{entity.name}.TabbedForm toolbar={<CreateFormToolbar />}
     <#if(btRels.length> 0){#> redirect={redirect} <#}#>/>
  </uix.Create >
  );
};

export const EditFormTabbed = (props) => {
  const uix = useContext(UIXContext);
  return (
  <uix.Edit title={<uix.#{entity.name}.Title />} {...props} actions={<EditTabbed#{entity.name}Actions />}>
    <uix.#{entity.name}.TabbedForm />
  </uix.Edit >
  );
};

export const ShowSimpleView = (props) => {
  const uix = useContext(UIXContext);
  return (
    <uix.Show title={<uix.#{entity.name}.Title />} {...props} actions={<ShowSimple#{entity.name}Actions />}>
      <uix.SimpleShowLayout>
      <uix.HeaderLabel text="resources.#{entity.name}.summary" />
      #{partial({
        entity: {
          ...entity,
          props: entity.lists.all,
        },
        source:'',
        sectionLabel: true,
        grid: false,

      }, 'display-show-entity')}
      </uix.SimpleShowLayout>
    </uix.Show>
  );
};

export const ShowTabbedView = (props) => {
  const uix = useContext(UIXContext);

  return (
    <uix.Show title={<uix.#{entity.name}.Title />} {...props} actions={<ShowTabbed#{entity.name}Actions />}>
      <uix.TabbedShowLayout>
        <uix.Tab label="resources.#{entity.name}.summary">
          #{partial({
            entity: {
            ...entity,
            props: entity.lists.summary,
          },
          source:'',
          sectionLabel: false,
          grid: false,

          }, 'display-show-entity')}
        </uix.Tab>
<#- entity.props.filter(f=>f.ref)
  .filter(f => (entity.UI.edit[f.name] || entity.UI.list[f.name] || entity.UI.show[f.name]) && entity.UI.edit[f.name]!== false)
  .forEach(f => {
    const embedded = entity?.UI?.embedded?.hasOwnProperty(f.name);
    if ( f.single && !embedded ) {
      return;
    }
#>
        <uix.Tab label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" path="#{f.name}">
          #{partial({
      entity: {
        ...entity,
        props: entity.props.filter(fl=>fl.name === f.name)
      },
      source: ``,
      emdedded: true,
      sectionLabel: false,
      grid: false,

    }, 'display-show-entity')}
        </uix.Tab>
      <#-})#>
      </uix.TabbedShowLayout>
    </uix.Show>
  );
};
