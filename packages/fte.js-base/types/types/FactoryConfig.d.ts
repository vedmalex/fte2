import { DefaultFactoryOption } from './DefaultFactoryOption';
export interface FactoryConfig<OPTIONS extends DefaultFactoryOption = DefaultFactoryOption> {
    root: string | Array<string>;
    ext: Array<string>;
    preload: boolean;
    options: OPTIONS;
    watch: boolean;
}
//# sourceMappingURL=FactoryConfig.d.ts.map