# ts-stubber

![ts-stubber](https://github.com/ShellyDCMS/ts-stubber/actions/workflows/npm-publish.yml/badge.svg) 
[![npm version](https://badge.fury.io/js/ts-stubber.svg)](https://badge.fury.io/js/ts-stubber)
![MIT](https://camo.githubusercontent.com/a4426cbe5c21edb002526331c7a8fbfa089e84a550567b02a0d829a98b136ad0/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)
![typescript](https://camo.githubusercontent.com/017786f7ebc845ae38c14f3bc28dc6162e756f33ea8549fd4f9071c405edb5de/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f2533432532462533452d547970655363726970742d2532333030373463312e737667)

![Branches](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-branches.svg)
![Functions](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-functions.svg)
![Lines](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-lines.svg)
![Statements](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-statements.svg)
![Coverage total](https://raw.githubusercontent.com/ShellyDCMS/ts-stubber/badges/badges/coverage-total.svg)

A generic stubbed instance creator to lazy stub any interface/class, while completely avoiding calling class's constructor.
Thus, enabling both avoiding side effects that may occur while class constructor is activated and mocking Classes with no default constructor.

## [Documentation](https://shellydcms.github.io/ts-stubber/modules.html)

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
