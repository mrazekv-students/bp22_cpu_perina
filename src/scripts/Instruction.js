// Class for storing static definitions of instructions
// Basicaly an enum
// Source: https://www.sohamkamani.com/javascript/enums/
export default class Instruction {
    static HALT = new Instruction("HALT");
    static NEGATE = new Instruction("NEGATE");
    static ACCDEC = new Instruction("ACCDEC");
    static ACCINC = new Instruction("ACCINC");
    static NOP = new Instruction("NOP");
    static OUTP = new Instruction("OUTP");
    static INP = new Instruction("INP");
    static MLOAD = new Instruction("MLOAD");
    static DLOAD = new Instruction("DLOAD");
    static ILOAD = new Instruction("ILOAD");
    static DSTORE = new Instruction("DSTORE");
    static ISTORE = new Instruction("ISTORE");
    static BRANCH = new Instruction("BRANCH");
    static BRZERO = new Instruction("BRZERO");
    static BRPOS = new Instruction("BRPOS");
    static BRNEG = new Instruction("BRNEG");
    static MADD = new Instruction("MADD");
    static IJUMP = new Instruction("IJUMP");
    static LABEL = new Instruction("LABEL");

    constructor (name) {
        this.name = name
    }
}