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

// 
function processInstruction(codeList, instructionList) {
    var result = { result: 0 };
    var instruction = codeList.pop();

    // Check if EOL
    var instObject = {str: instruction};
    var isNewLine = checkNewLine(instObject);
    instruction = instObject.str;

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

// Processes instruction with address parameter
// Returns result object
function processAddressInstrution(instruction, isNewLine, codeList, instructionList) {
    result = { result: 0 };

    if (!isNewLine) {
        parameter = codeList.pop();

        // Check if EOL
        var paramObject = {str: parameter};
        isNewLine = checkNewLine(paramObject);

        if (isNewLine) {
            // Check if address
            var isAddress = checkAddress(paramObject);

            if (isAddress) {
                parameter = parseInt(paramObject.str);
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

// Check if string ends with newLine
// Removes newLine from string
function checkNewLine(obj) {
    var result = obj.str.endsWith("\n");
    if (result) {
        obj.str = obj.str.slice(0, -1);
    }
    return result;
}

// Checks if string is syntax valid address
// Removes '@' char from the beginning
function checkAddress(obj) {
    var result = obj.str.startsWith("@");
    if (result) {
        obj.str = obj.str.substring(1);

        result = isNumber(obj.str);
    }
    return result
}

// Check is string is number
// Source: https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
function isNumber(str) {
    return /^\d+$/.test(str);
}