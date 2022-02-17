let instance;

// Class used for comunication between components
class EventHub {
    compileProgram;
    getInstruction;
    getLabel;
    memWrite;
    memRead;

    constructor() {
        if (instance) {
            throw Error("You can only create one instance!");
        }
        instance = this;
    }

    getInstance() {
        return this;
    }
}

const eventHub = new EventHub();
export default eventHub;