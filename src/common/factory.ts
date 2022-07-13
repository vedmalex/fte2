declare let process: { browser: boolean; cwd: () => string }

import { TemplateBase } from './template'
import {
  HashType,
  BlockContent,
  HashTypeGeneric,
  PartialFunction,
  ContentFunction,
  SlotsHash,
  SlotFunction,
  DefaultFactoryOption,
} from './../common/interfaces'
import { applyIndent } from './helpers'

export const DefaultFactoryOptions: DefaultFactoryOption = {
  applyIndent,
}

/**
 * template factory -- it instantiate the templates
 */
export abstract class TemplateFactoryBase<T extends DefaultFactoryOption> {
  public ext: Array<string> = []
  public cache: HashTypeGeneric<TemplateBase<T>>
  public debug = false
  public watch = false
  // подумать нужно ли делать один общий для все список watchTree
  public watchTree = undefined
  public root = undefined

  constructor(
    config: {
      root?: string | Array<string>
      debug?: boolean
      watch?: boolean
      ext?: Array<string>
      preload?: boolean
      options?: T
    } = {},
  ) {
    config.options = { ...config.options, DefaultFactoryOptions }
    if (!process.browser) {
      // this only need in server-side code with server load code
      this.root = config
        ? config.root
          ? Array.isArray(config.root)
            ? config.root
            : [config.root]
          : [process.cwd()]
        : [process.cwd()]
      this.debug = (config && config.debug) || false
      this.watch = config && config.watch

      if (config && config.ext) {
        if (Array.isArray(config.ext)) {
          this.ext = config.ext
        } else {
          this.ext = [config.ext]
        }
      }
      this.watchTree = {}
    }
    this.cache = {}
    if (config && config.preload) {
      this.preload()
    }
  }
  public register(tpl: TemplateBase<T>, fileName?: string) {
    if (!(tpl.name in this.cache)) {
      this.cache[tpl.name] = tpl
      if (tpl.alias && Array.isArray(tpl.alias)) {
        tpl.alias
          .filter((a) => a !== tpl.name)
          .forEach((a) => {
            this.cache[a] = tpl
          })
      }
      this.cache[tpl.absPath] = tpl
    }
    return tpl
  }

  public ensure(fileName: string, absPath?: boolean): TemplateBase<T> {
    if (!(fileName in this.cache)) {
      const template = this.load(fileName, absPath)
      if (this.watch) {
        this.checkChanges(template, fileName, absPath)
        const depList = Object.keys(template.dependency)
        for (let i = 0, len = depList.length; i < len; i++) {
          const templates =
            this.watchTree[this.cache[depList[i]].absPath].templates
          templates[template.absPath] = template
        }
      }
      return template
    }
    return this.cache[fileName]
  }
  public blockContent(tpl: TemplateBase<T>, slots?: SlotsHash): BlockContent {
    const scripts = []
    const self = this
    const bc: BlockContent = {
      slots: slots ? slots : {},
      slot(name: string, content: string | Array<string>): void | string {
        if (name) {
          if (!this.slots.hasOwnProperty(name)) {
            this.slots[name] = []
          }
          if (content) {
            if (Array.isArray(content)) {
              content.forEach((c) => this.slot(name, c))
            } else {
              if (this.slots[name].indexOf(content) === -1) {
                this.slots[name].push(content)
              }
            }
          } else {
            return `#{partial(context['${name}'] || [], '${name}')}`
          }
        }
      },
      partial(obj: HashType, name: string): string {
        if (tpl.aliases.hasOwnProperty(name)) {
          return self.runPartial({
            context: obj,
            name: tpl.aliases[name],
            absPath: true,
            slots: this.slots,
            options: this.options,
          })
        } else {
          return self.runPartial({
            context: obj,
            name,
            absPath: false,
            slots: this.slots,
            options: this.options,
          })
        }
      },
      content(
        name: string,
        context: HashType,
        content: ContentFunction,
        partial: PartialFunction,
        slot: SlotFunction,
      ) {
        if (name) {
          return tpl.blocks && tpl.blocks.hasOwnProperty(name)
            ? tpl.blocks[name](context, content, partial, slot)
            : ''
        } else {
          const fn = scripts.pop()
          if (typeof fn === 'function') {
            return fn(context, content, partial)
          } else {
            return ''
          }
        }
      },
      run(
        $context: HashType,
        $content: ContentFunction,
        $partial: PartialFunction,
      ): string {
        function go(
          this: TemplateBase<T>,
          context,
          content,
          partial,
          slot,
        ): string {
          const $this = this as TemplateBase<T>
          if ($this.parent) {
            const parent = self.ensure($this.parent)
            // tpl.mergeParent(parent); moved to compile.
            scripts.push($this.script)
            return go.call(parent, context, content, partial, slot)
          } else {
            try {
              return $this.script(context, content, partial, slot)
            } catch (e) {
              throw new Error(
                `template ${$this.name} failed to execute with error
                  '${e.message}
                  ${e.stack}'`,
              )
            }
          }
        }
        return go.call(tpl, $context, $content, $partial, this.slot)
      },
    }
    bc.content = bc.content.bind(bc)
    bc.partial = bc.partial.bind(bc)
    bc.run = bc.run.bind(bc)
    bc.slot = bc.slot.bind(bc)
    return bc
  }

  public preload(fileName?: string) {
    throw new Error('abstract method call')
  }

  public checkChanges(template?: any, fileName?: any, absPath?: boolean) {
    throw new Error('abstract method call')
  }

  public load(fileName: string, absPath: boolean): TemplateBase<T> {
    throw new Error('abstract method call')
  }

  public run<T extends Record<string, any>>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options: T
    slots?: SlotsHash
  }): string | Array<object> {
    throw new Error('abstract method call')
  }

  public runPartial<T extends Record<string, any>>({
    context,
    name,
    absPath,
    options,
    slots,
  }: {
    context: HashType
    name: string
    absPath?: boolean
    options: T
    slots?: SlotsHash
  }): string {
    throw new Error('abstract method call')
  }
}

// надо удалить так же все watcher Зависимости обновляемого шаблона,
// в случае его удаления из кэша, и так же не использовать массив, а
