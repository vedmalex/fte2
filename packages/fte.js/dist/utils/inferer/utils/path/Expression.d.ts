import { Part } from './Part';
export type Expression = {
    name: string | number | boolean;
    type: 'expression';
    optional: boolean;
    children: Part[];
};
//# sourceMappingURL=Expression.d.ts.map