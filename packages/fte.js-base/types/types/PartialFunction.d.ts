import type { DefaultFactoryOption } from './DefaultFactoryOption';
export interface PartialInvocationOptions extends Partial<DefaultFactoryOption> {
    [key: string]: unknown;
}
export type PartialResult = string | {
    code: string;
    map?: any;
};
export type PartialFunction = <T>(obj: T, name: string, options?: PartialInvocationOptions) => PartialResult;
//# sourceMappingURL=PartialFunction.d.ts.map