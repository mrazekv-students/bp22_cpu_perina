// Helper functions for memory

// Return cache structure loaded with ram data
// Mostly for making the code look better
export function ReadRam(tag, data) {
    return { valid: true, tag: tag, data: data };
}

// Return ram address from cache address and tag
export function GetRamAddressFromCache(address, tag, offset) {
    return (tag << offset) | address;
}

// Update cache content
export function UpdateCache(tag, data) {
    return { valid: false, tag: tag, data: data };
}