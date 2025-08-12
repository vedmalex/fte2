<#@ context 'ctx'#>
<#@ alias 'display-filter-entity' #>
<# const { entity, f, source, label } = ctx;#>
<# if(!f){
  entity.props.forEach( f=>{
  const _ctx = {
    ...ctx,
    f
  }
  #>
#{partial(_ctx,'display-filter-entity')}
<#})#>
<#} else if(!f.ref){#>
<#if(!f.calculated && f.name !== 'id') {#>
<#
    switch(f.filterType) {
      case "Number":
#>
    <uix.NumberInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.eq", { name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-eq`}
      allowEmpty
    />
    <uix.NumberInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.lte",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-lte`}
      allowEmpty
    />
    <uix.NumberInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.gte", { name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-gte`}
      allowEmpty
    />
    <uix.NumberInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.lt", { name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-lt`}
      allowEmpty
    />
    <uix.NumberInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.gt",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-gt`}
      allowEmpty
    />
<#
      break;
      case "Text":
#>
    <uix.#{f.filterType}Input
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.imatch",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-imatch`}
      allowEmpty
    />
<#
      break;
      case "ID":
#>
    <uix.TextInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.eq",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-eq`}
      allowEmpty
    />
<#
      break;
      case "Date":
#>
    <uix.DateInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.lte",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-lte`}
      allowEmpty
    />
    <uix.DateInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.gte",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-gte`}
      allowEmpty
    />
<#
      break;
      case "Boolean":
#>
    <uix.BooleanInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.eq",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-eq`}
      allowEmpty
    />
    <uix.NullableBooleanInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.exists",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
      source={`#{source}#{f.name}-exists`}
      allowEmpty
    />
<#
      break;
      case "Enum":
#>
      <uix.SelectInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.eq', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      choices={uix.primitive.#{f.type}.choices}
      source={`#{source}#{f.name}-eq`}
      allowEmpty
    />
    <uix.SelectInput
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.ne', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      choices={uix.primitive.#{f.type}.choices}
      source={`#{source}#{f.name}-ne`}
      allowEmpty
    />
    <uix.SelectArrayInput
    className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.in', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      options={{ fullWidth: true }}
      choices={uix.primitive.#{f.type}.choices}
      source={`#{source}#{f.name}-in`}
      allowEmpty
    />
    <uix.SelectArrayInput
    className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.nin', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      options={{ fullWidth: true }}
      choices={uix.primitive.#{f.type}.choices}
      source={`#{source}#{f.name}-nin`}
      allowEmpty
    />
<#    }#>
<#}#>
<#} else if(f.embedded) {
  const eEntity = entity.model.entities.find(e=>e.name === f.ref.entity)
  const ctx = {
    entity: {
      ...eEntity,
      props: eEntity.lists.all
    },
    source: source ? `${source}${f.name}.` : `${f.name}.`,
    label:`resources.${f.inheritedFrom || entity.name}.fields.${f.name}`,
  }
#>
  #{partial(ctx, 'display-filter-entity')}
<#} else if(!f.emdedeb && f.verb === 'BelongsTo'){ debugger;#>
  <uix.NullableBooleanInput
    label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate("uix.filter.exists",{ name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}')})}`}
    source="#{source}#{f.name}-exists" />

    <uix.ReferenceInput
      className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.eq', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      source="#{source}#{f.name}-eq"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      perPage={10000}
      allowEmpty
    >
    <#if(f.ref.autocomplete){-#>
      <uix.AutocompleteInput optionText={uix.#{f.ref.entity}.inputText} />
    <#} else {-#>
      <uix.SelectInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
    <#}-#>
    </uix.ReferenceInput>

    <uix.ReferenceInput
    className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.ne', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      source="#{source}#{f.name}-ne"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      perPage={10000}
      allowEmpty
    >
    <#if(f.ref.autocomplete){-#>
      <uix.AutocompleteInput optionText={uix.#{f.ref.entity}.inputText} />
    <#} else {-#>
      <uix.SelectInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
    <#}-#>
    </uix.ReferenceInput>

    <uix.ReferenceInput
      className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.in', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      source="#{source}#{f.name}-in"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      perPage={10000}
      allowEmpty
    >
    <#if(f.ref.autocomplete){-#>
      <uix.AutocompleteArrayInput optionText={uix.#{f.ref.entity}.inputText } />
    <#} else {-#>
      <uix.SelectArrayInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
    <#}-#>
    </uix.ReferenceInput>
    <uix.ReferenceInput
    className={classes.formControl}
      label={`<#if(label){#>${'#{label}'.split(' ').map(translate).join(' ')} <#}#>${translate('uix.filter.nin', {
        name: translate('resources.#{f.inheritedFrom || entity.name}.fields.#{f.name}'),
      })}`}
      source="#{source}#{f.name}-nin"
      reference="#{entity.model.entityPathMapper[f.ref.entity]}"
      perPage={10000}
      allowEmpty
    >
    <#if(f.ref.autocomplete){-#>
      <uix.AutocompleteArrayInput optionText={uix.#{f.ref.entity}.inputText } />
    <#} else {-#>
      <uix.SelectArrayInput optionText={<uix.#{f.ref.entity}.SelectTitle />} />
    <#}-#>
    </uix.ReferenceInput>
<#}#>