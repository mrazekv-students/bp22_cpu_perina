// Class implementing assembler processor

import Instruction from "./Instruction";

export default class Cpu {
    constructor(memory, acc) {
        this.memory = memory;
        this.acc = acc;
    }

    execute(instruction) {
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
                result = true;
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
                result = true;
                break;
    
            default:
                throw Error("Unknown instruction");
        }
    
        return result;
    }

    // Execute HALT instruction
    // Returns nextInstruction = false (stop)
    _executeHalt() {
        return false;
    }

    // Execute NEGATE instruction
    // Returns nextInstruction = true (next instruction)
    _executeNegate() {
        this.acc.value = -this.acc.value;
        return true;
    }

    // Execute ACCDEC instruction
    _executeAccdec() {
        this.acc.value -= 1;
        return true;
    }
    
    // Execute ACCINC instruction
    _executeAccinc() {
        this.acc.value += 1;
        return true;
    }

    // Execute OUTP instruction
    _executeOutp() {
        // TODO
        return true;
    }

    // Execute INP instruction
    _executeInp() {
        // TODO
        return true;
    }

    // Execute MLOAD instruction
    _executeMload(value) {
        this.acc.value = value;
        return true;
    }

    // Execute DLOAD instruction
    _executeDload(address) {
        this.acc.value = this.memory.read(address);
        return true;
    }

    // Execute ILOAD instruction
    _executeIload(address) {
        var valueAddress = this.memory.read(address);
        this.acc.value = this.memory.read(valueAddress);
        return true;
    }

    // Execute DSTORE instruction
    _executeDstore(address) {
        this.memory.write(this.acc.value, address);
        return true;
    }

    // Execute ISTORE instruction
    _executeIstore(address) {
        var valueAddress = this.memory.read(address);
        this.memory.write(this.acc.value, valueAddress);
        return true;
    }

    // Execute BRANCH instruction
    _executeBranch(label) {
        return label;
    }

    // Execute BRZERO instruction
    _executeBrzero(label) {
        if (this.acc.value == 0)
            return label;
        else
            return true;
    }

    // Execute BRPOS instruction
    _executeBrpos(label) {
        if (this.acc.value > 0)
            return label;
        else
            return true;
    }

    // Execute BRNEG instruction
    _executeBrneg(label) {
        if (this.acc.value < 0)
            return label;
        else
            return true;
    }

    // Execute MADD instruction
    _executeMadd(address) {
        this.acc.value += this.memory.read(address);
        return true;
    }

    // Execute IJUMP instruction
    _executeIjump(address) {
        var ip = this.memory.read(address);
        return ip;
    }
}