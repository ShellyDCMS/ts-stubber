# ts-stubber

![ts-stubber](https://github.com/ShellyDCMS/ts-stubber/actions/workflows/npm-publish.yml/badge.svg)
[![NPM](https://img.shields.io/npm/v/ts-stubber)](https://www.npmjs.com/package/ts-stubber)
[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/main/LICENSE)
![typescript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)
![Known Vulnerabilities](https://snyk.io/test/github/{ShellyDCMS}/{ts-stubber}/badge.svg)

![Branches](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-branches.svg)
![Functions](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-functions.svg)
![Lines](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-lines.svg)
![Statements](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-statements.svg)
![Coverage total](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-total.svg)

A generic stubbed instance creator to lazy stub any interface/class, while completely avoiding calling class's constructor.
Thus, enabling both avoiding side effects that may occur while class constructor is activated and mocking Classes with no default constructor.

## [Documentation](https://shellydcms.github.io/ts-stubber/modules.html)

## Installation

`npm i -D ts-stubber`

or

`yarn add -D ts-stubber`

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

// creating a stubbed instance using the native node:test module
const const nodeStubbedInstanceCreator = StubbedInstanceCreator<MyClass, Mock<Function>>(
  () => mock.fn()
);

const nodeMockMyClass = nodeStubbedInstanceCreator.createStubbedInstance();

// creating a stubbed instance using sinon
const sinonStubbedInstanceCreator = StubbedInstanceCreator<MyClass, SinonStub>(
  () => sinon.stub()
);

const sinonMockMyClass = sinonStubbedInstanceCreator.createStubbedInstance();

// creating a stubbed instance using jest
const jestStubbedInstanceCreator = StubbedInstanceCreator<MyClass, jest.Mock>(
  () => jest.fn()
);

const jestMockMyClass = jestStubbedInstanceCreator.createStubbedInstance();
```

## Caveats, Known Issues, and Limitations

Due to the lazy nature of the stubbing, for properties to exist in the stub, they must be overridden or set with a value.

```ts
class MyClass {
  property: number = 3;
  get getter(): number {
    return this.property;
  }
  set setter(value: number) {
    throw new Error("Should not be called");
  }
}

it("should have own property given property is overridden", () => {
  const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
    jest.fn()
  ).createStubbedInstance({ property: 5 }); // this test will fail if property is not overridden
  expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
});

it("should have own property given property is set", () => {
  const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
    jest.fn()
  ).createStubbedInstance();
  mockMyClass.property = 8; // this test will fail if property is not set
  expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
});
```

## Testing

1. Set up the repo - `yarn`
2. Build the project - `npm run build`
3. Running Jest tests - `npm run test`
4. Running Cypress tests - `npm run cy:run`

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/main/LICENSE.md) file for details
