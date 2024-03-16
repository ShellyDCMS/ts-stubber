export type StubbedInstance<T, StubT> = {
  [P in keyof T]: StubbedMember<T[P], StubT>;
};

/**
 * Replaces a type with a stub if it's a function.
 */
export type StubbedMember<T, StubT> = T extends (
  ...args: infer TArgs
) => infer TReturnValue
  ? StubT
  : T;

export const defaultExcludedMethods: string[] = [
  "__defineGetter__",
  "__defineSetter__",
  "hasOwnProperty",
  "__lookupGetter__",
  "__lookupSetter__",
  "propertyIsEnumerable",
  "toString",
  "valueOf",
  "__proto__",
  "toLocaleString",
  "isPrototypeOf",
  "then"
];
/**
 *
 * @param createStub - method for stub creation, for example: sinon.stub()
 * @param excludedMethods - methods to exclude from mocking. default is defaultExcludedMethods
 * @returns a stub creator object with a single method: createStubbedInstance
 *
 * @example
 * ```ts
 * class MyClass {
 *    constructor(input: number) {
 *      throw new Error("Should not be called");
 *    }
 *    func(input: number, text: string) {
 *      console.log(text);
 *      return input;
 *    }
 *    property: number = 3;
 *    optionalProperty?: number;
 *    get getter(): number {
 *      return this.property;
 *    }
 *    set setter(value: number) {
 *      throw new Error("Should not be called");
 *    }
 * }
 *
 *  const sinonStubbedInstanceCreator = StubbedInstanceCreator<MyClass, SinonStub>(
 *    () => sinon.stub()
 *  );
 *
 *  const sinonMockMyClass = sinonStubbedInstanceCreator.createStubbedInstance();
 *
 *  const jestStubbedInstanceCreator = StubbedInstanceCreator<MyClass, jest.Mock>(
 *    () => jest.fn()
 *  );
 *
 *  const jestMockMyClass = jestStubbedInstanceCreator.createStubbedInstance();
 * ```
 */
export const StubbedInstanceCreator = <T, StubT>(
  createStub: (prop: string) => StubT,
  excludedMethods = defaultExcludedMethods
): {
  createStubbedInstance: (
    overrides?: Partial<T>
  ) => StubbedInstance<T, StubT> & T;
} => {
  const createStubbedInstance = (
    overrides: Partial<T> = {}
  ): StubbedInstance<T, StubT> & T => {
    let overrideValues: Record<string, any> = overrides;
    const built: Record<string, unknown> = (<T>{ ...overrideValues }) as any;

    const createStubIfNeeded = (
      target: Record<string, unknown>,
      prop: string
    ) => {
      if (!target[prop] && !excludedMethods.includes(prop)) {
        const stub = createStub(prop);
        target[prop] = stub;
      }
    };

    const builder = new Proxy(built, {
      get(target, prop: string) {
        createStubIfNeeded(target, prop);
        return target[prop];
      },
      set(target, prop: string, args?: any) {
        built[prop] = args;
        return true;
      }
    });

    return builder as StubbedInstance<T, StubT> & T;
  };
  return { createStubbedInstance };
};
