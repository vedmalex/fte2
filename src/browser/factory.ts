import { TemplateBrowser } from './template';
import { TemplateFactoryBase } from './../common/factory';
import { HashTypeGeneric, HashType } from './../common/interfaces';
import { TemplateConfig } from './../common/interfaces';

/**
 * We must ensure that template is registered with its compiled tempaltes
 */
declare var global: { fte: HashTypeGeneric<TemplateConfig> };

export class TemplateFactoryBrowser extends TemplateFactoryBase {

  public resolveTemplateConfig(fileName: string): TemplateConfig {
    let result = global.fte[fileName];
    result.factory = this;
    result.name = fileName;
    return result;
  }

  public load(fileName: string, absPath?: boolean) {
    let template = this.resolveTemplateConfig(fileName);
    let templ = new TemplateBrowser(template);
    this.register(templ, fileName);
    templ.compile();
    return templ;
  }

  public run(context: HashType, name: string, absPath?: boolean): string {
    let templ = this.ensure(name);
    let bc = this.blockContent(templ);
    return bc.run(context, bc.content, bc.partial);
  }
}
