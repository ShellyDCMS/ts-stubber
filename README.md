ts-stubber / [Exports](modules.md)

# ts-stubber

![ts-stubber](https://github.com/ShellyDCMS/ts-stubber/actions/workflows/npm-publish.yml/badge.svg)

A generic stubbed instance creator to lazy stub any interface/class, while completely avoiding calling class's constructor.
Thus, enabling both avoiding side effects that may occur while class constructor is activated and mocking Classes with no default constructor.

## [Markdown Documentation](https://github.com/ShellyDCMS/ts-stubber/blob/main/documents/modules.md)

## [HTML Documentation](https://shellydcms.github.io/ts-stubber/modules.html)

## Installation

`npm i -D @ts-stubber`

or

`yarn add -D @ts-stubber`

## Usage

This library provides an API to create a stubbed instance of a class or interface, including property functions, allowing overrides of methods, setters and getters..

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

## Caveats, Known Issues, and Limitations

Some of JS built-in function such as `hasOwnProperty` will act differently when applied on the mocked Class.

```ts
class MyClass {
  property: number = 3;
}

it("should not override build in methods", () => {
  const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
    jest.fn()
  ).createStubbedInstance();
  const myClass = new MyClass(5);
  expect(myClass.hasOwnProperty("property")).toBe(true);
  // NOTE! mockMyClass does not have a property called "property"
  expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(false);
});
```

## Testing

1. Set up the repo - `yarn`
2. Build the project - `npm run build`
3. Running Jest tests - `npm run test`
4. Running Cypress tests - `npm run cy:run`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
