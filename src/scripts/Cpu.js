// Class implementing assembler processor

import Instruction from "./Instruction";

const ERROR_UNKNOWN = 20;

export default class Cpu {
    constructor(memory, acc) {
        this.memory = memory;
        this.acc = acc;
    }

    execute(instruction) {
        var result = { result: 0, nextInstruction: true };

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
                result = { result: 0, nextInstruction: true };
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
                result = this._executeDload(instruction.address);
                break;
    
            case Instruction.ILOAD.name:
                result = this._executeIload(instruction.address);
                break;
    
            case Instruction.DSTORE.name:
                result = this._executeDstore(instruction.address);
                break;
    
            case Instruction.ISTORE.name:
                result = this._executeIstore(instruction.address);
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
                result = this._executeMadd(instruction.address);
                break;
    
            case Instruction.IJUMP.name:
                result = this._executeIjump(instruction.address);
                break;
    
            case Instruction.LABEL.name:
                result = { result: 0, nextInstruction: true };
                break;
    
            default:
                result = { result: ERROR_UNKNOWN, message: "Unknown instruction" };
                break;
        }
    
        return result;
    }

    // Execute HALT instruction
    // Returns result object with nextInstruction = false (stop)
    _executeHalt() {
        return { result: 0, nextInstruction: false };
    }

    // Execute NEGATE instruction
    // Returns result object with nextInstruction = true (next instruction)
    _executeNegate() {
        this.acc.value = -this.acc.value;
        return { result: 0, nextInstruction: true };
    }

    // Execute ACCDEC instruction
    _executeAccdec() {
        this.acc.value -= 1;
        return { result: 0, nextInstruction: true };
    }
    
    // Execute ACCINC instruction
    _executeAccinc() {
        this.acc.value += 1;
        return { result: 0, nextInstruction: true };
    }

    // Execute OUTP instruction
    _executeOutp() {
        // TODO
        return { result: 0, nextInstruction: true };
    }

    // Execute INP instruction
    _executeInp() {
        // TODO
        return { result: 0, nextInstruction: true };
    }

    // Execute MLOAD instruction
    _executeMload(value) {
        this.acc.value = value;
        return { result: 0, nextInstruction: true };
    }

    // Execute DLOAD instruction
    _executeDload(address) {
        this.acc.value = this.memory.load(address);
        return { result: 0, nextInstruction: true };
    }

    // Execute ILOAD instruction
    _executeIload(address) {
        var valueAddress = this.memory.load(address);
        this.acc.value = this.memory.load(valueAddress);
        return { result: 0, nextInstruction: true };
    }

    // Execute DSTORE instruction
    _executeDstore(address) {
        this.memory.store(this.acc.value, address);
        return { result: 0, nextInstruction: true };
    }

    // Execute ISTORE instruction
    _executeIstore(address) {
        var valueAddress = this.memory.load(address);
        this.memory.store(this.acc.value, valueAddress);
        return { result: 0, nextInstruction: true };
    }

    // Execute BRANCH instruction
    _executeBranch(label) {
        return { result: 0, nextInstruction: label };
    }

    // Execute BRZERO instruction
    _executeBrzero(label) {
        if (this.acc.value == 0)
            return { result: 0, nextInstruction: label };
        else
            return { result: 0, nextInstruction: true };
    }

    // Execute BRPOS instruction
    _executeBrpos(label) {
        if (this.acc.value > 0)
            return { result: 0, nextInstruction: label };
        else
            return { result: 0, nextInstruction: true };
    }

    // Execute BRNEG instruction
    _executeBrneg(label) {
        if (this.acc.value < 0)
            return { result: 0, nextInstruction: label };
        else
            return { result: 0, nextInstruction: true };
    }

    // Execute MADD instruction
    _executeMadd(address) {
        this.acc.value += this.memory.load(address);
        return { result: 0, nextInstruction: true };
    }

    // Execute IJUMP instruction
    _executeIjump(address) {
        var ip = this.memory.label(address);
        return { result: 0, nextInstruction: ip };
    }
}