import { config } from "@vue/test-utils";
config.global.config.globalProperties = {
    instructionWaitTime: { value: 0 },
    connectorFillTime: { value: 0 },
    connectorFadeTime: { value: 0 },
    highlightFadeTime: { value: 0 },
    cycleCounter: { value: 0 },
    cycleCosts: { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 },
    memorySize: { cache: 4, ram: 16 },
    colors: { secondaryColor: "#8b161c", secondaryColorLight: "#cc1717", fontColor: "#D6D6D6", infoColor: "#3f60bb" }
};
