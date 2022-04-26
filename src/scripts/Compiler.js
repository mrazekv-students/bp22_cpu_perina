// Methods for compiling assembly code in code editor

import Instruction from "./enums/Instruction";

let instructionLine = 1;

// Starts compilation of `code`, resulting internal code is stored in `instructionList`
export default function startCompilation(code, instructionList) {
    // Split into lines
    var codeLines = code.split('\n');
    instructionLine = 1;

    // Compilation loop
    while (codeLines.length > 0) {
        // Split into words
        var codeWords = codeLines.shift().split(/\s+/);
        while (codeWords.length > 0) {
            processInstruction(codeWords, instructionList);
        }
        instructionLine++;
    }

    // Program end instruction
    instructionList.push({ instruction: "END" });
}

// Instruction switch
function processInstruction(codeList, instructionList) {
    var instruction = codeList.shift();

    // Check if comment (starts with ';') - ignore rest of line
    if (instruction.startsWith(';')) {
        codeList.length = 0;
        return;
    }

    // Check if label (ends with ':')
    if (instruction.endsWith(':')) {
        processLabelInstruction(Instruction.LABEL.name, instruction.slice(0, -1), instructionList);
        return;
    }

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
            processParameterlessInstruction(Instruction.OUTP.name, instructionList);
            break;

        case Instruction.INP.name:
            processParameterlessInstruction(Instruction.INP.name, instructionList);
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

        // Skip empty strings
        case "":
            break;

        default:
            throw Error(`Unknown instruction at line ${instructionLine} (${instruction}).`);
    }
}

// Processes instruction with no parameters
// Returns result object
function processParameterlessInstruction(instruction, instructionList) {
    instructionList.push({ instruction: instruction, line: instructionLine });
}

// Processes instruction with address parameter
// Returns result object
function processAddressInstrution(instruction, parameter, instructionList) {
    // Check if address
    if (isAddress(parameter)) {
        parameter = parseInt(parameter.substring(1), 16);
        instructionList.push({ instruction: instruction, address: parameter, line: instructionLine });
    }
    else
        throw Error(`Invalid parameter at line ${instructionLine} (${instruction} ${parameter}).`);
}

// Processes instruction with value parameter
// Returns result object
function processValueInstruction(instruction, parameter, instructionList) {
    // Check if value
    if (isDecNumber(parameter)) {
        parameter = parseInt(parameter);
        instructionList.push({ instruction: instruction, value: parameter, line: instructionLine });
    }
    else
        throw Error(`Invalid parameter at line ${instructionLine} (${instruction} ${parameter}).`);
}

// Processes instruction with label parameter
// Returns result object
function processLabelInstruction(instruction, parameter, instructionList) {
    // Check if not instruction keyword
    if (!isKeyword(parameter)) {
        instructionList.push({ instruction: instruction, label: parameter, line: instructionLine })
    }
    else
        throw Error(`Invalid label at line ${instructionLine} (label ${parameter}). Label must not be keyword.`);
}

// Checks if string is syntax valid address
function isAddress(str) {
    var result = str.startsWith("@");
    if (result) {
        str = str.substring(1);
        result = isHexNumber(str);
    }
    return result
}

// Check if string is instruction keyword
function isKeyword(str) {
    var result = false;
    // Source: https://www.sohamkamani.com/javascript/enums/
    Object.keys(Instruction).forEach(instruction => {
        if (instruction === str.toUpperCase()) result = true;
    });
    return result;
}

// Check if string is decimal number
// Source: https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
function isDecNumber(str) {
    return /^-?\d+$/.test(str);
}

// Check if string is hexadecimal number
// Source: https://stackoverflow.com/questions/9221362/regular-expression-for-a-hexadecimal-number
function isHexNumber(str) {
    return /[0-9a-f]+$/i.test(str);
}
