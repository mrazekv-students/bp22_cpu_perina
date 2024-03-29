// Class implementing assembler processor

import Instruction from "./enums/Instruction.js";
import ExecutionResult from "./enums/ExecutionResult.js";

export default class Cpu {
    constructor(memory, acc, ap, regs, cacheStats) {
        this.memory = memory;
        this.acc = acc;
        this.ap = ap;
        this.regs = regs;
        this.cacheStats = cacheStats;
    }

    // Executes instruction
    // Return result object
    async execute(instruction) {
        var result;
        
        switch (instruction.instruction) {
            case Instruction.HALT.name:
                result = this._executeHalt();
                break;
    
            case Instruction.NEGATE.name:
                result = this._executeNegate();
                break;
    
            case Instruction.ACCDEC.name:
                result = this._executeAccdec();
                break;
    
            case Instruction.ACCINC.name:
                result = this._executeAccinc();
                break;
    
            case Instruction.NOP.name:
                result = this._executeNop();
                break;
    
            case Instruction.OUTP.name:
                result = this._executeOutp();
                break;
    
            case Instruction.INP.name:
                result = this._executeInp();
                break;
    
            case Instruction.MLOAD.name:
                result = this._executeMload(instruction.value);
                break;
    
            case Instruction.DLOAD.name:
                result = await this._executeDload(instruction.address);
                break;
    
            case Instruction.ILOAD.name:
                result = await this._executeIload(instruction.address);
                break;
    
            case Instruction.DSTORE.name:
                result = await this._executeDstore(instruction.address);
                break;
    
            case Instruction.ISTORE.name:
                result = await this._executeIstore(instruction.address);
                break;
    
            case Instruction.BRANCH.name:
                result = this._executeBranch(instruction.label);
                break;
    
            case Instruction.BRZERO.name:
                result = this._executeBrzero(instruction.label);
                break;
    
            case Instruction.BRPOS.name:
                result = this._executeBrpos(instruction.label);
                break;
    
            case Instruction.BRNEG.name:
                result = this._executeBrneg(instruction.label);
                break;
    
            case Instruction.MADD.name:
                result = await this._executeMadd(instruction.address);
                break;
    
            case Instruction.IJUMP.name:
                result = await this._executeIjump(instruction.address);
                break;
    
            case Instruction.LABEL.name:
                result = this._executeLabel();
                break;

            case Instruction.FLUSH.name:
                result = this._executeFlush();
                break;

            // Special program end instruction
            case "END":
                result = this._endExecution();
                break;
    
            default:
                throw Error(`Unknown instruction ${instruction.instruction}.`);
        }
    
        return result;
    }

    // Execute HALT instruction
    _executeHalt() {
        this.cacheStats.cycles += 1;
        return { result: ExecutionResult.HaltExecution };
    }

    // Execute NEGATE instruction
    _executeNegate() {
        this.cacheStats.cycles += 1;
        this.acc.value = -this.acc.value;
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ACCDEC instruction
    _executeAccdec() {
        this.cacheStats.cycles += 1;
        this.acc.value -= 1;
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }
    
    // Execute ACCINC instruction
    _executeAccinc() {
        this.cacheStats.cycles += 1;
        this.acc.value += 1;
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute NOP instruction
    _executeNop() {
        this.cacheStats.cycles += 1;
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute OUTP instruction - NOP
    _executeOutp() {
        this.cacheStats.cycles += 1;
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute INP instruction - ACC = Random(0 - 1023)
    _executeInp() {
        this.cacheStats.cycles += 1;
        this.acc.value = Math.floor(Math.random() * 1024);
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute MLOAD instruction
    _executeMload(value) {
        this.cacheStats.cycles += 1;
        this.acc.value = value;
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute DLOAD instruction
    async _executeDload(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();

        this.acc.value = await this.memory.read(address);
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ILOAD instruction
    async _executeIload(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();
        this.ap.value = await this.memory.read(address);
        this.regs.highlightAP();

        this.cacheStats.cycles += 1
        this.acc.value = await this.memory.read(this.ap.value);
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute DSTORE instruction
    async _executeDstore(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();

        await this.memory.write(address, this.acc.value);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ISTORE instruction
    async _executeIstore(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();
        this.ap.value = await this.memory.read(address);
        this.regs.highlightAP();

        this.cacheStats.cycles += 1;
        await this.memory.write(this.ap.value, this.acc.value);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRANCH instruction
    _executeBranch(label) {
        this.cacheStats.cycles += 1;
        return { result: ExecutionResult.MoveToLabel, label: label };
    }

    // Execute BRZERO instruction
    _executeBrzero(label) {
        this.cacheStats.cycles += 1;
        if (this.acc.value == 0) {
            this.cacheStats.cycles += 1;
            return { result: ExecutionResult.MoveToLabel, label: label };
        }
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRPOS instruction
    _executeBrpos(label) {
        this.cacheStats.cycles += 1;
        if (this.acc.value > 0) {
            this.cacheStats.cycles += 1;
            return { result: ExecutionResult.MoveToLabel, label: label };
        }
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRNEG instruction
    _executeBrneg(label) {
        this.cacheStats.cycles += 1;
        if (this.acc.value < 0) {
            this.cacheStats.cycles += 1;
            return { result: ExecutionResult.MoveToLabel, label: label };
        }
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute MADD instruction
    async _executeMadd(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();

        this.acc.value += await this.memory.read(address);
        this.regs.highlightACC();
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute IJUMP instruction
    async _executeIjump(address) {
        this.cacheStats.cycles += 1;
        this.ap.value = address;
        this.regs.highlightAP();
        
        var ip = await this.memory.read(address);
        return { result: ExecutionResult.MoveToAddress, address: ip };
    }

    // Execute LABEL instruction
    _executeLabel() {
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute FLUSH instruction
    _executeFlush() {
        this.cacheStats.cycles = 0;
        this.memory.flush();
        return { result: ExecutionResult.NextInstruction };
    }

    // End program execution
    _endExecution() {
        this.memory.flush();
        return { result: ExecutionResult.EndExecution };
    }
}