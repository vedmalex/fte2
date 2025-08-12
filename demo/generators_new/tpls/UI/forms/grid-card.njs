<#@ context "entity" -#>
<#@ alias 'grid-card' -#>

import React, { useContext } from 'react'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { useTranslate } from 'react-admin';

import { UIXContext } from '../contexts';
import { prepareExcludeList } from '../';

const cardStyle = {
  margin: '0.5rem',
  display: 'inline-block',
  verticalAlign: 'top',
};

const Label = ({ label }) => {
  const translate = useTranslate();
  return (
  <label>{translate(label)}:&nbsp;</label>
);}

const CardView = ({ ids, data, basePath, fields }) => {
  const uix = useContext(UIXContext);

  const excludedField = prepareExcludeList(fields)
  return (
  <div style={{ margin: '1em' }}>
    { ids.length > 0 ? (
      ids.map(id => (
        <Card key={id} style={cardStyle}>
          <CardHeader title={<uix.#{entity.name}.SelectTitle record={data[id]} />} />
          <CardContent>
            <div>
        <#- entity.props.filter(f=> !f.ref && f.name!== "id")
.filter(f=>entity.UI.list[f.name])
.forEach(f=>{#>
              {!excludedField.hasOwnProperty('#{f.name}') && <div>
                <Label label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
                <uix.primitive.#{f.type}.Field record={data[id]} source="#{f.name}" />
              </div>}
<#})-#>
<#
entity.props.filter(f=>f.ref)
.filter(f=>entity.UI.list[f.name])
.forEach(f=>{
-#><#-if(f.single && !f.ref.embedded){-#>
              {!excludedField.hasOwnProperty('#{f.name}') && <div>
                <Label label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" />
                <uix.ReferenceField basePath="/#{entity.model.entityPathMapper[f.ref.entity]}" record={data[id]} label="resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}" sortable={false} source="#{f.name}" reference="#{entity.model.entityPathMapper[f.ref.entity]}"<# if (!f.required){#> allowEmpty <#}#>>
                  <uix.#{f.ref.entity}.SelectTitle />
                </uix.ReferenceField>
              </div>}
<#}-#>
<#})#>
            </div>
          </CardContent>
          <CardActions style={{ textAlign: 'right' }}>
          <# entity.actions.forEach(action=>{ #>
              <uix.#{entity.name}.#{action.fullName} record={data}/>
          <#})#>
<# if(!(entity.embedded || entity.abstract)){#>
            <uix.EditButton
              resource="#{entity.model.entityPathMapper[entity.name]}"
              basePath="/#{entity.model.entityPathMapper[entity.name]}"
              record={data[id]}
            />
            <uix.ShowButton
              resource="#{entity.model.entityPathMapper[entity.name]}"
              basePath="/#{entity.model.entityPathMapper[entity.name]}"
              record={data[id]}
            />
            <uix.CloneButton
              resource="#{entity.model.entityPathMapper[entity.name]}"            
              basePath="/#{entity.model.entityPathMapper[entity.name]}"
              record={data[id]}
            />
            <uix.DeleteButton
              resource="#{entity.model.entityPathMapper[entity.name]}"            
              basePath="/#{entity.model.entityPathMapper[entity.name]}"
              record={data[id]}
            />
<#}#>
          </CardActions>
        </Card>
      ))
    ) : (
      <div style={{ height: '10vh' }} />
    )}
  </div>
);
}

CardView.defaultProps = {
  data: {},
  ids: [],
};

export default CardView;