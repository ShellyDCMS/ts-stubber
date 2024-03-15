import { Chance } from "chance";
import sinon, { SinonStub } from "sinon";
import { StubbedInstanceCreator } from "./stub-builder";
describe("stub builder tests", () => {
  const chance = new Chance();
  const input = chance.integer();
  const returnValue = chance.integer();
  const propertyValue = chance.integer();

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
      mockMyInterface.func(input, "whatever");
      expect(mockMyInterface.func).to.be.calledWith(input, "whatever");
    });

    it("should assert stub async function calls", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();

      mockMyInterface.asynFunc.returns(Promise.resolve(returnValue));
      await mockMyInterface.asynFunc(input);
      expect(mockMyInterface.asynFunc).to.be.calledWith(input);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(returnValue));
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyInterface.asynFunc(input);
      expect(mockMyInterface.asynFunc).to.be.calledWith(input);
    });

    it("should stub async function", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.asynFunc.returns(Promise.resolve(returnValue));
      expect(await mockMyInterface.asynFunc(input)).to.eq(returnValue);
    });

    it("should stub async function using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(returnValue));
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      expect(await mockMyInterface.asynFunc(input)).to.eq(returnValue);
    });

    it("should stub async property function", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      await mockMyInterface.asyncPropertyFunc(input);
      expect(mockMyInterface.asyncPropertyFunc).to.be.calledWith(input);
    });

    it("should override class property Function", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.propertyFunc.returns(returnValue);
      expect(mockMyInterface.propertyFunc(input)).to.eq(returnValue);
    });

    it("should stub interface property function", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.propertyFunc(input);
      expect(mockMyInterface.propertyFunc).to.be.calledWith(input);
    });

    it("should override interface property", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyInterface.property).to.eq(propertyValue);
    });

    it("should override interface getter", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        getter: propertyValue
      });
      expect(mockMyInterface.getter).to.eq(propertyValue);
    });

    it("should stub interface setter with override", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyInterface.property).to.eq(propertyValue);
    });

    it("should allow setter calls", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      expect((mockMyInterface.setter = input)).not.to.throw;
    });

    it("should allow setting properties", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.property = propertyValue;
      expect(mockMyInterface.property).to.eq(propertyValue);
    });

    it("should stub interface function return value", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.func.returns(returnValue);
      expect(mockMyInterface.func(input, "whatever")).to.eq(returnValue);
    });
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
        return await Promise.resolve(returnValue);
      }
    }

    class MyInheritedClass extends MyClass {
      constructor() {
        super(5);
        throw new Error("Should not be called");
      }
    }
    describe("Given inherited class", () => {
      const stubbedInstanceCreator = StubbedInstanceCreator<
        MyInheritedClass,
        SinonStub
      >(() => sinon.stub());

      it("should assert stub async function calls", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.asynFunc.resolves(returnValue);
        await mockMyInheritedClass.asynFunc(input);
        expect(mockMyInheritedClass.asynFunc).to.be.calledWith(input);
      });

      it("should assert stub async function calls using overrides", async () => {
        const stub = sinon.stub().returns(Promise.resolve(7));
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            asynFunc: stub
          });
        await mockMyInheritedClass.asynFunc(input);
        expect(mockMyInheritedClass.asynFunc).to.be.calledWith(input);
      });

      it("should stub async function", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.asynFunc.returns(Promise.resolve(returnValue));
        expect(await mockMyInheritedClass.asynFunc(3)).to.eq(returnValue);
      });

      it("should stub async function using overrides", async () => {
        const stub = sinon.stub().returns(Promise.resolve(returnValue));
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            asynFunc: stub
          });
        expect(await mockMyInheritedClass.asynFunc(input)).to.eq(returnValue);
      });

      it("should stub async property function", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        await mockMyInheritedClass.asyncPropertyFunc(input);
        expect(mockMyInheritedClass.asyncPropertyFunc).to.be.calledWith(input);
      });

      it("should override class property Function", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.propertyFunc.returns(returnValue);
        expect(mockMyInheritedClass.propertyFunc(input)).to.eq(returnValue);
      });

      it("should stub class property function", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.propertyFunc(input);
        expect(mockMyInheritedClass.propertyFunc).to.be.calledWith(input);
      });

      it("should override class property", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            property: propertyValue
          });
        expect(mockMyInheritedClass.property).to.eq(propertyValue);
      });

      it("should override class getter", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            getter: propertyValue
          });
        expect(mockMyInheritedClass.getter).to.eq(propertyValue);
      });

      it("should stub class setter with override", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            property: propertyValue
          });
        expect(mockMyInheritedClass.property).to.eq(propertyValue);
      });

      it("should assert stub class setter calls", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        expect((mockMyInheritedClass.setter = propertyValue)).not.to.throw;
      });

      it("should allow setting properties", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.property = propertyValue;
        expect(mockMyInheritedClass.property).to.eq(propertyValue);
      });

      it("should allow setting optional properties", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            optionalProperty: propertyValue
          });
        expect(mockMyInheritedClass.optionalProperty).to.eq(propertyValue);
        mockMyInheritedClass.optionalProperty = propertyValue + 1;
        expect(mockMyInheritedClass.optionalProperty).to.eq(propertyValue + 1);
      });

      it("should stub class", () => {
        const str: string = chance.word();
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.func(input, str);
        expect(mockMyInheritedClass.func).to.be.calledWith(input, str);
      });

      it("should stub class function return value", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.func.returns(returnValue);
        expect(mockMyInheritedClass.func(input, "whatever")).to.eq(returnValue);
      });
    });

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

    it("should assert stub async function calls", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.returns(Promise.resolve(7));
      await mockMyClass.asynFunc(3);
      expect(mockMyClass.asynFunc).to.be.calledWith(3);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(7));
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyClass.asynFunc(3);
      expect(mockMyClass.asynFunc).to.be.calledWith(3);
    });

    it("should stub async function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.returns(Promise.resolve(7));
      expect(await mockMyClass.asynFunc(3)).to.eq(7);
    });

    it("should stub async function using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(7));
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      expect(await mockMyClass.asynFunc(3)).to.eq(7);
    });

    it("should stub async property function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      await mockMyClass.asyncPropertyFunc(3);
      expect(mockMyClass.asyncPropertyFunc).to.be.calledWith(3);
    });

    it("should override class property Function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc.returns(7);
      expect(mockMyClass.propertyFunc(3)).to.eq(7);
    });

    it("should stub class property function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc(3);
      expect(mockMyClass.propertyFunc).to.be.calledWith(3);
    });

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

    it("should allow setting properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.property = 5;
      expect(mockMyClass.property).to.eq(5);
    });

    it("should allow setting optional properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.property = 5;
      mockMyClass.optionalProperty = 5;
      expect(mockMyClass.optionalProperty).to.eq(5);
    });

    it("should stub class", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func(5, "whatever");
      expect(mockMyClass.func).to.be.calledWith(5, "whatever");
    });

    it("should stub class function return value", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func.returns(7);
      expect(mockMyClass.func(5, "whatever")).to.eq(7);
    });
  });
});
