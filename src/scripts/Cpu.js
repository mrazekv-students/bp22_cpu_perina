// Class implementing assembler processor

import Instruction from "./Instruction.js";
import ExecutionResult from "./ExecutionResult.js";

export default class Cpu {
    constructor(memory, acc) {
        this.memory = memory;
        this.acc = acc;
    }

    // Executes instruction
    // Return result object
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
                result = this._executeLabel();
                break;

            // Special program end instruction
            case "END":
                result = this._endExecution();
                break;
    
            default:
                throw Error("Unknown instruction");
        }
    
        return result;
    }

    // Execute HALT instruction
    _executeHalt() {
        return { result: ExecutionResult.HaltExecution };
    }

    // Execute NEGATE instruction
    _executeNegate() {
        this.acc.value = -this.acc.value;
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ACCDEC instruction
    _executeAccdec() {
        this.acc.value -= 1;
        return { result: ExecutionResult.NextInstruction };
    }
    
    // Execute ACCINC instruction
    _executeAccinc() {
        this.acc.value += 1;
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute NOP instruction
    _executeNop() {
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute OUTP instruction
    _executeOutp() {
        // TODO
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute INP instruction
    _executeInp() {
        // TODO
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute MLOAD instruction
    _executeMload(value) {
        this.acc.value = value;
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute DLOAD instruction
    _executeDload(address) {
        this.acc.value = this.memory.read(address);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ILOAD instruction
    _executeIload(address) {
        var valueAddress = this.memory.read(address);
        this.acc.value = this.memory.read(valueAddress);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute DSTORE instruction
    _executeDstore(address) {
        this.memory.write(address, this.acc.value);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute ISTORE instruction
    _executeIstore(address) {
        var valueAddress = this.memory.read(address);
        this.memory.write(valueAddress, this.acc.value);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRANCH instruction
    _executeBranch(label) {
        return { result: ExecutionResult.MoveToLabel, label: label };
    }

    // Execute BRZERO instruction
    _executeBrzero(label) {
        if (this.acc.value == 0)
            return { result: ExecutionResult.MoveToLabel, label: label };
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRPOS instruction
    _executeBrpos(label) {
        if (this.acc.value > 0)
            return { result: ExecutionResult.MoveToLabel, label: label };
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute BRNEG instruction
    _executeBrneg(label) {
        if (this.acc.value < 0)
            return { result: ExecutionResult.MoveToLabel, label: label };
        else
            return { result: ExecutionResult.NextInstruction };
    }

    // Execute MADD instruction
    _executeMadd(address) {
        this.acc.value += this.memory.read(address);
        return { result: ExecutionResult.NextInstruction };
    }

    // Execute IJUMP instruction
    _executeIjump(address) {
        var ip = this.memory.read(address);
        return { result: ExecutionResult.MoveToAddress, address: ip };
    }

    // Execute LABEL instruction
    _executeLabel() {
        return { result: ExecutionResult.NextInstruction };
    }

    // End program execution
    _endExecution() {
        return { result: ExecutionResult.EndExecution };
    }
}