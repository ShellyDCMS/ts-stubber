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

/**
 *
 * @param createStub - method for stub creation, for example: sinon.stub()
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
  createStub: (prop: string) => StubT
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
      debugger;
      if (!(prop in target)) {
        target[prop] = createStub(prop);
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
