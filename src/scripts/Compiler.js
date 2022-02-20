// Methods for compiling assembly code in code editor

import Instruction from "./Instruction";

let instructionNumber = 0;

// Starts compilation of `code`, resulting internal code is stored in `instructionList`
// Returns result object
export default function startCompilation(code, instructionList) {
    var codeList = code.split(/\s+/);
    instructionNumber = 0;

    // Compilation loop
    while (codeList.length > 0) {
        processInstruction(codeList, instructionList);
    }
    // Program end instruction
    instructionList.push({ instruction: "END" });
}

// Instruction switch
function processInstruction(codeList, instructionList) {
    var instruction = codeList.shift();
    instructionNumber++;

    switch (instruction.toUpperCase()) {
        case Instruction.HALT.name:
            processParameterlessInstruction(Instruction.HALT.name, instructionList);
            break;

        case Instruction.NEGATE.name:
            processParameterlessInstruction(Instruction.NEGATE.name, instructionList);
            break;

        case Instruction.ACCDEC.name:
            processParameterlessInstruction(Instruction.ACCDEC.name, instructionList);
            break;

        case Instruction.ACCINC.name:
            processParameterlessInstruction(Instruction.ACCINC.name, instructionList);
            break;

        case Instruction.NOP.name:
            processParameterlessInstruction(Instruction.NOP.name, instructionList);
            break;

        case Instruction.OUTP.name:
            processAddressInstrution(Instruction.OUTP.name, codeList.shift(), instructionList);
            break;

        case Instruction.INP.name:
            processAddressInstrution(Instruction.INP.name, codeList.shift(), instructionList);
            break;

        case Instruction.MLOAD.name:
            processValueInstruction(Instruction.MLOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.DLOAD.name:
            processAddressInstrution(Instruction.DLOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.ILOAD.name:
            processAddressInstrution(Instruction.ILOAD.name, codeList.shift(), instructionList);
            break;

        case Instruction.DSTORE.name:
            processAddressInstrution(Instruction.DSTORE.name, codeList.shift(), instructionList);
            break;

        case Instruction.ISTORE.name:
            processAddressInstrution(Instruction.ISTORE.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRANCH.name:
            processLabelInstruction(Instruction.BRANCH.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRZERO.name:
            processLabelInstruction(Instruction.BRZERO.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRPOS.name:
            processLabelInstruction(Instruction.BRPOS.name, codeList.shift(), instructionList);
            break;

        case Instruction.BRNEG.name:
            processLabelInstruction(Instruction.BRNEG.name, codeList.shift(), instructionList);
            break;

        case Instruction.MADD.name:
            processAddressInstrution(Instruction.MADD.name, codeList.shift(), instructionList);
            break;

        case Instruction.IJUMP.name:
            processAddressInstrution(Instruction.IJUMP.name, codeList.shift(), instructionList);
            break;

        case Instruction.LABEL.name:
            processLabelInstruction(Instruction.LABEL.name, codeList.shift(), instructionList);
            break;

        // Skip empty strings
        case "":
            break;

        default:
            console.log(instructionList);
            console.log(codeList);
            throw Error("Unknown instruction at " + instructionNumber);
    }
}

// Processes instruction with no parameters
// Returns result object
function processParameterlessInstruction(instruction, instructionList) {
    instructionList.push({ instruction: instruction });
}

// Processes instruction with address parameter
// Returns result object
function processAddressInstrution(instruction, parameter, instructionList) {
    // Check if address
    if (isAddress(parameter)) {
        parameter = parseInt(parameter.substring(1));
        instructionList.push({ instruction: instruction, address: parameter });
    }
    else
        throw Error("Incorrect parameter format at instruction " + instructionNumber + " (" + instruction + ")");
}

// Processes instruction with value parameter
// Returns result object
function processValueInstruction(instruction, parameter, instructionList) {
    // Check if value
    if (isNumber(parameter)) {
        parameter = parseInt(parameter);
        instructionList.push({ instruction: instruction, value: parameter });
    }
    else
        throw Error("Incorrect parameter format at instruction " + instructionNumber + " (" + instruction + ")");
}

// Processes instruction with label parameter
// Returns result object
function processLabelInstruction(instruction, parameter, instructionList) {
    // Check if not instruction keyword
    if (!isKeyword(parameter)) {
        instructionList.push({ instruction: instruction, label: parameter })
    }
    else
        throw Error("Label must not be keyword at instruction " + instructionNumber + " (" + instruction + ")");
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