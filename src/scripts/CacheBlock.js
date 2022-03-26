// Cache block structure

export default class CacheBlock {
    constructor() {
        this.valid = true;
        this.tag = 0;
        this.data = 0;
    }

    update(valid, tag, data) {
        this.valid = valid;
        this.tag = tag;
        this.data = data;
    }
}
