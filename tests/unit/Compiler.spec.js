// Tests for assembly compiler
import startCompilation from '@/scripts/Compiler.js'

describe("Compilers tests", () => {
    test("Compiles no instructions", () => {
        // Prepare
        var code = ""
        var instructionList = [];
        // Execute
        startCompilation(code, instructionList);
        // Assert
        expect(instructionList).toEqual([{ instruction: "END" }]);
    })

    test("Compiles single parameterless instruction", () => {
        var code = "HALT";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "HALT" }, { instruction: "END" }]);
    })

    test("Compile multiple parameterless instructions", () => {
        var code = "ACCINC NEGATE ACCDEC NOP HALT";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "ACCINC" }, { instruction: "NEGATE" }, { instruction: "ACCDEC" }, { instruction: "NOP" }, { instruction: "HALT" }, { instruction: "END" }]);
    })

    test("Compile single address instruction", () => {
        var code = "DSTORE @1";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "DSTORE", address: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple address instructions", () => {
        var code = "DSTORE @1 DLOAD @10 MADD @0004";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "DSTORE", address: 1 }, { instruction: "DLOAD", address: 10 }, { instruction: "MADD", address: 4 }, { instruction: "END" }]);
    })

    test("Compile single label instruction", () => {
        var code = "LABEL test";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "LABEL", label: "test" }, { instruction: "END" }]);
    })

    test("Compile multiple label instructions", () => {
        var code = "LABEL test BRANCH test BRZERO someLabel";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "LABEL", label: "test" }, { instruction: "BRANCH", label: "test" }, { instruction: "BRZERO", label: "someLabel" }, { instruction: "END" }]);
    })

    test("Compile single value instruction", () => {
        var code = "MLOAD 150";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 150 }, { instruction: "END" }]);
    })

    test("Compile multiple value instructions", () => {
        var code = "MLOAD 150 MLOAD -110";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 150 }, { instruction: "MLOAD", value: -110 }, { instruction: "END" }]);
    })

    test("Compile multiple various instructions", () => {
        var code = "MLOAD 5 LABEL loop DSTORE @10 ACCDEC ISTORE @10 BRPOS loop";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 5 }, { instruction: "LABEL", label: "loop" }, { instruction: "DSTORE", address: 10 }, { instruction: "ACCDEC"}, { instruction: "ISTORE", address: 10 }, { instruction: "BRPOS", label: "loop" }, { instruction: "END" }]);
    })

    test("Compile multiple various instructions with line breaks", () => {
        var code = "MLOAD 5\nLABEL loop\nDSTORE @10\nACCDEC\nISTORE @10\nBRPOS loop";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 5 }, { instruction: "LABEL", label: "loop" }, { instruction: "DSTORE", address: 10 }, { instruction: "ACCDEC"}, { instruction: "ISTORE", address: 10 }, { instruction: "BRPOS", label: "loop" }, { instruction: "END" }]);
    })

    test("Fail at unknown instruction", () => {
        var code = "NOP FAIL NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at invalid address parameter, missing @", () => {
        var code = "NOP DSTORE 66 NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at invalid address parameter, not a number", () => {
        var code = "NOP DSTORE @1a NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at missing address parameter", () => {
        var code = "NOP DSTORE NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at invalid value parameter, not a number", () => {
        var code = "NOP MLOAD 1a NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at invalid value parameter, address format", () => {
        var code = "NOP MLOAD @10 NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at missing value parameter", () => {
        var code = "NOP MLOAD NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at invalid label parameter, is keyword", () => {
        var code = "NOP LABEL accinc NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at missing label parameter", () => {
        var code = "NOP LABEL NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })
})