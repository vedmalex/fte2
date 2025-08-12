<#@ noContent #>
Ext.define(
  'Modeleditor.view.#{context.controller?context.controller:"base"}.#{context.name}',
  {
    extend: 'Ext.ux.IFrame',
    alias: 'widget.#{context.widgetName}',
    src: '/page/#{context.name}',
    autoScroll: false,
    title: _t(
      '#{context.title}',
      '#{context.controller?context.controller:"base"}.#{context.name}',
      'titles',
    ),
  },
)
