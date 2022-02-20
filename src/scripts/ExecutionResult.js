// Class for storing static definitions of instruction execution result
// Basicaly an enum
// Source: https://www.sohamkamani.com/javascript/enums/
export default class ExecutionResult {
    static NextInstruction = new ExecutionResult("NextInstruction");
    static HaltExecution = new ExecutionResult("HaltExecution");
    static EndExecution = new ExecutionResult("EndExecution");
    static MoveToLabel = new ExecutionResult("MoveToLabel");
    static MoveToAddress = new ExecutionResult("MoveToAddress");

    constructor (name) {
        this.name = name
    }
}