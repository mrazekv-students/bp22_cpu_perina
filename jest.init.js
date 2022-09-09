import { config } from "@vue/test-utils";
import { VTooltip } from 'floating-vue';
  
config.global.config.globalProperties = {
    animations: { enable: true },
    times: { instructionWait: 0, connectorFill: 0, connectorFade: 0, highlightFade: 0 },
    cacheStats: { cycleCount: 0, memoryAccesses: 0, cacheHits: 0, cacheMisses: 0 },
    cycleCosts: { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 },
    memorySize: { cache: 4, ram: 16 },
    colors: { secondaryColor: "#8b161c", secondaryColorLight: "#cc1717", fontColor: "#D6D6D6", infoColor: "#3f60bb" }
};
config.global.directives = {
    "tooltip": VTooltip
};
