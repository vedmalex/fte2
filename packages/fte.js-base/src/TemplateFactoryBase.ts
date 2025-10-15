import type { TemplateBase } from './TemplateBase'
import type { BlockContent } from './types/BlockContent'
import type { BlockRunFunction } from './types/BlockRunFunction'
import type { ContentFunction } from './types/ContentFunction'
import type { DefaultFactoryOption } from './types/DefaultFactoryOption'
import { DefaultFactoryOptions } from './types/DefaultFactoryOptions'
import type { FactoryConfig } from './types/FactoryConfig'
import type { HashTypeGeneric } from './types/HashTypeGeneric'
import type {
  PartialFunction,
  PartialInvocationOptions,
} from './types/PartialFunction'
import type { RunPartialContext } from './types/RunPartialContext'
import type { SlotFunction } from './types/SlotFunction'
import type { SlotsHash } from './types/SlotsHash'
import type { SourceMapOptions } from './types/source-map'

/**
 * template factory -- it instantiate the templates
 */

class TemplateExecutionError extends Error {
  public readonly templates: Array<string>
  public readonly original: Error

  constructor(templates: Array<string>, original: Error) {
    super(TemplateExecutionError.composeMessage(templates, original))
    this.name = 'TemplateExecutionError'
    this.templates = [...templates]
    this.original = original
      ; (this as unknown as { cause: Error }).cause = original
    this.updateStack()
  }

  public prepend(template: string): void {
    this.templates.unshift(template)
    this.message = TemplateExecutionError.composeMessage(
      this.templates,
      this.original,
    )
    this.updateStack()
  }

  private static composeMessage(
    templates: Array<string>,
    original: Error,
  ): string {
    if (templates.length === 0) {
      return original.message
    }
    const [root, ...rest] = templates
    const via = rest.length > 0 ? ` (caused by ${rest.join(' -> ')})` : ''
    return `template ${root} failed to execute with error: ${original.message}${via}`
  }

  private updateStack(): void {
    const lines = [`${this.name}: ${this.message}`]
    if (this.original.stack) {
      lines.push('Caused by:', this.original.stack)
    }
    this.stack = lines.join('\n')
  }
}

function wrapTemplateError(template: string, err: unknown): Error {
  if (err instanceof TemplateExecutionError) {
    err.prepend(template)
    return err
  }
  const original =
    err instanceof Error ? err : new Error(err === undefined ? '' : String(err))
  return new TemplateExecutionError([template], original)
}

export abstract class TemplateFactoryBase<
  OPTIONS extends DefaultFactoryOption = DefaultFactoryOption,
> {
  public ext: Array<string> = []
  public cache: HashTypeGeneric<TemplateBase<OPTIONS>>
  public root?: Array<string> = undefined
  public options: OPTIONS & SourceMapOptions
  public watch = false

  constructor(config?: Partial<FactoryConfig<OPTIONS>>) {
    if (config?.options) {
      this.options = {
        ...(DefaultFactoryOptions as OPTIONS),
        ...config.options,
      }
    } else {
      this.options = { ...(DefaultFactoryOptions as OPTIONS) } as OPTIONS
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
          .filter((a) => a !== tpl.name)
          .forEach((a) => {
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
  public blockContent(
    tpl: TemplateBase<OPTIONS>,
    slots?: SlotsHash,
  ): BlockContent<OPTIONS> {
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
      partial<T>(
        obj: T,
        name: string,
        partialOptions?: PartialInvocationOptions,
      ) {
        const wantsSourceMap =
          partialOptions && Object.prototype.hasOwnProperty.call(partialOptions, 'sourceMap')
            ? Boolean(partialOptions.sourceMap)
            : false

        const previousOptions = self.options
        const mergedOptions = {
          ...(this.options as OPTIONS),
          ...(partialOptions ?? {}),
        } as OPTIONS & SourceMapOptions

        if (!wantsSourceMap) {
          mergedOptions.sourceMap = false
        }

        self.options = mergedOptions

        try {
          const runAndNormalize = (resolvedName: string, absPath: boolean) => {
            const result = self.runPartial({
              context: obj,
              name: resolvedName,
              absPath,
              slots: this.slots,
              options: mergedOptions as OPTIONS,
            })

            if (!wantsSourceMap && result && typeof result === 'object') {
              if ('code' in (result as Record<string, unknown>)) {
                return (result as { code: string }).code
              }
            }
            return result
          }

          if (tpl.aliases.hasOwnProperty(name)) {
            return runAndNormalize(tpl.aliases[name], true)
          }

          return runAndNormalize(name, false)
        } finally {
          self.options = previousOptions
        }
      },
      content<T>(
        name: string,
        context: T,
        content: ContentFunction,
        partial: PartialFunction,
        slot: SlotFunction,
      ) {
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
              throw wrapTemplateError($this.name!, e)
            }
          }
        }
        return go.call(tpl, $context, $content, $partial, this.slot)
      },
      runAsync<T>(
        $context: T,
        $content: ContentFunction,
        $partial: PartialFunction,
      ): Promise<string | Array<{ name: string; content: string }>> {
        async function go(
          this: TemplateBase<OPTIONS>,
          context,
          content,
          partial,
          slot,
        ): Promise<string | Array<{ name: string; content: string }>> {
          const $this = this as TemplateBase<OPTIONS>
          if ($this.parent) {
            const parent = self.ensure($this.parent)
            scripts.push($this.script)
            return go.call(parent, context, content, partial, slot)
          } else {
            try {
              const result = ($this.script as any)(
                context,
                content,
                partial,
                slot,
                self.options,
              )
              return await result
            } catch (e) {
              throw wrapTemplateError($this.name!, e)
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
      ; (bc as any).runAsync = (bc as any).runAsync
        ? (bc as any).runAsync.bind(bc)
        : (bc as any).runAsync
    bc.slot = bc.slot.bind(bc)
    return bc
  }

  public preload(fileName?: string) {
    throw new Error('abstract method call')
  }

  public load(fileName: string, absPath?: boolean): TemplateBase<OPTIONS> {
    throw new Error('abstract method call')
  }

  public run<T>(
    context: T,
    name: string,
  ): string | Array<{ name: string; content: string }> {
    throw new Error('abstract method call')
  }

  public runPartial<CONTEXT>(_: RunPartialContext<CONTEXT, OPTIONS>): string {
    throw new Error('abstract method call')
  }
}
