import { Chance } from "chance";
import sinon, { SinonStub } from "sinon";
import { StubbedInstanceCreator } from "./stub-builder";
describe("Cypress stub builder tests with Sinon Stubs", () => {
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

    describe("Given inherited class", () => {
      class MyInheritedClass extends MyClass {
        constructor() {
          super(5);
          throw new Error("Should not be called");
        }
      }

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
        const stub = sinon.stub().returns(Promise.resolve(returnValue));
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
        expect(await mockMyInheritedClass.asynFunc(input)).to.eq(returnValue);
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

    it("should override properties given property is overridden", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance({ property: 5 }); // this test will fail if property is not overridden
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).to.eq(true);
    });

    it("should have own property given property is set", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance();
      mockMyClass.property = 8; // this test will fail if property is not set
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).to.eq(true);
    });

    it("should stub class function", () => {
      // creating a stubbed instance using sinon
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance();
      mockMyClass.func.returns(returnValue);
      expect(mockMyClass.func(input)).to.eq(returnValue);
    });

    it("should stub property class function", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, SinonStub>(() =>
        sinon.stub()
      ).createStubbedInstance();
      mockMyClass.propertyFunc.returns(returnValue);
      expect(mockMyClass.propertyFunc(input)).to.eq(returnValue);
    });

    const stubbedInstanceCreator = StubbedInstanceCreator<MyClass, SinonStub>(
      () => sinon.stub()
    );

    it("should assert stub async function calls", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.returns(Promise.resolve(returnValue));
      await mockMyClass.asynFunc(input);
      expect(mockMyClass.asynFunc).to.be.calledWith(input);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(returnValue));
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyClass.asynFunc(input);
      expect(mockMyClass.asynFunc).to.be.calledWith(input);
    });

    it("should stub async function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.returns(Promise.resolve(returnValue));
      expect(await mockMyClass.asynFunc(input)).to.eq(returnValue);
    });

    it("should stub async function using overrides", async () => {
      const stub = sinon.stub().returns(Promise.resolve(returnValue));
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      expect(await mockMyClass.asynFunc(input)).to.eq(returnValue);
    });

    it("should stub async property function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      await mockMyClass.asyncPropertyFunc(input);
      expect(mockMyClass.asyncPropertyFunc).to.be.calledWith(input);
    });

    it("should override class property Function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc.returns(returnValue);
      expect(mockMyClass.propertyFunc(input)).to.eq(returnValue);
    });

    it("should stub class property function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc(input);
      expect(mockMyClass.propertyFunc).to.be.calledWith(input);
    });

    it("should override class property", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyClass.property).to.eq(propertyValue);
    });

    it("should override class getter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        getter: propertyValue
      });
      expect(mockMyClass.getter).to.eq(propertyValue);
    });

    it("should stub class setter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      mockMyClass.setter = chance.integer();
      expect(mockMyClass.property).to.eq(propertyValue);
    });

    it("should stub setter calls", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      expect((mockMyClass.setter = propertyValue)).not.to.throw;
    });

    it("should allow setting properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.property = propertyValue;
      expect(mockMyClass.property).to.eq(propertyValue);
    });

    it("should allow setting optional properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.property = propertyValue;
      mockMyClass.optionalProperty = propertyValue;
      expect(mockMyClass.optionalProperty).to.eq(propertyValue);
    });

    it("should stub class", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func(input, "whatever");
      expect(mockMyClass.func).to.be.calledWith(input, "whatever");
    });

    it("should stub class function return value", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func.returns(returnValue);
      expect(mockMyClass.func(input, "whatever")).to.eq(returnValue);
    });
  });
});
