import { isObject } from 'lodash';

export function nativeLog(...args) {
    if (isObject(args[0]) && !args[1] && (args[0].label || args[0].preview)) {
        wwLib.wwLog.log(args[0].label);
        wwLib.wwLog.log(args[0].preview);
    } else {
        wwLib.wwLog.log(...args);
    }
}

