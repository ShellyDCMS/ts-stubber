[ts-stubber - v1.0.2](README.md) / Exports

# ts-stubber - v1.0.2

## Table of contents

### Type Aliases

- [StubbedInstance](modules.md#stubbedinstance)
- [StubbedMember](modules.md#stubbedmember)

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

## Functions

### StubbedInstanceCreator

▸ **StubbedInstanceCreator**\<`T`, `StubT`\>(`createStub`): `Object`

#### Type parameters

| Name |
| :------ |
| `T` |
| `StubT` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `createStub` | (`prop`: `string`) => `StubT` | method for stub creation, for example: sinon.stub() |

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
