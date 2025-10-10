import { type FSWatcher, watch } from 'chokidar'
import * as fs from 'fs'
import {
  type DefaultFactoryOption,
  type SlotsHash,
  type TemplateBase,
  TemplateFactoryBase,
} from 'fte.js-base'
import * as glob from 'glob'
import * as path from 'path'
import { safeEval } from './safeEval'
import { Template } from './Template'

export class TemplateFactory<
  OPTIONS extends DefaultFactoryOption,
> extends TemplateFactoryBase<OPTIONS> {
  // подумать нужно ли делать один общий для все список watchTree
  public watchList: Array<string> = []
  public watcher?: FSWatcher
  public override load(fileName: string, absPath?: boolean) {
    let root
    for (let i = 0, len = this.root!.length; i < len; i++) {
      root = this.root![i]
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
        const templ = new Template<OPTIONS>(result)
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
    let files: Array<string> = []
    for (let i = 0, rLen = this.root!.length; i < rLen; i++) {
      for (let j = 0, eLen = this.ext.length; j < eLen; j++) {
        files = files.concat(
          glob.sync('*.' + this.ext[j], {
            root: this.root![i],
            cwd: this.root![i],
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

  public override run<T>(context: T, name: string, absPath?: boolean) {
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

  public override runPartial<T>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: T
    name: string
    absPath?: boolean
    options?: OPTIONS
    slots?: SlotsHash
  }): string {
    const templ = this.ensure(name, absPath)
    if (!templ.chunks) {
      const bc = this.blockContent(templ, slots)
      const result = bc.run(context, bc.content, bc.partial, bc.slot, {
        ...this.options,
        ...(options ?? {}),
      })
      // Handle both string and {code, map} returns (sourcemap support)
      return typeof result === 'string' ? result : (result as any)?.code ?? ''
    } else {
      throw new Error("cant't use template with chunks as partial")
    }
  }

  public express() {
    return <T>(fileName: string, context: T, callback) => {
      const templ = this.ensure(fileName, true)
      const bc = this.blockContent(templ)
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

  public clearCache(template: TemplateBase<OPTIONS>) {
    delete this.cache[template.name!]
    delete this.cache[template.absPath!]
    template.alias.forEach((alias) => {
      delete this.cache[alias]
    })
  }

  public override ensure(
    fileName: string,
    absPath?: boolean,
  ): TemplateBase<OPTIONS> {
    const template = super.ensure(fileName, absPath)
    if (this.watch) {
      if (!this.watchList) this.watchList = []
      if (!this.watcher) {
        const watcher = (this.watcher = watch(this.watchList))
        watcher.on('change', (fn: string) => {
          const template = this.cache[fn]
          this.clearCache(template)
          this.ensure(template.absPath!, true)
          delete require.cache[fn]
        })

        watcher.on('unlink', (fn: string) => {
          this.clearCache(this.cache[fn])
          const index = this.watchList.indexOf(fn)
          delete require.cache[fn]
          const temp = [...this.watchList]
          watcher.unwatch(temp)
          this.watchList = this.watchList.splice(index, 1)
          if (this.watchList.length > 0) {
            watcher.add(temp)
          }
        })
      }
      if (this.watchList.indexOf(template.absPath!) == -1) {
        this.watchList.push(template.absPath!)
        this.watcher.add(template.absPath!)
      }
    }
    return template
  }
}
