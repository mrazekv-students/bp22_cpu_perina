// Cache block structure

export default class CacheBlock {
    constructor() {
        this.valid = true;
        this.tag = 0;
        this.data = [0, 0, 0, 0];
        this.isEmpty = true;
    }

    update(valid, tag, data, offset) {
        this.valid = valid;
        this.tag = tag;

        if (typeof offset == "undefined") {
            this.data = [...data];
        }
        else {
            this.data[offset] = data;
        }

        if (this.isEmpty) {
            this.isEmpty = false;
        }
    }

    switchValid() {
        this.valid = !this.valid;
    }
}
