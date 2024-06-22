import { describe, expect } from "@jest/globals";
import { Chance } from "chance";
import { StubbedInstanceCreator } from "./stub-builder";

describe("Jest stub builder tests with Jest Mocks", () => {
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
      jest.Mock
    >(() => jest.fn());

    it("should stub interface", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.func(input, "whatever");
      expect(mockMyInterface.func).toHaveBeenCalledWith(input, "whatever");
    });

    it("should assert stub async function calls", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();

      mockMyInterface.asynFunc.mockReturnValue(Promise.resolve(returnValue));
      await mockMyInterface.asynFunc(input);
      expect(mockMyInterface.asynFunc).toHaveBeenCalledWith(input);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = jest.fn().mockReturnValue(Promise.resolve(returnValue));
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyInterface.asynFunc(input);
      expect(mockMyInterface.asynFunc).toHaveBeenCalledWith(input);
    });

    it("should stub async function", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.asynFunc.mockResolvedValue(returnValue);
      expect(await mockMyInterface.asynFunc(input)).toEqual(returnValue);
    });

    it("should stub async function using overrides", async () => {
      const stub = jest.fn().mockResolvedValue(returnValue);
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      expect(await mockMyInterface.asynFunc(input)).toEqual(returnValue);
    });

    it("should stub async property function", async () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      await mockMyInterface.asyncPropertyFunc(input);
      expect(mockMyInterface.asyncPropertyFunc).toHaveBeenCalledWith(input);
    });

    it("should override class property Function", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.propertyFunc.mockReturnValue(returnValue);
      expect(mockMyInterface.propertyFunc(input)).toEqual(returnValue);
    });

    it("should stub interface property function", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.propertyFunc(input);
      expect(mockMyInterface.propertyFunc).toHaveBeenCalledWith(input);
    });

    it("should override interface property", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyInterface.property).toEqual(propertyValue);
    });

    it("should override interface getter", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        getter: propertyValue
      });
      expect(mockMyInterface.getter).toEqual(propertyValue);
    });

    it("should stub interface setter with override", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyInterface.property).toEqual(propertyValue);
    });

    it("should allow setter calls", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      expect((mockMyInterface.setter = input)).not.toThrow;
    });

    it("should allow setting properties", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.property = propertyValue;
      expect(mockMyInterface.property).toEqual(propertyValue);
    });

    it("should stub interface function return value", () => {
      const mockMyInterface = stubbedInstanceCreator.createStubbedInstance();
      mockMyInterface.func.mockReturnValue(returnValue);
      expect(mockMyInterface.func(input, "whatever")).toEqual(returnValue);
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
        jest.Mock
      >(() => jest.fn());

      it("should assert stub async function calls", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.asynFunc.mockResolvedValue(returnValue);
        await mockMyInheritedClass.asynFunc(input);
        expect(mockMyInheritedClass.asynFunc).toHaveBeenCalledWith(input);
      });

      it("should assert stub async function calls using overrides", async () => {
        const stub = jest.fn().mockReturnValue(Promise.resolve(returnValue));
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            asynFunc: stub
          });
        await mockMyInheritedClass.asynFunc(input);
        expect(mockMyInheritedClass.asynFunc).toHaveBeenCalledWith(input);
      });

      it("should stub async function", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.asynFunc.mockReturnValue(
          Promise.resolve(returnValue)
        );
        expect(await mockMyInheritedClass.asynFunc(input)).toEqual(returnValue);
      });

      it("should stub async function using overrides", async () => {
        const stub = jest.fn().mockReturnValue(Promise.resolve(returnValue));
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            asynFunc: stub
          });
        expect(await mockMyInheritedClass.asynFunc(input)).toEqual(returnValue);
      });

      it("should stub async property function", async () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        await mockMyInheritedClass.asyncPropertyFunc(input);
        expect(mockMyInheritedClass.asyncPropertyFunc).toHaveBeenCalledWith(
          input
        );
      });

      it("should override class property Function", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.propertyFunc.mockReturnValue(returnValue);
        expect(mockMyInheritedClass.propertyFunc(input)).toEqual(returnValue);
      });

      it("should stub class property function", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.propertyFunc(input);
        expect(mockMyInheritedClass.propertyFunc).toHaveBeenCalledWith(input);
      });

      it("should override class property", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            property: propertyValue
          });
        expect(mockMyInheritedClass.property).toEqual(propertyValue);
      });

      it("should override class getter", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            getter: propertyValue
          });
        expect(mockMyInheritedClass.getter).toEqual(propertyValue);
      });

      it("should stub class property with override", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            property: propertyValue
          });
        expect(mockMyInheritedClass.property).toEqual(propertyValue);
      });

      it("should assert stub class setter calls", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        expect((mockMyInheritedClass.setter = propertyValue)).not.toThrow;
      });

      it("should allow setting properties", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.property = propertyValue;
        expect(mockMyInheritedClass.property).toEqual(propertyValue);
      });

      it("should allow setting optional properties", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance({
            optionalProperty: propertyValue
          });
        expect(mockMyInheritedClass.optionalProperty).toEqual(propertyValue);
        mockMyInheritedClass.optionalProperty = propertyValue + 1;
        expect(mockMyInheritedClass.optionalProperty).toEqual(
          propertyValue + 1
        );
      });

      it("should stub class", () => {
        const str: string = chance.word();
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.func(input, str);
        expect(mockMyInheritedClass.func).toHaveBeenCalledWith(input, str);
      });

      it("should stub class function return value", () => {
        const mockMyInheritedClass =
          stubbedInstanceCreator.createStubbedInstance();
        mockMyInheritedClass.func.mockReturnValue(returnValue);
        expect(mockMyInheritedClass.func(input, "whatever")).toEqual(
          returnValue
        );
      });
    });

    it("should have own property given property is overridden", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance({ property: 5 }); // this test will fail if property is not overridden
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
    });

    it("should have own property given property is set", () => {
      // creating a stubbed instance using jest
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance();
      mockMyClass.property = 8; // this test will fail if property is not set
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
    });

    it("should override properties given overridden", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance({ property: 5 }); // this test will fail if property is not overridden
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
    });
    it("given overriding property, should have own property", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance({ property: 5 });
      expect((<MyClass>mockMyClass).hasOwnProperty("property")).toBe(true);
    });

    it("should stub class function", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance();
      mockMyClass.func.mockReturnValue(returnValue);
      expect(mockMyClass.func(5)).toEqual(returnValue);
    });

    it("should stub property class function", () => {
      const mockMyClass = StubbedInstanceCreator<MyClass, jest.Mock>(() =>
        jest.fn()
      ).createStubbedInstance();
      mockMyClass.propertyFunc.mockReturnValue(returnValue);
      expect(mockMyClass.propertyFunc(5)).toEqual(returnValue);
    });

    const stubbedInstanceCreator = StubbedInstanceCreator<MyClass, jest.Mock>(
      () => jest.fn()
    );

    it("should assert stub async function calls", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.mockResolvedValue(returnValue);
      await mockMyClass.asynFunc(input);
      expect(mockMyClass.asynFunc).toHaveBeenCalledWith(input);
    });

    it("should assert stub async function calls using overrides", async () => {
      const stub = jest.fn().mockResolvedValue(returnValue);
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      await mockMyClass.asynFunc(input);
      expect(mockMyClass.asynFunc).toHaveBeenCalledWith(input);
    });

    it("should stub async function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.asynFunc.mockResolvedValue(returnValue);
      expect(await mockMyClass.asynFunc(input)).toEqual(returnValue);
    });

    it("should stub async function using overrides", async () => {
      const stub = jest.fn().mockResolvedValue(returnValue);
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        asynFunc: stub
      });
      expect(await mockMyClass.asynFunc(input)).toEqual(returnValue);
    });

    it("should stub async property function", async () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      await mockMyClass.asyncPropertyFunc(input);
      expect(mockMyClass.asyncPropertyFunc).toHaveBeenCalledWith(input);
    });

    it("should override class property Function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc.mockReturnValue(returnValue);
      expect(mockMyClass.propertyFunc(input)).toEqual(returnValue);
    });

    it("should stub class property function", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.propertyFunc(input);
      expect(mockMyClass.propertyFunc).toHaveBeenCalledWith(input);
    });

    it("should override class property", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      expect(mockMyClass.property).toEqual(propertyValue);
    });

    it("should override class getter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        getter: propertyValue
      });
      expect(mockMyClass.getter).toEqual(propertyValue);
    });

    it("should stub class setter", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance({
        property: propertyValue
      });
      mockMyClass.setter = chance.integer();
      expect(mockMyClass.property).toEqual(propertyValue);
    });

    it("should stub setter calls", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      expect((mockMyClass.setter = chance.integer())).not.toThrow;
    });

    it("should allow setting properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.property = propertyValue;
      expect(mockMyClass.property).toEqual(propertyValue);
    });

    it("should allow setting optional properties", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.optionalProperty = propertyValue;
      expect(mockMyClass.optionalProperty).toEqual(propertyValue);
    });

    it("should stub class", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func(input, "whatever");
      expect(mockMyClass.func).toHaveBeenCalledWith(input, "whatever");
    });

    it("should stub class function return value", () => {
      const mockMyClass = stubbedInstanceCreator.createStubbedInstance();
      mockMyClass.func.mockReturnValue(returnValue);
      expect(mockMyClass.func(input, "whatever")).toEqual(returnValue);
    });
  });
});
