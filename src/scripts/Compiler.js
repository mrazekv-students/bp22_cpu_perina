// Methods for compiling assembly code in code editor

import Instruction from "./Instruction";

const ERROR_UNKNOWN = 10;
const ERROR_NL = 11;

// Starts compilation of `code`, resulting internal code is stored in `instructionList`
// Returns result object
function startCompilation(code, instructionList) {
    var result = { result: 0 };
    var codeList = code.split(' ');

    // Compilation loop
    while (codeList.length > 0) {
        result = processInstruction(codeList, instructionList);
        if (result.result) break;
    }

    return result;
}

// 
function processInstruction(codeList, instructionList) {
    var result = { result: 0 };
    var instruction = codeList.pop();

    // Check if EOL
    var instObject = {inst: instruction};
    var isNewLine = checkNewLine(instObject);
    instruction = instObject.inst;

    switch (instruction.toUpperCase()) {
        case Instruction.HALT.name:
            result = processParameterlessInstruction(Instruction.HALT.name, isNewLine, instructionList);
            break;

        case Instruction.NEGATE.name:
            result = processParameterlessInstruction(Instruction.NEGATE.name, isNewLine, instructionList);
            break;

        case Instruction.ACCDEC.name:
            result = processParameterlessInstruction(Instruction.ACCDEC.name, isNewLine, instructionList);
            break;

        case Instruction.ACCINC.name:
            result = processParameterlessInstruction(Instruction.ACCINC.name, isNewLine, instructionList);
            break;

        case Instruction.NOP.name:
            result = processParameterlessInstruction(Instruction.NOP.name, isNewLine, instructionList);
            break;

        case Instruction.OUTP.name:
            // Address
            break;

        case Instruction.INP.name:
            // Address
            break;

        case Instruction.MLOAD.name:
            // Value
            break;

        case Instruction.DLOAD.name:
            // Address
            break;

        case Instruction.ILOAD.name:
            // Address
            break;

        case Instruction.DSTORE.name:
            // Address
            break;

        case Instruction.ISTORE.name:
            // Address
            break;

        case Instruction.BRANCH.name:
            // Label
            break;

        case Instruction.BRZERO.name:
            // Label
            break;

        case Instruction.BRPOS.name:
            // Label
            break;

        case Instruction.BRNEG.name:
            // Label
            break;

        case Instruction.MADD.name:
            // Address
            break;

        case Instruction.IJUMP.name:
            // Label
            break;

        case Instruction.LABEL.name:
            // Label
            break;

        default:
            result = { result: ERROR_UNKNOWN, message: "Unknown instruction" };
            break;
    }

    return result;
}

// Processes instruction with no parameters
// Returns result object
function processParameterlessInstruction(instruction, isNewLine, instructionList) {
    result = { result: 0 };

    if (isNewLine)
        instructionList.push({ instruction: instruction });
    else
        result = { result: ERROR_NL, message: "Instruction must end with new line" };

    return result;
}

// Check if string ends with newLine
// Removes newLine from string
function checkNewLine(str) {
    var result = str.inst.endsWith("\n");
    if (result) {
        str.inst = str.inst.slice(0, -1);
    }
    return result;
}