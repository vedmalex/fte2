import { Project } from 'ts-morph'

const project = new Project()
const sourceFile = project.createSourceFile(
  'example.ts',
  `
  interface Person {
    name: string;
    age: number;
  }

  function printPerson({ name, age }: Person) {
    console.log(\`Name: \${name}, Age: \${age}\`);
  }

  const person = { name: 'John', age: 30 };
  printPerson(person);
`,
)

const printPersonFunction = sourceFile.getFunction('printPerson')
const parameter = printPersonFunction?.getParameters()[0]
console.log(
  `Type of parameter '${parameter?.getName()}' is '${parameter?.getType().getText()}'`,
)
