// Cache block structure

export default class CacheBlock {
    constructor() {
        this.valid = true;
        this.tag = 0;
        this.data = 0;
        this.isEmpty = true;
    }

    update(valid, tag, data) {
        this.valid = valid;
        this.tag = tag;
        this.data = data;

        if (this.isEmpty) {
            this.isEmpty = false;
        }
    }
}
