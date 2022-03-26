// Helper functions for memory

// TODO: REMOVE
// Return cache structure loaded with ram data
// Mostly for making the code look better
export function ReadRam(tag, data) {
    return { valid: true, tag: tag, data: data };
}

// Return ram address from cache address and tag
export function GetRamAddressFromCache(address, tag, offset) {
    return (tag << offset) | address;
}

// TODO: REMOVE
// Update cache content
export function UpdateCache(tag, data) {
    return { valid: false, tag: tag, data: data };
}

// Read from RAM to cache
export async function ReadFromRam(cacheBlock, tag, data, connector, config) {
    await connector.fromMemoryToCpu(config.connectorFillTime, config.connectorFadeTime);
    cacheBlock.update(true, tag, data);
}

// Write from cache to RAM
export async function WriteToRam(cacheBlock, ram, address, connector, config) {
    await connector.fromCpuToMemory(config.connectorFillTime, config.connectorFadeTime);
    ram[address] = cacheBlock.data;
}

// Read from cache
export async function ReadFromCache(cacheBlock, connector, config) {
    await connector.fromMemoryToCpu(config.connectorFillTime, config.connectorFadeTime);
    return cacheBlock.data;
}

// Write to cache
export async function WriteToCache(cacheBlock, tag, data, connector, config) {
    await connector.fromCpuToMemory(config.connectorFillTime, config.connectorFadeTime);
    cacheBlock.update(false, tag, data);
}
