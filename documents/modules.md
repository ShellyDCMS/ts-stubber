[ts-stubber - v1.0.1](README.md) / Exports

# ts-stubber - v1.0.1

## Table of contents

### Type Aliases

- [StubbedInstance](modules.md#stubbedinstance)
- [StubbedMember](modules.md#stubbedmember)

### Variables

- [defaultExcludedMethods](modules.md#defaultexcludedmethods)

### Functions

- [StubbedInstanceCreator](modules.md#stubbedinstancecreator)

## Type Aliases

### StubbedInstance

Ƭ **StubbedInstance**\<`T`, `StubT`\>: \{ [P in keyof T]: StubbedMember\<T[P], StubT\> }

#### Type parameters

| Name |
| :------ |
| `T` |
| `StubT` |

___

### StubbedMember

Ƭ **StubbedMember**\<`T`, `StubT`\>: `T` extends (...`args`: infer TArgs) => infer TReturnValue ? `StubT` : `T`

Replaces a type with a stub if it's a function.

#### Type parameters

| Name |
| :------ |
| `T` |
| `StubT` |

## Variables

### defaultExcludedMethods

• `Const` **defaultExcludedMethods**: `string`[]

## Functions

### StubbedInstanceCreator

▸ **StubbedInstanceCreator**\<`T`, `StubT`\>(`createStub`, `excludedMethods?`): `Object`

#### Type parameters

| Name |
| :------ |
| `T` |
| `StubT` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `createStub` | (`prop`: `string`) => `StubT` | `undefined` | method for stub creation, for example: sinon.stub() |
| `excludedMethods` | `string`[] | `defaultExcludedMethods` | methods to exclude from mocking. default is defaultExcludedMethods |

#### Returns

`Object`

a stub creator object with a single method: createStubbedInstance

| Name | Type |
| :------ | :------ |
| `createStubbedInstance` | (`overrides?`: `Partial`\<`T`\>) => [`StubbedInstance`](modules.md#stubbedinstance)\<`T`, `StubT`\> & `T` |

**createStubbedInstance**: (`overrides?`: `Partial`\<`T`\>) => [`StubbedInstance`](modules.md#stubbedinstance)\<`T`, `StubT`\> & `T`

\-

-----

**`Example`**

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
