// Test for CPU
import { mount  } from '@vue/test-utils'
import Cpu from '@/scripts/Cpu.js'
import ExecutionResult from '@/scripts/enums/ExecutionResult'
import RamOnlyMemory from '@/components/memory/RamOnlyMemory.vue'

// TODO: Fix tests, ram only memory awaits break tests

describe("Cpu instruction tests", () => {
    test("Execute no instructions", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.EndExecution });
    })

    test("Execute HALT instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "HALT" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.HaltExecution });
    })

    test("Execute NEGATE instruction", () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "NEGATE" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(-10);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ACCDEC instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ACCDEC" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(-1);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ACCINC instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ACCINC" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(1);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute NOP instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "NOP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute OUTP instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "OUTP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute INP instruction", () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "INP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toBeGreaterThanOrEqual(0);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute MLOAD instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "MLOAD", value: 10 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(10);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute DLOAD instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(8, 100);
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ILOAD instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ILOAD", address: 4 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(4, 8);
        memory.write(8, 100);
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute DSTORE instruction", () => {
        // Prepare
        var acc = { value: 100 };
        var instructionList = [{ instruction: "DSTORE", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        var result = cpu.execute(instructionList.shift());
        var val = memory.read(8);

        // Assert
        expect(val).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ISTORE instruction", () => {
        // Prepare
        var acc = { value: 100 };
        var instructionList = [{ instruction: "ISTORE", address: 4 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(4, 8);
        var result = cpu.execute(instructionList.shift());
        var val = memory.read(8);

        // Assert
        expect(val).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute BRANCH instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRANCH", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRZERO instruction, acc == 0", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRZERO instruction, acc == 1", () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute BRZERO instruction, acc == -1", () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRPOS instruction, acc > 0", () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRPOS instruction, acc == 0", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRPOS instruction, acc < 0", () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRNEG instruction, acc < 0", () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRNEG instruction, acc == 0", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRNEG instruction, acc > 0", () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute MADD instruction, positive number", () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "MADD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(8, 10);
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(20);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute MADD instruction, negative number", () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "MADD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(8, -5);
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(5);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute IJUMP instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "IJUMP", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute
        memory.write(8, 10);
        var result = cpu.execute(instructionList.shift());

        // Assert
        expect(result).toEqual({ result: ExecutionResult.MoveToAddress, address: 10 });
    })

    test("Execute LABEL instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "LABEL", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(cpu.execute(instructionList.shift())).toEqual({ result: ExecutionResult.NextInstruction });
    })
});

describe("CPU instruction error tests", () => {
    test("Fail at unknown instruction", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "FAIL" }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(() => cpu.execute(instructionList.shift())).toThrow();
    })

    test("Fail at invalid memory read, negative address", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: -2 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(() => cpu.execute(instructionList.shift())).toThrow();
    })

    test("Fail at invalid memory read, address out-of-bounds", () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: 32 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(() => cpu.execute(instructionList.shift())).toThrow();
    })

    test("Fail at invalid memory write, negative address", () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "DSTORE", address: -2 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(() => cpu.execute(instructionList.shift())).toThrow();
    })

    test("Fail at invalid memory write, address out-of-bounds", () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "DSTORE", address: 32 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc);

        // Execute & assert
        expect(() => cpu.execute(instructionList.shift())).toThrow();
    })
})