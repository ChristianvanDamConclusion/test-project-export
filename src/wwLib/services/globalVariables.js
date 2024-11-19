import { reactive } from 'vue';

export default {
    reset(name) {
        if (name === 'hasElementTriggeredNormalized') {
            this.hasElementTriggeredNormalized = {};
        }
    },
    _navigationId: 0,
    hasElementTriggeredNormalized: {},
    isElementNormalized: reactive({}),
    componentRawPropertyByMediaRefs: reactive(new Map()),
    componentRawPropertyRefs: reactive(new Map()),
    customCodeVariables: reactive({}),
};
