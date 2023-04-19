"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeinfer_1 = require("./inferer/typeinfer");
describe('typeinferer', () => {
    it('function with no params', () => {
        const text = `
      function name(){}
    `;
        const result = (0, typeinfer_1.inferTypesFromFunction)(text);
        const func = result.get('name');
        expect(func).not.toBeUndefined();
        expect(func === null || func === void 0 ? void 0 : func.name).toBe('name');
        expect(func === null || func === void 0 ? void 0 : func.typeName).toBe('Name');
        expect(func === null || func === void 0 ? void 0 : func.type).toBe('function');
        expect(func === null || func === void 0 ? void 0 : func.properties.size).toBe(0);
    });
    it('empty function with params', () => {
        const text = `
      function name(name, info){}
    `;
        const result = (0, typeinfer_1.inferTypesFromFunction)(text);
        const func = result.get('name');
        expect(func).not.toBeUndefined();
        expect(func === null || func === void 0 ? void 0 : func.name).toBe('name');
        expect(func === null || func === void 0 ? void 0 : func.typeName).toBe('Name');
        expect(func === null || func === void 0 ? void 0 : func.type).toBe('function');
        expect(func === null || func === void 0 ? void 0 : func.properties.size).toBe(2);
    });
    it('function with params', () => {
        const text = `
      function name({name, info}) {
        function other({context, generation}){
          generation += 1
          name.toString()
          return context
        }
        other(info)
        return name
      }
    `;
        const result = (0, typeinfer_1.inferTypesFromFunction)(text);
        expect(result.size).toBe(2);
        const func = result.get('name');
        expect(func).not.toBeUndefined();
        expect(func === null || func === void 0 ? void 0 : func.name).toBe('name');
        expect(func === null || func === void 0 ? void 0 : func.typeName).toBe('Name');
        expect(func === null || func === void 0 ? void 0 : func.type).toBe('function');
        expect(func === null || func === void 0 ? void 0 : func.properties.size).toBe(1);
        expect(func === null || func === void 0 ? void 0 : func.properties.get('param0')).not.toBeUndefined();
    });
    it('function param with property-method call', () => {
        var _a;
        const text = `
      function other(name){
        name.toString()
      }
    `;
        const result = (0, typeinfer_1.inferTypesFromFunction)(text);
        expect(result.size).toBe(1);
        const func = result.get('other');
        expect(func).not.toBeUndefined();
        expect(func === null || func === void 0 ? void 0 : func.name).toBe('other');
        expect(func === null || func === void 0 ? void 0 : func.typeName).toBe('Other');
        expect(func === null || func === void 0 ? void 0 : func.type).toBe('function');
        expect(func === null || func === void 0 ? void 0 : func.properties.size).toBe(1);
        expect(func === null || func === void 0 ? void 0 : func.properties.get('name')).not.toBeUndefined();
        expect((_a = func === null || func === void 0 ? void 0 : func.properties.get('name')) === null || _a === void 0 ? void 0 : _a.type).toBe('object');
    });
});
//# sourceMappingURL=typeinferer.test.js.map