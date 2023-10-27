"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const project = new ts_morph_1.Project();
const sourceFile = project.createSourceFile('example.ts', `
  interface Person {
    name: string;
    age: number;
  }

  function printPerson({ name, age }: Person) {
    console.log(\`Name: \${name}, Age: \${age}\`);
  }

  const person = { name: 'John', age: 30 };
  printPerson(person);
`);
const printPersonFunction = sourceFile.getFunction('printPerson');
const parameter = printPersonFunction === null || printPersonFunction === void 0 ? void 0 : printPersonFunction.getParameters()[0];
console.log(`Type of parameter '${parameter === null || parameter === void 0 ? void 0 : parameter.getName()}' is '${parameter === null || parameter === void 0 ? void 0 : parameter.getType().getText()}'`);
//# sourceMappingURL=test.js.map