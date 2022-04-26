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

        expect(instructionList).toEqual([{ instruction: "HALT", line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple parameterless instructions", () => {
        var code = "ACCINC NEGATE ACCDEC NOP HALT";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "ACCINC", line: 1 }, { instruction: "NEGATE", line: 1 }, { instruction: "ACCDEC", line: 1 }, { instruction: "NOP", line: 1 }, { instruction: "HALT", line: 1 }, { instruction: "END" }]);
    })

    test("Compile single address instruction", () => {
        var code = "DSTORE @1";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "DSTORE", address: 1, line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple address instructions", () => {
        var code = "DSTORE @1 DLOAD @A MADD @0B1";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "DSTORE", address: 1, line: 1 }, { instruction: "DLOAD", address: 10, line: 1 }, { instruction: "MADD", address: 177, line: 1 }, { instruction: "END" }]);
    })

    test("Compile single label instruction", () => {
        var code = "test:";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "LABEL", label: "test", line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple label instructions", () => {
        var code = "test: BRANCH test BRZERO someLabel";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "LABEL", label: "test", line: 1 }, { instruction: "BRANCH", label: "test", line: 1 }, { instruction: "BRZERO", label: "someLabel", line: 1 }, { instruction: "END" }]);
    })

    test("Compile single value instruction", () => {
        var code = "MLOAD 150";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 150, line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple value instructions", () => {
        var code = "MLOAD 150 MLOAD -110";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 150, line: 1 }, { instruction: "MLOAD", value: -110, line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple various instructions", () => {
        var code = "MLOAD 5 loop: DSTORE @10 ACCDEC ISTORE @10 BRPOS loop";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 5, line: 1 }, { instruction: "LABEL", label: "loop", line: 1 }, { instruction: "DSTORE", address: 16, line: 1 }, { instruction: "ACCDEC", line: 1 }, { instruction: "ISTORE", address: 16, line: 1 }, { instruction: "BRPOS", label: "loop", line: 1 }, { instruction: "END" }]);
    })

    test("Compile multiple various instructions with line breaks", () => {
        var code = "MLOAD 5\nloop:\nDSTORE @10\nACCDEC\nISTORE @10\nBRPOS loop";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "MLOAD", value: 5, line: 1 }, { instruction: "LABEL", label: "loop", line: 2 }, { instruction: "DSTORE", address: 16, line: 3 }, { instruction: "ACCDEC", line: 4 }, { instruction: "ISTORE", address: 16, line: 5 }, { instruction: "BRPOS", label: "loop", line: 6 }, { instruction: "END" }]);
    })

    test("Compile code with comments", () => {
        var code = ";Test and test\nNOP ; test\nNOP\n; test NOP";
        var instructionList = [];

        startCompilation(code, instructionList);

        expect(instructionList).toEqual([{ instruction: "NOP", line: 2 }, { instruction: "NOP", line: 3 }, { instruction: "END" }]);
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
        var code = "NOP DSTORE @1gh NOP";
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
        var code = "NOP accinc: NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })

    test("Fail at instruction broken by comment", () => {
        var code = "NOP\n MLOAD ; 5\n NOP";
        var instructionList = [];

        expect(() => startCompilation(code, instructionList)).toThrow();
    })
})