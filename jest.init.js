import { config } from "@vue/test-utils";
config.global.config.globalProperties = {
    instructionWaitTime: 0,
    connectorFillTime: 0,
    connectorFadeTime: 0,
    highlightFadeTime: 0,
    cycleCounter: { value: 0 },
    cycleCosts: { cacheCheck: 2, cacheAccess: 10, ramAccess: 200 }
};
