<#@ noContent #>
let pipeline = require('pipeline.js');
let { deep_has_own, deep_rename_field } = require("@grainjs/loaders")
let Context = require('pipeline.js').Context;
let _ = require('lodash')

<#-
  const makeRelVariants = context.makeRelVariants
  const iterateRelGroups = context.iterateRelGroups

  const allRels = makeRelVariants(context.relations)
  // const allNonEmbedded = makeRelVariants(context.relations.filter((r)=>!r.oppositeEmbedded))
  const allNonEmbedded = makeRelVariants(context.relations)
  const allSearchable = makeRelVariants(context.relations)
  // для того чтобы подгружать обратную сторону ассоциации должны генериться все ассоциации
  // а не только navigable
  const anyRel = Object.keys(allNonEmbedded).length > 0
-#>

// Default Query
if (typeof(global.CustomQuery) == 'undefined') global.CustomQuery = {};

let ComplexQuery  = require("@grainjs/loaders").ComplexQuery;

let queryLoadRelated = function(db, prm, callback){

  const totalQuery = {
    model: prm.model,
    options: prm.options,
    conditions: prm.itemId,
    childRel: [{
      opposite: prm.opposite.opposite,
      options: prm.opposite.options,
      conditions: prm.opposite.conditions,
      total: true,
    }]
  }

  deep_rename_field(prm.opposite, (key) => {
    let result = key
    switch (key) {
      case 'limit':
        result = 'r_limit'
        break
      case 'skip':
        result = 'r_skip'
        break
      case 'sort':
        result = 'r_sort'
        break
    }
    return result
  })

  let child = prm.opposite;

  if(prm.extKeys) child.childRel = prm.extKeys;
  let rels = (prm.extKeys && typeof(prm.extKeys) === 'object') ? Object.keys(prm.extKeys) : [];

  let q = {
    "model":prm.model,
    "options": prm.options,
    "conditions": prm.itemId,
    "childRel": [child]
  };


    Promise.all([ComplexQuery.execQuery(db, totalQuery), ComplexQuery.execQuery(db, q)])
    .then(([r_total, data]) => {
    const res =
      Array.isArray(data) && data.length > 0
        ? data
          .map((item) => item[prm.opposite.opposite])
          .reduce((acc, val) => acc.concat(val), [])
        : []

    const total =
      res.length == prm.opposite.options.r_limit
        ? r_total
          .map((item) => item.total[prm.opposite.opposite])
          .reduce((acc, val) => acc + val, 0)
        : (prm.opposite.options.r_skip ?? 0) + res.length

    callback(
      null,
      {
        data: res,
        total,
      },
      rels,
    )

  }).catch((err) => {
    callback(err)
  })
};

const childRel = [
  <#- iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{#>
  {
    opposite: "#{rel.to}",
    <#- if(variant!== '*'){#>
    relName: "#{rel.relName}",
    propName:"#{rel.to}#{rel.relName.split('.').join('')}",
    <#- }#>
    model: "#{rel.ref.thingType}",
    onlyIds: true,
  },
  <#- })#>
]

let queryForDetail = function(prm){
  return {
    "model": "#{context.$normalizedName}",
    "options": prm.options,
    "conditions": prm.root,
    "childRel": childRel
  };
};

if (typeof(global.GenericSearchQueries) == 'undefined') global.GenericSearchQueries = {};

let queryForSearch = function(prm) {
  const params = prm.search ?? {}
  const query = {
    "model": "#{context.$normalizedName}",
    options: prm.options, //{ skip:0, limit: -1 },
    conditions: params.root ?? {}
  }

  if(prm.fields) {
    query.fields = prm.fields
  }

  const cr = []
  <#- iterateRelGroups(allSearchable, (variant, rel, relIndex, variantIndex)=>{#>
  if(params.root_#{rel.to}){
    cr.push({
      opposite: "#{rel.to}",
      <#- if(variant!== '*'){#>
      relName: "#{rel.relName}",
      propName:"#{rel.to}#{rel.relName.split('.').join('')}",
      <#- }#>
      model: "#{rel.ref.thingType}",
      onlyIds: true,
      conditions : params.root_#{rel.to} ? _.omit(params.root_#{rel.to}, ['ensure','absent']) : {},
      ensure: !params.root_#{rel.to}?.absent && params.root_#{rel.to} ? true : false,
      absent: !params.root_#{rel.to}?.ensure && params.root_#{rel.to}?.absent,
    })
  }
  <#- })#>

  if(cr.length > 0) query.childRel = cr
  return query
};

global.GenericSearchQueries['ReadByQuery.#{context.$fullName}'] = queryForSearch

let queryForList = function(prm){
  let q = {
    "model": "#{context.$normalizedName}",
    "options": prm.options,
    "conditions": prm.root
  };
  if (prm.extKeys) { q.childRel = prm.extKeys; }
  return q;
};

let query#{context.$fullName} = global.CustomQuery.query#{context.$fullName} = exports.query#{context.$fullName} = function (db, prm, callback) {
  let qry = prm.query(prm);
  let notEmpty = prm.notEmpty;

  Promise.all([ComplexQuery.execQueryList(db, qry), ComplexQuery.execQueryCount(db, qry)])
  .then(([res_data, res_total])=>{
      const data = res_data ? res_data : []
      const total = data.length == qry.options.limit ? res_total : (qry.options.skip ?? 0) + data.length
      let result = {
        data,
        total,
      }
      let rels;
      if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'object') ? Object.keys(qry.childRel) : [];
      else if (qry.childRel && typeof(qry.childRel) === 'object') rels = (qry.childRel && typeof(qry.childRel) === 'string') ? qry.childRel.split(' ') : [];
      let err = null
      if (notEmpty && res_total.length === 0) {
        err = new Error(prm.emptyErrorMsg);
      }
      callback(err, result, rels);
  }).catch(err=>{
    callback(err)
  })
};

