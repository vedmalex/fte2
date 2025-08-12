const { Factory } = require('fte.js/lib/standalone.fte.js')

const templates = {
  'graphql/graphql-api.njs': require('./graphql/graphql-api.njs.js'),
  'graphql/graphql-dataprovider.njs': require('./graphql/graphql-dataprovider.njs.js'),
  'next-js/ui-data-adapters.njs': require('./next-js/ui-data-adapters.njs.js'),
  'next-js/ui-next-js-root.njs': require('./next-js/ui-next-js-root.njs.js'),
  'next-js/ui-next-js.njs': require('./next-js/ui-next-js.njs.js'),
  'next-js/ui-root.njs': require('./next-js/ui-root.njs.js'),
  'UI/actions/actions.njs': require('./UI/actions/actions.njs.js'),
  'UI/forms/display/edit/entity.njs': require('./UI/forms/display/edit/entity.njs.js'),
  'UI/forms/display/edit/field.njs': require('./UI/forms/display/edit/field.njs.js'),
  'UI/forms/display/edit/rel-multiple-embed.njs': require('./UI/forms/display/edit/rel-multiple-embed.njs.js'),
  'UI/forms/display/edit/rel-multiple-not-embed.njs': require('./UI/forms/display/edit/rel-multiple-not-embed.njs.js'),
  'UI/forms/display/edit/rel-single-embed.njs': require('./UI/forms/display/edit/rel-single-embed.njs.js'),
  'UI/forms/display/edit/rel-single-not-embed-w-preview.njs': require('./UI/forms/display/edit/rel-single-not-embed-w-preview.njs.js'),
  'UI/forms/display/edit/rel-single-not-embed.njs': require('./UI/forms/display/edit/rel-single-not-embed.njs.js'),
  'UI/forms/display/edit/show-rel-multiple-not-embed.njs': require('./UI/forms/display/edit/show-rel-multiple-not-embed.njs.js'),
  'UI/forms/display/filter.njs': require('./UI/forms/display/filter.njs.js'),
  'UI/forms/display/show/entity.njs': require('./UI/forms/display/show/entity.njs.js'),
  'UI/forms/display/show/field.njs': require('./UI/forms/display/show/field.njs.js'),
  'UI/forms/display/show/rel-multiple-embed.njs': require('./UI/forms/display/show/rel-multiple-embed.njs.js'),
  'UI/forms/display/show/rel-multiple-not-embed-stored.njs': require('./UI/forms/display/show/rel-multiple-not-embed-stored.njs.js'),
  'UI/forms/display/show/rel-multiple-not-embed.njs': require('./UI/forms/display/show/rel-multiple-not-embed.njs.js'),
  'UI/forms/display/show/rel-single-embed.njs': require('./UI/forms/display/show/rel-single-embed.njs.js'),
  'UI/forms/display/show/rel-single-not-embed.njs': require('./UI/forms/display/show/rel-single-not-embed.njs.js'),
  'UI/forms/filter.njs': require('./UI/forms/filter.njs.js'),
  'UI/forms/form-fragment.njs': require('./UI/forms/form-fragment.njs.js'),
  'UI/forms/form.njs': require('./UI/forms/form.njs.js'),
  'UI/forms/grid-card.njs': require('./UI/forms/grid-card.njs.js'),
  'UI/forms/grid-list.njs': require('./UI/forms/grid-list.njs.js'),
  'UI/forms/grid-view.njs': require('./UI/forms/grid-view.njs.js'),
  'UI/forms/grid.njs': require('./UI/forms/grid.njs.js'),
  'UI/forms/i18n.njs': require('./UI/forms/i18n.njs.js'),
  'UI/forms/index.njs': require('./UI/forms/index.njs.js'),
  'UI/forms/list.njs': require('./UI/forms/list.njs.js'),
  'UI/forms/preview.njs': require('./UI/forms/preview.njs.js'),
  'UI/forms/select-title.njs': require('./UI/forms/select-title.njs.js'),
  'UI/forms/title.njs': require('./UI/forms/title.njs.js'),
  'UI/ui-enums.njs': require('./UI/ui-enums.njs.js'),
  'UI/ui-forms.njs': require('./UI/ui-forms.njs.js'),
  'UI/ui-index.njs': require('./UI/ui-index.njs.js'),
  'UI/ui.njs': require('./UI/ui.njs.js'),
}

const F = new Factory(templates)

module.exports = (context, name) => {
  return F.run(context, name)
}
