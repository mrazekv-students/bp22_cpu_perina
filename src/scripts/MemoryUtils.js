// Helper class for memory operations

export default class MemoryUtils {
    constructor(ram, cache, ramModel, cacheModel, connectorCpuCache, connectorCacheMem, config) {
        this.ram = ram;
        this.cache = cache;
        this.ramModel = ramModel;
        this.cacheModel = cacheModel;
        this.connectorCpuCache = connectorCpuCache;
        this.connectorCacheMem = connectorCacheMem;
        this.config = config;
    }

    // Return ram address from cache address and tag
    getRamAddressFromCache(tag, address, offset) {
        return (tag << offset) | address;
    }

    // Read from RAM to cache
    async readFromRam(cacheAddress, ramAddress, tag, path) {
        var cacheBlock = cacheAddress >> 2;
        var ramBlock = ramAddress >> 2;
        this.ramModel.highlight(ramAddress, this.config.highlightFadeTime.value);

        if (typeof path == "undefined") {
            await this.connectorCacheMem.fromMemoryToCpu(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.cache[cacheBlock].update(true, tag, this.ram[ramBlock]);
            this.cacheModel.highlight(cacheAddress, this.config.highlightFadeTime.value)
        }
        else {
            await this.connectorCacheMem[path].fromMemoryToCpu(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.cache[path][cacheBlock].update(true, tag, this.ram[ramBlock]);
            this.cacheModel[path].highlight(cacheAddress, this.config.highlightFadeTime.value)
        }

        this.config.cycleCounter.value += this.config.cycleCosts.ramAccess;
    }

    // Write from cache to RAM
    async writeToRam(cacheAddress, ramAddress, path) {
        var cacheBlock = cacheAddress >> 2;
        var ramBlock = ramAddress >> 2;

        if (typeof path == "undefined") {
            this.cacheModel.highlight(cacheAddress, this.config.highlightFadeTime.value);
            await this.connectorCacheMem.fromCpuToMemory(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.ram[ramBlock] = [...this.cache[cacheBlock].data];
        }
        else {
            this.cacheModel[path].highlight(cacheAddress, this.config.highlightFadeTime.value);
            await this.connectorCacheMem[path].fromCpuToMemory(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.ram[ramBlock] = [...this.cache[path][cacheBlock].data];
        }

        this.ramModel.highlight(ramAddress, this.config.highlightFadeTime.value);
        this.config.cycleCounter.value += this.config.cycleCosts.ramAccess;
    }

    // Read from cache
    async readFromCache(address, path) {
        var returnVal;
        var block = address >> 2;
        var offset = address & 0b11;

        if (typeof path == "undefined") {
            this.cacheModel.highlight(address, this.config.highlightFadeTime.value);
            await this.connectorCpuCache.fromMemoryToCpu(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            returnVal = this.cache[block].data[offset];    
        }
        else {
            this.cacheModel[path].highlight(address, this.config.highlightFadeTime.value);
            await this.connectorCpuCache[path].fromMemoryToCpu(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            returnVal = this.cache[path][block].data[offset];
        }

        this.config.cycleCounter.value += this.config.cycleCosts.cacheAccess;    
        return returnVal;
    }

    // Write to cache
    async writeToCache(address, tag, data, path) {
        var block = address >> 2;
        var offset = address & 0b11;

        if (typeof path == "undefined") {
            await this.connectorCpuCache.fromCpuToMemory(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.cache[block].update(false, tag, data, offset);
            this.cacheModel.highlight(address, this.config.highlightFadeTime.value);
        }
        else {
            await this.connectorCpuCache[path].fromCpuToMemory(this.config.connectorFillTime.value, this.config.connectorFadeTime.value);
            this.cache[path][block].update(false, tag, data, offset);
            this.cacheModel[path].highlight(address, this.config.highlightFadeTime.value);   
        }
        
        this.config.cycleCounter.value += this.config.cycleCosts.cacheAccess;
    }
}