Ext.directFn({
  serverModel: '#{context.$normalizedName}',
  namespace: 'ReadByQuery',
  name: '#{context.$fullName}',
  locationType:"#{context.locationType}",
  body: function(para) {
    let search = para.search ?? false;
    let context = this;
    let prm = para.data.shift();
    let cond = {};
    let qOptions = {
    <#- if(!(context.derivedProperties && context.derivedProperties.length > 0)){ #>
      //lean:true disabled for future only when we change the code generation engine
    <#-}#>
    };
    let limit = (prm.hasOwnProperty('limit') && typeof prm.limit === 'number' && prm.limit > 0) ? prm.limit : 0;
    let skip = prm.start;
    let sort = Ext.decodeSort(prm.sort);
    // check if we need to load related ids for specific associations
    let extKeys = Ext.decodeExtKeys(prm);
    if (limit) qOptions.limit = limit;
    if (skip && limit) qOptions.skip = skip;
    if (typeof(sort) ==='object' && Object.keys(sort).length > 0) qOptions.sort = sort;
    let loadRecord = prm.full ? true : false;
    let relHash = {
      <#- iterateRelGroups(allRels, (variant, rel, relIndex, variantIndex)=>{#>
        "#{rel.to}<#if(variant!== '*'){#>#{rel.relName.split('.').join('')}<#}#>":"#{rel.relName}",
      <#- })#>
    };
         //перенести в кодогенерацию --> цель: улучшить синхронизацию кэшированных данных так, чтобы она не удаляла нужные атрибуты или не заменяла пустыми
    let clean = function(obj, allRels, relList) {
    // relList это те реляции которые я хочу видеть... заказал.
    // allRels это все реляции доступные в объекте...
      let anyrels = false;
      if (relList) {
        let rels = {};
        for (let i = rels.length - 1; i >= 0; i--) {
          anyrels = true;
          rels[relList[i]] = 1;
        }
      }
      let ret;
      if (obj) {
        if (obj.data && Array.isArray(obj.data)) {
          obj.data = clean(obj.data, allRels, relList);
          ret = obj;
        } else if (Array.isArray(obj)) {
          ret = obj.map(function(item) {
            return clean(item, allRels, relList);
          });
        } else {
          ret = (obj.toObject) ? obj.toObject({virtuals:true}) : obj;
          if (anyrels) {
            for (let prop in allRels) {
              if(!relList.hasOwnProperty(prop))
                delete ret[prop];
            }
          }
        }
      }
      return ret;
    };
    let callback = function(err, data, rels) {
      if (!err) context.success(data ? clean(data, relHash, rels) : []);
      else context.failure(err);
    };
    if(!search) {
      cond.options = qOptions;
      let conditions = Ext.decodeFilters(prm.conditions, relHash)
      let filters = Ext.decodeFilters(prm.filter, relHash);
      let serverFilters = Ext.decodeFilters(prm.serverFilters, relHash);
      for(let fp in serverFilters){
        filters[fp] = serverFilters[fp];
      }

      let qry;

      <#- if(anyRel > 0) {#>
        let filter;
        <#- iterateRelGroups(allNonEmbedded, (variant, rel, relIndex, variantIndex)=>{
          if(relIndex > 0 || variantIndex > 0){#> else <#}
          #>
        if(filters.hasOwnProperty('#{rel.to}<#if(variant !== '*'){#>#{rel.relName.split('.').join('')}<#}#>')){
          filter = filters['#{rel.to}<#if(variant !== '*'){#>#{rel.relName.split('.').join('')}<#}#>'];
          qry = {
            model: "#{rel.ref.thingType}",
            itemId: {
              "#{rel.toKeyField}": filter
            },
            opposite: {
              opposite: "#{rel.from}",
              options: qOptions,
              conditions,
              total:true,
              childRel: childRel
            }
          };

          if(extKeys) qry.extKeys = extKeys;
          queryLoadRelated(context.dbPool, qry, callback);
        }
      <#- })-#>
      else {
    <#- }#>
      let filterKeys = (filters && typeof(filters) ==='object') ? Object.keys(filters) : [];

      if (prm.hasOwnProperty('id')) {
        loadRecord = true;
        if(prm.id === '$$$unlink$rel$$$') prm.id = '000000000000000000000000';
        cond.root = {
          // mongo specific
          _id: prm.id
        };
        cond.notEmpty = true;
        cond.emptyErrorMsg = 'Item of #{context.$normalizedName} model with specified ID (' + prm.id + ') is not found.';
      } else {
        if(filterKeys.length > 0){
          // delete cond.options.skip;
          // delete cond.options.limit;
          let len = filterKeys.length;
          if (!cond.root) cond.root = {};
          for (let i = 0; i < len; i++) {
            cond.root[filterKeys[i]] = filters[filterKeys[i]];
          }

          if(deep_has_own(cond, 'id')){
            // mongo specific
            deep_rename_field(cond, key=> key === 'id' ? '_id' : key)
          }
          // mongo specific
          loadRecord = deep_has_own(cond, '_id')
        }
      }

      if(extKeys) cond.extKeys = extKeys;
      // load Full Record Only(!!!) when id is present.
      cond.query = loadRecord ? queryForDetail : queryForList;

      global.CustomQuery['query#{context.$fullName}'](context.dbPool, cond, callback);
    <#- if(anyRel > 0) {#>
      }
    <#- }#>
    } else {
      global.CustomQuery['query#{context.$fullName}'](context.dbPool, { ... prm, search: prm.query, query: queryForSearch, options: qOptions }, callback);
    }
  }
});
