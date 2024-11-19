import { TEXT_CONFIGURATION } from './elementConfiguration';

export function getComponentName(type, uid, noLog = false) {
    const baseUid = _getComponentBaseUid(type, uid, noLog);
    return _getComponentName(type, baseUid);
}

function _getComponentName(type, baseUid) {
    if (!baseUid) return null;
    if (type === 'element') {
        return `wwobject-${baseUid}`;
    } else if (type === 'section') {
        return `section-${baseUid}`;
    }
    return null;
}

function _getComponentBaseUid(type, uid, noLog = false) {
    if (type === 'element') {
        const baseId = wwLib.$store.getters['websiteData/getWwObjectBaseId'](uid);
        if (!baseId) {
            if (!noLog) wwLib.wwLog.error(`Component base not found : ${type} / ${uid}`);
            return null;
        }
        return baseId;
    } else if (type === 'section') {
        const baseId = wwLib.$store.getters['websiteData/getSectionBaseId'](uid);
        if (!baseId) {
            if (!noLog) wwLib.wwLog.error(`Component base not found : ${type} / ${uid}`);
            return null;
        }
        return baseId;
    }
    return null;
}

function _getIcon(type, config) {
    const { icon, deprecated } = config.editor || {};
    if (deprecated) return 'warning';
    if (icon) return icon;
    if (type === 'element') {
        return 'component';
    } else if (type === 'section') {
        return 'section';
    } else {
        return 'options';
    }
}

export function getComponentIcon(type, uid) {
    const config = getComponentConfiguration(type, uid);
    return _getIcon(type, config);
}

export function getComponentBaseIcon(type, baseUid) {
    const config = getComponentBaseConfiguration(type, baseUid);
    return _getIcon(type, config);
}

function inheritFrom(configuration, from) {
    if (configuration.inherit === from) return true;
    if (configuration.inherit && configuration.inherit.type === from) {
        return configuration.inherit;
    }
    if (!Array.isArray(configuration.inherit)) return false;
    return configuration.inherit.find(el => el === from || (el && el.type === from));
}

function _getComponentConfiguration(name) {
    if (!name) return {};
    let configuration = wwLib.$store.getters['front/getComponentConfig'](name) || {};
    const inheritFromText = inheritFrom(configuration, 'ww-text');
    if (inheritFromText) {
        if (!Array.isArray(inheritFromText.exclude)) {
            configuration = {
                ...configuration,
                properties: { ...(configuration.properties || {}), ...TEXT_CONFIGURATION.properties },
            };
        } else {
            configuration = {
                ...configuration,
                properties: { ...(configuration.properties || {}) },
            };
            for (const [key, value] of Object.entries(TEXT_CONFIGURATION.properties)) {
                if (!inheritFromText.exclude.some(k => `_ww-text_${k}` === key)) {
                    configuration.properties[key] = value;
                }
            }
        }
    }

    return configuration;
}

export function getComponentConfiguration(type, uid, noLog = false) {
    const name = getComponentName(type, uid, noLog);
    return _getComponentConfiguration(name);
}

export function getComponentBaseConfiguration(type, baseUid) {
    const name = _getComponentName(type, baseUid);
    return _getComponentConfiguration(name);
}

function _getLabel(type, config) {
    if (!type) return '';
    const { label, deprecated } = config.editor || {};
    let returnLabel = '';
    if (type === 'element') {
        if (wwLib.wwManagerLang) {
            returnLabel = wwLib.wwManagerLang.getText(label) || 'Element';
        } else {
            returnLabel = label && label.en ? label.en : 'Element';
        }
    } else {
        if (wwLib.wwManagerLang) {
            returnLabel = wwLib.wwManagerLang.getText(label) || 'Section';
        } else {
            returnLabel = label && label.en ? label.en : 'Section';
        }
    }
    return `${returnLabel}${deprecated ? ' - Deprecated' : ''}`;
}

export function getComponentBaseLabel(type, baseUid) {
    const config = getComponentBaseConfiguration(type, baseUid);
    return _getLabel(type, config);
}

export function getComponentLabel(type, uid) {
    if (!type) return '';
    if (type === 'element') {
        const { name } = wwLib.$store.getters['websiteData/getWwObject'](uid) || {};
        if (name) return name;
    } else {
        const { sectionTitle } = wwLib.$store.getters['websiteData/getSection'](uid) || {};
        if (sectionTitle) return sectionTitle;
    }
    const config = getComponentConfiguration(type, uid);
    return _getLabel(type, config);
}

export function getElementDomElement(componentId) {
    return wwLib.getFrontDocument().querySelector(`[data-ww-component-id="${componentId}"]`);
}

export function isComponentDisplayed(displayValue) {
    const FALSY_VALUES = ['none', 'false', false, null, undefined];
    if (typeof displayValue === 'string') return !FALSY_VALUES.includes(displayValue.toLowerCase());
    return !FALSY_VALUES.includes(displayValue);
}

export function getComponentSize(size, defaultSize = 'unset') {
    if (!size || size === 'auto') return defaultSize;
    return size;
}
