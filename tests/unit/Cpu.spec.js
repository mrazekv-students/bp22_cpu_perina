// Test for CPU
import { config, mount } from '@vue/test-utils';
import Cpu from '@/scripts/Cpu.js';
import ExecutionResult from '@/scripts/enums/ExecutionResult';
import RamOnlyMemory from '@/components/memory/RamOnlyMemory.vue';

describe("Cpu instruction tests", () => {
    test("Execute no instructions", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.EndExecution });
    })

    test("Execute HALT instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "HALT" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.HaltExecution });
    })

    test("Execute NEGATE instruction", async () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "NEGATE" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(-10);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ACCDEC instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ACCDEC" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(-1);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ACCINC instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ACCINC" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(1);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute NOP instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "NOP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute OUTP instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "OUTP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute INP instruction", async () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "INP" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toBeGreaterThanOrEqual(0);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute MLOAD instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "MLOAD", value: 10 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(10);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute DLOAD instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(8, 100);
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ILOAD instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "ILOAD", address: 4 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(4, 8);
        await memory.write(8, 100);
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute DSTORE instruction", async () => {
        // Prepare
        var acc = { value: 100 };
        var instructionList = [{ instruction: "DSTORE", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        var result = await cpu.execute(instructionList.shift());
        var val = await memory.read(8);

        // Assert
        expect(val).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute ISTORE instruction", async () => {
        // Prepare
        var acc = { value: 100 };
        var instructionList = [{ instruction: "ISTORE", address: 4 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(4, 8);
        var result = await cpu.execute(instructionList.shift());
        var val = await memory.read(8);

        // Assert
        expect(val).toEqual(100);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute BRANCH instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRANCH", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRZERO instruction, acc == 0", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRZERO instruction, acc == 1", async () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute BRZERO instruction, acc == -1", async () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRZERO", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRPOS instruction, acc > 0", async () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRPOS instruction, acc == 0", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRPOS instruction, acc < 0", async () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRPOS", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRNEG instruction, acc < 0", async () => {
        // Prepare
        var acc = { value: -1 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.MoveToLabel, label: "test" });
    })

    test("Execute BRNEG instruction, acc == 0", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute BRNEG instruction, acc > 0", async () => {
        // Prepare
        var acc = { value: 1 };
        var instructionList = [{ instruction: "BRNEG", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction});
    })

    test("Execute MADD instruction, positive number", async () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "MADD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(8, 10);
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(20);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute MADD instruction, negative number", async () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "MADD", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(8, -5);
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(acc.value).toEqual(5);
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })

    test("Execute IJUMP instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "IJUMP", address: 8 }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute
        await memory.write(8, 10);
        var result = await cpu.execute(instructionList.shift());

        // Assert
        expect(result).toEqual({ result: ExecutionResult.MoveToAddress, address: 10 });
    })

    test("Execute LABEL instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "LABEL", label: "test" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        var result = await cpu.execute(instructionList.shift());
        expect(result).toEqual({ result: ExecutionResult.NextInstruction });
    })
});

describe("CPU instruction error tests", () => {
    test("Fail at unknown instruction", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "FAIL" }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        await expect(cpu.execute(instructionList.shift())).rejects.toThrow();
    })

    test("Fail at invalid memory read, negative address", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: -2 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        await expect(cpu.execute(instructionList.shift())).rejects.toThrow();
    })

    test("Fail at invalid memory read, address out-of-bounds", async () => {
        // Prepare
        var acc = { value: 0 };
        var instructionList = [{ instruction: "DLOAD", address: 32 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        await expect(cpu.execute(instructionList.shift())).rejects.toThrow();
    })

    test("Fail at invalid memory write, negative address", async () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "DSTORE", address: -2 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        await expect(cpu.execute(instructionList.shift())).rejects.toThrow();
    })

    test("Fail at invalid memory write, address out-of-bounds", async () => {
        // Prepare
        var acc = { value: 10 };
        var instructionList = [{ instruction: "DSTORE", address: 32 }, { instruction: "END" }];

        const wrapper = mount(RamOnlyMemory);
        var memory = wrapper.emitted().RegisterMemory[0][0];
        var cpu = new Cpu(memory, acc, config.global.config.globalProperties.cycleCounter);

        // Execute & assert
        await expect(cpu.execute(instructionList.shift())).rejects.toThrow();
    })
})