import * as fs from 'fs'
import * as path from 'path'
import * as glob from 'glob'
import { Template } from './template'
import { FactoryConfig, TemplateFactoryBase } from './../common/factory'
import { safeEval } from './helpers'
import { FSWatcher, watch } from 'chokidar'

import {
  DefaultFactoryOption,
  HashType,
  SlotsHash,
} from './../common/interfaces'
import { TemplateBase } from 'src/common/template'

export interface NodeFactoryConfig<T> extends FactoryConfig<T> {
  watch?: boolean
}

export class TemplateFactory<
  T extends DefaultFactoryOption,
> extends TemplateFactoryBase<T> {
  // подумать нужно ли делать один общий для все список watchTree
  public watch = false
  public watchList = []
  public watcher: FSWatcher = undefined
  constructor(config: NodeFactoryConfig<T> = {}) {
    super(config)
    this.watch = config && config.watch
    if (this.watch) {
      this.watcher = watch([])
      this.watchList = []
    }
  }
  public override load(fileName: string, absPath?: boolean) {
    let root
    for (let i = 0, len = this.root.length; i < len; i++) {
      root = this.root[i]
      const fn = absPath
        ? path.resolve(fileName)
        : path.resolve(path.join(root, fileName))
      const compiledJS = fn + '.js'
      if (fs.existsSync(compiledJS)) {
        let result
        // always
        try {
          // try to resolve module
          result = require(compiledJS)
        } catch (error) {
          // load as file
          const storedScript = fs.readFileSync(compiledJS)
          result = safeEval(storedScript.toString())
        }
        if (result instanceof Function) {
          result = {
            script: result,
            compile: new Function(),
          }
        }
        result.absPath = fn
        result.name = fileName
        result.factory = this
        const templ = new Template<T>(result)
        this.register(templ, fileName)
        templ.compile()
        return templ
      } else if (fs.existsSync(fn)) {
        const content = fs.readFileSync(fn)
        const tpl = new Template({
          source: content.toString(),
          name: fileName,
          absPath: fn,
          factory: this,
        })
        let hasException = true
        try {
          tpl.compile()
          hasException = false
        } finally {
          if (!hasException) {
            return this.register(new Template(tpl), fileName)
          }
        }
      }
    }
    throw new Error(`template ${fileName} not found (absPath= ${absPath} )`)
  }

  public override preload() {
    let files = []
    for (let i = 0, rLen = this.root.length; i < rLen; i++) {
      for (let j = 0, eLen = this.ext.length; j < eLen; j++) {
        files = files.concat(
          glob.sync('*.' + this.ext[j], {
            root: this.root[i],
            cwd: this.root[i],
            matchBase: true,
          }),
        )
      }
    }
    for (let i = 0, len = files.length; i < len; i++) {
      this.load(files[i])
    }
  }

  public standalone(source: string) {
    const tpl = new Template({
      source: source,
      factory: this,
    })
    return tpl.compile()
  }

  // создает шаблон из текста
  public create(source: string, name?: string) {
    if (!name) {
      name = 'freegenerated' + Math.random().toString() + '.js'
    }
    const tpl = this.standalone(source)
    tpl.name = name
    tpl.absPath = name
    this.register(tpl)
    return name
  }

  public override run<T extends Record<string, any>>(
    context: HashType,
    name: string,
    absPath?: boolean,
  ) {
    const templ = this.ensure(name, absPath)

    // const source = new SourceNode(0, 0, templ.absPath)
    // context.directives.forEach((d) => {
    //   source.add(
    //     new SourceNode(d.line, d.column, `// ${d.content} -> ${d.name}`),
    //   )
    // })

    // context.main.forEach((m) => {
    //   source.add(new SourceNode(m.column, m.line, m.content))
    // })
    const bc = this.blockContent(templ, {})
    const result = bc.run(
      context,
      bc.content,
      bc.partial,
      bc.slot,
      this.options,
    )
    if (Object.keys(bc.slots).length > 0) {
      if (Array.isArray(result)) {
        return result.map((r) => {
          const tpl = this.standalone(r.content)
          const content = tpl.script(
            bc.slots,
            bc.content,
            bc.partial,
            bc.slot,
            this.options,
          )
          return {
            name: r.name,
            content,
          }
        })
      } else {
        const res = this.standalone(result)
        return res.script(
          bc.slots,
          bc.content,
          bc.partial,
          bc.slot,
          this.options,
        )
      }
    } else {
      return result
    }
  }

  public override runPartial<T extends Record<string, any>>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options?: T
    slots?: SlotsHash
  }): string {
    const templ = this.ensure(name, absPath)
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots)
      return bc.run(
        context,
        bc.content,
        bc.partial,
        bc.slot,
        this.options,
      ) as string
    } else {
      throw new Error("cant't use template with chunks as partial")
    }
  }

  public express() {
    const self = this
    return (fileName, context, callback) => {
      const templ = self.ensure(fileName, true)
      const bc = self.blockContent(templ)
      let result, err
      try {
        result = bc.run(context, bc.content, bc.partial, bc.slot, this.options)
      } catch (e) {
        err = e
      } finally {
        callback(err, result)
      }
    }
  }

  public clearCache(list) {
    for (let i = 0, keys = Object.keys(list), len = keys.length; i < len; i++) {
      delete this.cache[list[keys[i]].name]
      delete this.cache[list[keys[i]].absPath]
    }
  }

  public override ensure(fileName: string, absPath?: boolean): TemplateBase<T> {
    const template = super.ensure(fileName, absPath)
    if (this.watch) {
      if (this.watchList.indexOf(template.absPath) == -1) {
        this.watchList.push(template.absPath)
      }
      if (this.watchList.length > 0) {
        if (!this.watcher) {
          this.watcher = watch(this.watchList)
          this.watcher.on('change', (filename) => {
            this.watcher.on('change', (fn) => {
              const index = this.watchList.indexOf(fn)
              delete require.cache[fn]
              const temp = [...this.watchList]
              this.watcher.unwatch(temp)
              this.watchList = this.watchList.splice(index, 1)
              if (this.watchList.length > 0) {
              }
            })
          })
          this.watcher.on('unlink', (filename) => {})
        }
      }
    }
    return template
  }
}
