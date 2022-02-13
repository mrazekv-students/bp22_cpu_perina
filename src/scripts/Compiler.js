// Methods for compiling assembly code in code editor

import Instruction from "./Instruction";

const ERROR_UNKNOWN = 10;
const ERROR_NL = 11;
const ERROR_MISSING_PARAM = 12;
const ERROR_PARAM = 13;

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

// Instruction switch
function processInstruction(codeList, instructionList) {
    var result = { result: 0 };
    var instruction = codeList.pop();

    // Check if EOL
    var isNewLine = checkNewLine(instruction);
    if (isNewLine) instruction.slice(0, -1);

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
            result = processAddressInstrution(Instruction.OUTP.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.INP.name:
            result = processAddressInstrution(Instruction.INP.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.MLOAD.name:
            result = processValueInstruction(Instruction.MLOAD.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.DLOAD.name:
            result = processAddressInstrution(Instruction.DLOAD.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.ILOAD.name:
            result = processAddressInstrution(Instruction.ILOAD.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.DSTORE.name:
            result = processAddressInstrution(Instruction.DSTORE.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.ISTORE.name:
            result = processAddressInstrution(Instruction.ISTORE.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.BRANCH.name:
            result = processLabelInstruction(Instruction.BRANCH.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.BRZERO.name:
            result = processLabelInstruction(Instruction.BRZERO.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.BRPOS.name:
            result = processLabelInstruction(Instruction.BRPOS.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.BRNEG.name:
            result = processLabelInstruction(Instruction.BRNEG.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.MADD.name:
            result = processAddressInstrution(Instruction.MADD.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.IJUMP.name:
            result = processLabelInstruction(Instruction.IJUMP.name, isNewLine, codeList, instructionList);
            break;

        case Instruction.LABEL.name:
            result = processLabelInstruction(Instruction.LABEL.name, isNewLine, codeList, instructionList);
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

// Processes instruction with address parameter
// Returns result object
function processAddressInstrution(instruction, isNewLine, codeList, instructionList) {
    result = { result: 0 };

    if (!isNewLine) {
        parameter = codeList.pop();

        // Check if EOL
        if (checkNewLine(parameter)) {
            parameter = parameter.slice(0, -1);     // Remove '\n'

            // Check if address
            if (checkAddress(parameter)) {
                parameter = parseInt(parameter.substring(1));
                instructionList.push({ instruction: instruction, address: parameter });
            }
            else
                result = { result: ERROR_PARAM, message: "Incorrect parameter format"};
        }
        else 
            result = { result: ERROR_NL, message: "Parameter must end with new line" };
    }
    else
        result = { result: ERROR_MISSING_PARAM, message: "Missing parameter"};

    return result;
}

// Processes instruction with value parameter
// Returns result object
function processValueInstruction(instruction, isNewLine, codeList, instructionList) {
    result = { result: 0 };

    if (!isNewLine) {
        parameter = codeList.pop();

        // Check if EOL
        if (checkNewLine(parameter)) {
            parameter = parameter.slice(0, -1);     // Remove '\n'

            // Check if value
            if (isNumber(parameter)) {
                parameter = parseInt(parameter);
                instructionList.push({ instruction: instruction, value: parameter });
            }
            else
                result = { result: ERROR_PARAM, message: "Incorrect parameter format"};
        }
        else
            result = { result: ERROR_NL, message: "Parameter must end with new line" };
    }
    else
        result = { result: ERROR_MISSING_PARAM, message: "Missing parameter"};

    return result;
}

// Processes instruction with label parameter
// Returns result object
function processLabelInstruction(instruction, isNewLine, codeList, instructionList) {
    result = { result: 0 };

    if (!isNewLine) {
        parameter = codeList.pop();

        // Check if EOL
        if (checkNewLine(parameter)) {
            parameter = parameter.slice(0, -1);     // Remove '\n'
            instructionList.push({ instruction: instruction, label: parameter })
        }
        else
            result = { result: ERROR_NL, message: "Parameter must end with new line" };
    }
    else
        result = { result: ERROR_MISSING_PARAM, message: "Missing parameter"};
}

// Check if string ends with newLine
function checkNewLine(str) {
    return str.endsWith("\n");
}

// Checks if string is syntax valid address
function checkAddress(str) {
    var result = str.startsWith("@");
    if (result) {
        str = str.substring(1);
        result = isNumber(str);
    }
    return result
}

// Check is string is number
// Source: https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
function isNumber(str) {
    return /^\d+$/.test(str);
}