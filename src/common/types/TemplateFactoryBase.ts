import { TemplateBase } from './TemplateBase'

import { BlockRunFunction } from './BlockRunFunction'
import { FactoryConfig } from './FactoryConfig'
import { DefaultFactoryOptions } from '../utils'
import { BlockContent } from './BlockContent'
import { ContentFunction } from './ContentFunction'
import { DefaultFactoryOption } from './DefaultFactoryOption'
import { HashTypeGeneric } from './HashTypeGeneric'
import { PartialFunction } from './PartialFunction'
import { SlotFunction } from './SlotFunction'
import { SlotsHash } from './SlotsHash'
import { RunPartialContext } from './RunPartialContext'

/**
 * template factory -- it instantiate the templates
 */

export abstract class TemplateFactoryBase<OPTIONS extends DefaultFactoryOption> {
  public ext: Array<string> = []
  public cache: HashTypeGeneric<TemplateBase<OPTIONS>>
  public root?: Array<string> = undefined
  public options: OPTIONS
  public watch = false

  constructor(config?: Partial<FactoryConfig<OPTIONS>>) {
    if (config?.options) {
      this.options = { ...config.options, ...DefaultFactoryOptions }
    } else {
      this.options = { ...DefaultFactoryOptions } as OPTIONS
    }
    this.watch = config?.watch ?? false

    // TODO: сделать MACRO
    if (!global.browser) {
      // this only need in server-side code with server load code
      this.root = config
        ? config.root
          ? Array.isArray(config.root)
            ? config.root
            : [config.root]
          : [process.cwd()]
        : [process.cwd()]

      if (config && config.ext) {
        if (Array.isArray(config.ext)) {
          this.ext = config.ext
        } else {
          this.ext = [config.ext]
        }
      }
    }
    this.cache = {}
    if (config && config.preload) {
      this.preload()
    }
  }
  public register(tpl: TemplateBase<OPTIONS>, fileName?: string) {
    if (!(tpl.name! in this.cache)) {
      this.cache[tpl.name!] = tpl
      if (tpl.alias && Array.isArray(tpl.alias)) {
        tpl.alias
          .filter(a => a !== tpl.name)
          .forEach(a => {
            this.cache[a] = tpl
          })
      }
      this.cache[tpl.absPath!] = tpl
    }
    return tpl
  }

  public ensure(fileName: string, absPath?: boolean): TemplateBase<OPTIONS> {
    if (!(fileName in this.cache)) {
      return this.load(fileName, absPath)
    }
    return this.cache[fileName]
  }
  public blockContent(tpl: TemplateBase<OPTIONS>, slots?: SlotsHash): BlockContent<OPTIONS> {
    const scripts: Array<BlockRunFunction> = []
    const self = this
    const bc: BlockContent<OPTIONS> = {
      slots: slots ? slots : {},
      slot(name: string, content: string | Array<string>): void | string {
        if (name) {
          if (!this.slots.hasOwnProperty(name)) {
            this.slots[name] = []
          }
          if (content) {
            if (Array.isArray(content)) {
              content.forEach(c => this.slot(name, c))
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
      partial<T>(obj: T, name: string): string {
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
      content<T>(name: string, context: T, content: ContentFunction, partial: PartialFunction, slot: SlotFunction) {
        if (name) {
          return tpl.blocks && tpl.blocks.hasOwnProperty(name)
            ? tpl.blocks[name](context, content, partial, slot, self.options)
            : ''
        } else {
          const fn = scripts.pop()
          if (typeof fn === 'function') {
            return fn(context, content, partial, slot, self.options)
          } else {
            return ''
          }
        }
      },
      run<T>(
        $context: T,
        $content: ContentFunction,
        $partial: PartialFunction,
      ): string | Array<{ name: string; content: string }> {
        function go(
          this: TemplateBase<OPTIONS>,
          context,
          content,
          partial,
          slot,
        ): string | Array<{ name: string; content: string }> {
          const $this = this as TemplateBase<OPTIONS>
          if ($this.parent) {
            const parent = self.ensure($this.parent)
            // tpl.mergeParent(parent); moved to compile.
            scripts.push($this.script)
            return go.call(parent, context, content, partial, slot)
          } else {
            try {
              return $this.script(context, content, partial, slot, self.options)
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
      options: { ...this.options },
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

  public load(fileName: string, absPath?: boolean): TemplateBase<OPTIONS> {
    throw new Error('abstract method call')
  }

  public run<T>(context: T, name: string): string | Array<{ name: string; content: string }> {
    throw new Error('abstract method call')
  }

  public runPartial<CONTEXT>(_: RunPartialContext<CONTEXT, OPTIONS>): string {
    throw new Error('abstract method call')
  }
}
