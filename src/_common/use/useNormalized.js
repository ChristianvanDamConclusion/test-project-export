import { unref, computed } from 'vue';

export function setNormalized(type, uid) {
    wwLib.globalVariables.isElementNormalized[`${unref(type)}_${unref(uid)}`] = true;
}
export function getHasTriggeredNormalized(type, uid) {
    return wwLib.globalVariables.hasElementTriggeredNormalized[`${unref(type)}_${unref(uid)}`];
}
export function setHasTriggeredNormalized(type, uid, value) {
    wwLib.globalVariables.hasElementTriggeredNormalized[`${unref(type)}_${unref(uid)}`] = value;
}

export function useNormalized(type, uid) {
    return computed(() => wwLib.globalVariables.isElementNormalized[`${unref(type)}_${unref(uid)}`]);
}
