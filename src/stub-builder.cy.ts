import sinon, { SinonStub } from "sinon";
import { StubbedInstanceCreator } from "./stub-builder";

describe("stub builder tests", () => {
  describe("stubbing interface", () => {
    interface MyInterface {
      func(input: number, text: string): number;
      property: number;
      get getter(): number;
      set setter(value: number);
      propertyFunc: (int: number) => number;
      asyncPropertyFunc: (int: number) => Promise<number>;
      asynFunc(value: number): Promise<number>;
    }

    const stubbedInstanceCreator = StubbedInstanceCreator<
      MyInterface,
      SinonStub
    >(() => sinon.stub());

    it("should stub interface", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.func(5, "whatever");
      expect(mockMyInterface.func).to.be.calledWith(5, "whatever");
    });

    it("should assert stub async function calls", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();

      mockMyInterface.asynFunc.returns(Promise.resolve(7));
      await mockMyInterface.asynFunc(3);
      expect(mockMyInterface.asynFunc).to.be.calledWith(3);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(7));
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyInterface.asynFunc(3);
      expect(mockMyInterface.asynFunc).to.be.calledWith(3);
    });

    // it("should stub async function", async () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   mockMyInterface.asynFunc.returns(Promise.resolve(7));
    //   expect(await mockMyInterface.asynFunc(3)).to.eq(7);
    // });

    // it("should stub async function using overrides", async () => {
    //   const stub = given.stub().returns(Promise.resolve(7));
    //   const mockMyInterface = given.stubbedInterface<MyInterface>(
    //     "MyInterface",
    //     {
    //       asynFunc: stub
    //     }
    //   );
    //   expect(await mockMyInterface.asynFunc(3)).to.eq(7);
    // });

    // it("should stub async property function", async () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   await mockMyInterface.asyncPropertyFunc(3);
    //   then(
    //     get.assertableStub(mockMyInterface.asyncPropertyFunc)
    //   ).shouldHaveBeenCalledWith(3);
    // });

    // it("should override class property Function", () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   mockMyInterface.propertyFunc.returns(7);
    //   expect(mockMyInterface.propertyFunc(3)).to.eq(7);
    // });

    // it("should stub interface property function", () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   mockMyInterface.propertyFunc(3);
    //   then(
    //     get.assertableStub(mockMyInterface.propertyFunc)
    //   ).shouldHaveBeenCalledWith(3);
    // });

    // it("should override interface property", () => {
    //   const mockMyInterface = given.stubbedInterface<MyInterface>(
    //     "MyInterface",
    //     {
    //       property: 5
    //     }
    //   );
    //   expect(mockMyInterface.property).to.eq(5);
    // });

    // it("should override interface getter", () => {
    //   const mockMyInterface = given.stubbedInterface<MyInterface>(
    //     "MyInterface",
    //     {
    //       getter: 5
    //     }
    //   );
    //   expect(mockMyInterface.getter).to.eq(5);
    // });

    // it("should stub interface setter with override", () => {
    //   const mockMyInterface = given.stubbedInterface<MyInterface>(
    //     "MyInterface",
    //     {
    //       property: 8
    //     }
    //   );
    //   expect(mockMyInterface.property).to.eq(8);
    // });

    // it("should allow setter calls", () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   expect((mockMyInterface.setter = 5)).not.to.throw;
    // });

    // it("should allow setting properties", () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   mockMyInterface.property = 5;
    //   expect(mockMyInterface.property).to.eq(5);
    // });

    // it("should stub interface function return value", () => {
    //   const mockMyInterface =
    //     given.stubbedInterface<MyInterface>("MyInterface");
    //   mockMyInterface.func.returns(7);
    //   expect(mockMyInterface.func(5, "whatever")).to.eq(7);
    // });
  });

  describe("stubbing class", () => {
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

      propertyFunc = (int: number) => int;

      asyncPropertyFunc = async (int: number) => await Promise.resolve(int);
      async asynFunc(value: number) {
        return await Promise.resolve(9);
      }
    }

    class MyInheritedClass extends MyClass {
      constructor() {
        super(5);
        throw new Error("Should not be called");
      }
    }

    it("should stub class function", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance();
      mockMyClass.func.returns(9);
      expect(mockMyClass.func(5)).to.eq(9);
    });

    it("should stub property class function", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance();
      mockMyClass.propertyFunc.returns(9);
      expect(mockMyClass.propertyFunc(5)).to.eq(9);
    });

    const stubbedInstanceCreator = StubbedInstanceCreator<MyClass, SinonStub>(
      () => sinon.stub()
    );
    it("should override class property", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: 5
      });
      expect(mockMyClass.property).to.eq(5);
    });

    it("should override class getter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        getter: 5
      });
      expect(mockMyClass.getter).to.eq(5);
    });

    it("should stub class setter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: 8
      });
      mockMyClass.setter = 5;
      expect(mockMyClass.property).to.eq(8);
    });
    it("should stub setter calls", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      expect((mockMyClass.setter = 5)).not.to.throw;
    });
  });
});
