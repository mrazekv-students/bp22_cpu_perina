// Methods for compiling assembly code in code editor

import Instruction from "./Instruction";

const ERROR_UNKNOWN = 10;
const ERROR_PARAM = 11;

var instructionNumber = 0;

// Starts compilation of `code`, resulting internal code is stored in `instructionList`
// Returns result object
export default function startCompilation(code, instructionList) {
    var result = { result: 0 };
    var codeList = code.split(/\s+/);
    instructionNumber = 0;

    // Compilation loop
    while (codeList.length > 0) {
        result = processInstruction(codeList, instructionList);
        if (result.result) break;
    }

    return result;
}

// Instruction switch
function processInstruction(codeList, instructionList) {
    var result = { result: 0 };
    var instruction = codeList.shift();
    instructionNumber++;

    switch (instruction.toUpperCase()) {
        case Instruction.HALT.name:
            result = processParameterlessInstruction(Instruction.HALT.name, instructionList);
            break;

        case Instruction.NEGATE.name:
            result = processParameterlessInstruction(Instruction.NEGATE.name, instructionList);
            break;

        case Instruction.ACCDEC.name:
            result = processParameterlessInstruction(Instruction.ACCDEC.name, instructionList);
            break;

        case Instruction.ACCINC.name:
            result = processParameterlessInstruction(Instruction.ACCINC.name, instructionList);
            break;

        case Instruction.NOP.name:
            result = processParameterlessInstruction(Instruction.NOP.name, instructionList);
            break;

        case Instruction.OUTP.name:
            result = processAddressInstrution(Instruction.OUTP.name, codeList.shift(), instructionList);
            break;

        case Instruction.INP.name:
            result = processAddressInstrution(Instruction.INP.name, codeList.shift(), instructionList);
            break;

        case Instruction.MLOAD.name:
            result = processValueInstruction(Instruction.MLOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.DLOAD.name:
            result = processAddressInstrution(Instruction.DLOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.ILOAD.name:
            result = processAddressInstrution(Instruction.ILOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.DSTORE.name:
            result = processAddressInstrution(Instruction.DSTORE.name, codeList.shift(), instructionList);
            break;

        case Instruction.ISTORE.name:
            result = processAddressInstrution(Instruction.ISTORE.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRANCH.name:
            result = processLabelInstruction(Instruction.BRANCH.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRZERO.name:
            result = processLabelInstruction(Instruction.BRZERO.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRPOS.name:
            result = processLabelInstruction(Instruction.BRPOS.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRNEG.name:
            result = processLabelInstruction(Instruction.BRNEG.name, codeList.shift(), instructionList);
            break;

        case Instruction.MADD.name:
            result = processAddressInstrution(Instruction.MADD.name, codeList.shift(), instructionList);
            break;

        case Instruction.IJUMP.name:
            result = processLabelInstruction(Instruction.IJUMP.name, codeList.shift(), instructionList);
            break;

        case Instruction.LABEL.name:
            result = processLabelInstruction(Instruction.LABEL.name, codeList.shift(), instructionList);
            break;

        default:
            result = { result: ERROR_UNKNOWN, instructionNumber: instructionNumber, message: "Unknown instruction" };
            break;
    }

    return result;
}

// Processes instruction with no parameters
// Returns result object
function processParameterlessInstruction(instruction, instructionList) {
    instructionList.push({ instruction: instruction });
    return { result: 0 };
}

// Processes instruction with address parameter
// Returns result object
function processAddressInstrution(instruction, parameter, instructionList) {
    var result = { result: 0 };

    // Check if address
    if (isAddress(parameter)) {
        parameter = parseInt(parameter.substring(1));
        instructionList.push({ instruction: instruction, address: parameter });
    }
    else
        result = { result: ERROR_PARAM, instructionNumber: instructionNumber, message: "Incorrect parameter format"};

    return result;
}

// Processes instruction with value parameter
// Returns result object
function processValueInstruction(instruction, parameter, instructionList) {
    var result = { result: 0 };

    // Check if value
    if (isNumber(parameter)) {
        parameter = parseInt(parameter);
        instructionList.push({ instruction: instruction, value: parameter });
    }
    else
        result = { result: ERROR_PARAM, instructionNumber: instructionNumber, message: "Incorrect parameter format" };

    return result;
}

// Processes instruction with label parameter
// Returns result object
function processLabelInstruction(instruction, parameter, instructionList) {
    var result = { result: 0 };

    // Check if not instruction keyword
    if (!isKeyword(parameter)) {
        instructionList.push({ instruction: instruction, label: parameter })
    }
    else
        result = { result: ERROR_PARAM, instructionNumber: instructionNumber, message: "Parameter must not be keyword" };
    
    return result;
}

// Checks if string is syntax valid address
function isAddress(str) {
    var result = str.startsWith("@");
    if (result) {
        str = str.substring(1);
        result = isNumber(str);
    }
    return result
}

// Check if string is instruction keyword
function isKeyword(str) {
    var result = false;
    Object.keys(Instruction).forEach(instruction => {
        if (instruction === str.toUpperCase()) result = true;
    });
    return result;
}

// Check is string is number
// Source: https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
function isNumber(str) {
    return /^\d+$/.test(str);
}