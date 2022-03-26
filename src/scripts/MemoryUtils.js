// Helper class for memory operations

export default class MemoryUtils {
    constructor(ram, cache, connectorCpuCache, connectorCacheMem, config) {
        this.ram = ram;
        this.cache = cache;
        this.connectorCpuCache = connectorCpuCache;
        this.connectorCacheMem = connectorCacheMem;
        this.config = config;
    }

    // Return ram address from cache address and tag
    getRamAddressFromCache(address, tag, offset) {
        return (tag << offset) | address;
    }

    // Read from RAM to cache
    async readFromRam(cacheAddress, ramAddress, tag, path) {
        if (typeof path == "undefined") {
            await this.connectorCacheMem.fromMemoryToCpu(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.cache[cacheAddress].update(true, tag, this.ram[ramAddress]);
        }
        else {
            await this.connectorCacheMem[path].fromMemoryToCpu(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.cache[path][cacheAddress].update(true, tag, this.ram[ramAddress]);
        }
    }

    // Write from cache to RAM
    async writeToRam(cacheAddress, ramAddress, path) {
        if (typeof path == "undefined") {
            await this.connectorCacheMem.fromCpuToMemory(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.ram[ramAddress] = this.cache[cacheAddress].data;
        }
        else {
            await this.connectorCacheMem[path].fromCpuToMemory(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.ram[ramAddress] = this.cache[path][cacheAddress].data;
        }
    }

    // Read from cache
    async readFromCache(cacheAddress, path) {
        if (typeof path == "undefined") {
            await this.connectorCpuCache.fromMemoryToCpu(this.config.connectorFillTime, this.config.connectorFadeTime);
            return this.cache[cacheAddress].data;    
        }
        else {
            await this.connectorCpuCache[path].fromMemoryToCpu(this.config.connectorFillTime, this.config.connectorFadeTime);
            return this.cache[path][cacheAddress].data;
        }
    }

    // Write to cache
    async writeToCache(cacheAddress, tag, data, path) {
        if (typeof path == "undefined") {
            await this.connectorCpuCache.fromCpuToMemory(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.cache[cacheAddress].update(false, tag, data);    
        }
        else {
            await this.connectorCpuCache[path].fromCpuToMemory(this.config.connectorFillTime, this.config.connectorFadeTime);
            this.cache[path][cacheAddress].update(false, tag, data);    
        }
    }
}
