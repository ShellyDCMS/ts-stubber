ts-stubber / [Exports](modules.md)

# ts-stubber

![ts-stubber](https://github.com/ShellyDCMS/ts-stubber/actions/workflows/npm-publish.yml/badge.svg)

A generic stubbed instance creator to lazy stub any interface/class, without calling class's constructor.

## [Markdown Documentation](https://github.com/ShellyDCMS/ts-stubber/blob/main/documents/modules.md)

## [HTML Documentation](https://shellydcms.github.io/ts-stubber/modules.html)

## Usage

This library provides an API to create a stubbed instance of a class or interface, including property functions, allowing overrides and excluded methods.

```ts
class MyClass {
  constructor(input: number) {
    throw new Error("Should not be called");
  }
  func(input: number, text: string) {
    console.log(text);
    return input;
  }
  property: number = 3;
  optionalProperty?: number;
  get getter(): number {
    return this.property;
  }
  set setter(value: number) {
    throw new Error("Should not be called");
  }
}

const sinonStubbedInstanceCreator = StubbedInstanceCreator<MyClass, SinonStub>(
  () => sinon.stub()
);

const sinonMockMyClass = sinonStubbedInstanceCreator.createStubbedInstance();

const jestStubbedInstanceCreator = StubbedInstanceCreator<MyClass, jest.Mock>(
  () => jest.fn()
);

const jestMockMyClass = jestStubbedInstanceCreator.createStubbedInstance();
```

`npm i -D @ts-stubber`

or

`yarn add -D @ts-stubber`

## Developing

1. Set up the repo - `yarn`
2. Build the project - `npm run build`
3. Running tests - `npm run cy:run`
