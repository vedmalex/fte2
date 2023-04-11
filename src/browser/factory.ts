import { DefaultFactoryOption } from '../common/types/DefaultFactoryOption'
import { TemplateConfig } from '../common/types/TemplateConfig'

/**
 * We must ensure that template is registered with its compiled templates
 */
export declare let global: {
  fte<OPTIONS extends DefaultFactoryOption>(filename): TemplateConfig<OPTIONS>
}
