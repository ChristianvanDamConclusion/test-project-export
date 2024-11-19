import get from 'lodash.get';
import { unref, computed, watch, reactive, isRef, ref, inject, provide } from 'vue';

import { getComponentConfiguration } from '@/_common/helpers/component/component';
import { STYLE_CONFIGURATION, STATE_CONFIGURATION } from '@/_common/helpers/component/commonConfiguration';
import { eagerComputed } from '@/_common/helpers/reactivity';
import { getPath } from '@/_common/helpers/pathResolver';
import { getJsValue, getFormulaValue, getValue } from '@/_common/helpers/code/customCode';
import { executeWorkflow } from '@/_common/helpers/code/workflows';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DISCLAIMER: IN THIS FILE CODE IS USED TO BE VERY EFFICIENT RATHER THAN READEABLE AND REUSABLE BECAUSE OF NUMBER OF TIMES IT IS CALLED
// DO NOT TRY TO REFACTOR, WE CHOOSE TO DEFACTOR ON PURPOSE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const allScreenMedia = computed(() => {
    const screenSizes = wwLib.$store.getters['front/getScreenSizes'];
    return Object.keys(screenSizes).sort((key1, key2) => screenSizes[key1].order - screenSizes[key2].order);
});
const currentActiveScreen = computed(() => {
    const screenSize = wwLib.$store.getters['front/getScreenSize'];
    const screenOrder = wwLib.$store.getters['front/getScreenSizes'][screenSize].order;
    const screenSizes = wwLib.$store.getters['front/getScreenSizes'];
    return Object.keys(screenSizes)
        .sort((key1, key2) => screenSizes[key1].order - screenSizes[key2].order)
        .filter(screen => screenSizes[screen].order <= screenOrder);
});

function createComponentRawPropertyRef({
    id,
    prefixPath,
    suffixPath,
    component,
    isResponsive,
    isState,
    currentStates,
}) {
    if (!isResponsive && !isState) {
        return computed(() => get(component.value, `${prefixPath}.default.${suffixPath}`));
    }
    if (isResponsive && !isState) {
        return computed(() => {
            let result;
            const rawPropertyByMedia = wwLib.globalVariables.componentRawPropertyByMediaRefs.get(id) || {};
            for (const screen of currentActiveScreen.value) {
                const value = rawPropertyByMedia[screen];
                if (value !== undefined) {
                    result = value;
                }
            }
            return result;
        });
    }
    return computed(() => {
        let result;
        const rawPropertyByMedia = wwLib.globalVariables.componentRawPropertyByMediaRefs.get(id) || {};
        for (const screen of currentActiveScreen.value) {
            const value = rawPropertyByMedia[screen];
            if (value !== undefined) {
                result = value;
            }
        }

        for (const state of currentStates.value) {
            for (const screen of currentActiveScreen.value) {
                const value = rawPropertyByMedia[`${state}_${screen}`];
                if (value !== undefined) {
                    result = value;
                }
            }
        }

        return result;
    });
}

function createComponentRawPropertyByMedia({
    prefixPath,
    suffixPath,
    component,
    isResponsive,
    isState,
    availableStates,
}) {
    if (isResponsive && !isState) {
        const rawByMedia = {};
        for (const screen of allScreenMedia.value) {
            rawByMedia[screen] = computed(() => get(component.value, `${prefixPath}.${screen}.${suffixPath}`));
        }
        return reactive(rawByMedia);
    }
    if (!isResponsive && isState) {
        const rawByMedia = {};
        for (const state of availableStates.value) {
            rawByMedia[`${state}_default`] = computed(() =>
                get(component.value, `${prefixPath}.${state}_default.${suffixPath}`)
            );
        }
        rawByMedia['default'] = computed(() => get(component.value, `${prefixPath}.default.${suffixPath}`));
        return reactive(rawByMedia);
    }
    if (isResponsive && isState) {
        const rawByMedia = {};
        for (const screen of allScreenMedia.value) {
            for (const state of availableStates.value) {
                rawByMedia[`${state}_${screen}`] = computed(() =>
                    get(component.value, `${prefixPath}.${state}_${screen}.${suffixPath}`)
                );
            }
            rawByMedia[screen] = computed(() => get(component.value, `${prefixPath}.${screen}.${suffixPath}`));
        }
        return reactive(rawByMedia);
    }
}
function updateComponentRawPropertyByMedia({ id, prefixPath, suffixPath, component, isResponsive, isState, states }) {
    if (!isState) {
        return;
    }
    const rawByMedia = wwLib.globalVariables.componentRawPropertyByMediaRefs.get(id);
    if (!rawByMedia) return;
    if (!isResponsive && isState) {
        for (const state of states) {
            if (!rawByMedia[`${state}_default`]) {
                rawByMedia[`${state}_default`] = computed(() =>
                    get(component.value, `${prefixPath}.${state}_default.${suffixPath}`)
                );
            }
        }
    }
    if (isResponsive) {
        for (const screen of allScreenMedia.value) {
            for (const state of states) {
                if (!rawByMedia[`${state}_${screen}`]) {
                    rawByMedia[`${state}_${screen}`] = computed(() =>
                        get(component.value, `${prefixPath}.${state}_${screen}.${suffixPath}`)
                    );
                }
            }
            if (!rawByMedia[screen]) {
                rawByMedia[screen] = computed(() => get(component.value, `${prefixPath}.${screen}.${suffixPath}`));
            }
        }
    }
}

function createComponentPropertyRef({
    id,
    prefixPath,
    suffixPath,
    component,
    isState,
    isResponsive,
    context,
    currentStates,
    defaultUndefined,
    isContextRef,
}) {
    // WE CANNOT SHARE STATE IF IS_STATE BECAUSE EACH INSTANCE CAN BE IN A DIFFERENT STATES
    if (!isState) {
        const rawProperty = computed(() => {
            const { value } = wwLib.globalVariables.componentRawPropertyRefs.get(id) || {};
            return value;
        });
        const property = computed(() =>
            getValue(rawProperty.value, isContextRef ? context.value : context, { defaultUndefined })
        );
        return { rawProperty, property };
    } else {
        const rawProperty = createComponentRawPropertyRef({
            id,
            prefixPath,
            suffixPath,
            component,
            isResponsive,
            isState,
            currentStates,
        });
        const property = computed(() => {
            return getValue(rawProperty.value, isContextRef ? context.value : context, { defaultUndefined });
        });

        return { rawProperty, property };
    }
}
function createComponentSimplePropertyRef({ id, context, defaultUndefined }) {
    return eagerComputed(() => {
        const rawProperty = wwLib.globalVariables.componentRawPropertyRefs.get(id);
        return getValue(rawProperty && rawProperty.value, context, { defaultUndefined });
    });
}

// WE NEED TO DO IT IN A SEPARATE FUNCTION, BECAUSE VUE DESTROY REACTIVITY ON COMPUTED CREATED ON SETUP, WHICH IS **BAD** FOR US BECAUSE WE MUTUALIZE THEM ACROSS COMPONENT
function initPropertyReactivity({ component, prefixPath, suffixPath, id, isResponsive, isState, availableStates }) {
    if (isResponsive || isState) {
        wwLib.globalVariables.componentRawPropertyByMediaRefs.set(
            id,
            createComponentRawPropertyByMedia({
                prefixPath,
                suffixPath,
                component,
                isResponsive,
                isState,
                availableStates,
            })
        );
    }
    if (!isState) {
        wwLib.globalVariables.componentRawPropertyRefs.set(
            id,
            createComponentRawPropertyRef({
                id,
                prefixPath,
                suffixPath,
                component,
                isResponsive,
                isState,
            })
        );
    }
}
function initSimplePropertyReactivity({ id, path, component }) {
    wwLib.globalVariables.componentRawPropertyRefs.set(
        id,
        computed(() => get(component.value, path))
    );
}

export function useComponentData({ type, uid, currentStates, context }) {
    uid = unref(uid);
    type = unref(type);

    let content = {};
    let rawContent = {};
    let style = {};
    let state = {};

    const configuration = getComponentConfiguration(type, uid);

    const component = computed(() => {
        if (type === 'element') {
            return wwLib.$store.getters['websiteData/getWwObject'](uid);
        } else if (unref(type) === 'section') {
            return wwLib.$store.getters['websiteData/getSection'](uid);
        }
    });

    for (let property in configuration.properties) {
        if (!configuration.properties[property].editorOnly) {
            const { property: value, rawProperty } = createComponentPropertyRef({
                id: `${type}_${uid}_content.${property}`,
                prefixPath: 'content',
                suffixPath: property,
                component,
                isState: configuration.properties[property].states,
                isResponsive: configuration.properties[property].responsive,
                context,
                currentStates,
                defaultUndefined: configuration.properties[property].defaultUndefined,
            });
            content[property] = value;
            rawContent[property] = rawProperty;
        }
    }
    for (let property in STYLE_CONFIGURATION) {
        const { property: value } = createComponentPropertyRef({
            id: `${type}_${uid}__state.style.${property}`,
            component,
            prefixPath: '_state.style',
            suffixPath: property,
            isState: STYLE_CONFIGURATION[property].states,
            isResponsive: STYLE_CONFIGURATION[property].responsive,
            context,
            currentStates,
            defaultUndefined: STYLE_CONFIGURATION[property].defaultUndefined,
        });
        style[property] = value;
    }
    for (const property in STATE_CONFIGURATION) {
        if (property === 'interactions') {
            state.interactions = computed(() => component.value._state.interactions);
        } else {
            state[property] = createComponentSimplePropertyRef({
                id: `${type}_${uid}__state.${property}`,
                context,
                defaultUndefined: STATE_CONFIGURATION[property].defaultUndefined,
            });
        }
    }

    function setProperty(path, value, screen, state) {
        const configuration = getComponentPropertyConfiguration(type, uid, path);
        if (configuration.responsive) {
            screen = screen || wwLib.$store.getters['front/getScreenSize'];
        }
        let media = screen;
        if (configuration.states) {
            const currentState = state || wwLib.$store.getters['manager/getSidebarElementState'];
            if (currentState !== 'default' && currentState) {
                media = `${currentState}_${media}`;
            }
        }
        wwLib.$store.dispatch('websiteData/updateComponentProperty', {
            type,
            uid,
            path,
            value,
            media,
        });
    }

    content = reactive(content);
    rawContent = reactive(rawContent);

    provide('componentContent', content);
    provide('componentRawContent', rawContent);
    provide('setComponentProperty', setProperty);

    return {
        content,
        style: reactive(style),
        state: reactive(state),
        setProperty,
        rawContent,
        name: computed(() => component.value && component.value.name),
    };
}

export function initComponentData({ type, uid }) {
    uid = unref(uid);
    type = unref(type);

    // IF ALL PROPERTIES ARE ALREADY CREATED, WE SKIPPED
    // BECAUSE EVERYTHING IS DONE IN THE SAME TIME, WE USE A PROPS WE KNOW WILL BE SET BY EVERYBODY
    // THIS IS TO AVOID CREATING AN OTHER VARIABLE
    if (!wwLib.globalVariables.componentRawPropertyRefs.has(`${type}_${uid}__state.id`)) {
        const configuration = getComponentConfiguration(type, uid);
        const component = computed(() => {
            if (type === 'element') {
                return wwLib.$store.getters['websiteData/getWwObject'](uid);
            } else if (unref(type) === 'section') {
                return wwLib.$store.getters['websiteData/getSection'](uid);
            }
        });
        const availableStates = computed(() => {
            return wwLib.$store.getters['websiteData/getComponentAvailableStates']({ uid, type });
        });
        for (let property in configuration.properties) {
            if (!configuration.properties[property].editorOnly) {
                initPropertyReactivity({
                    id: `${type}_${uid}_content.${property}`,
                    prefixPath: 'content',
                    suffixPath: property,
                    isState: configuration.properties[property].states,
                    isResponsive: configuration.properties[property].responsive,
                    component,
                    availableStates,
                });
            }
        }
        for (let property in STYLE_CONFIGURATION) {
            initPropertyReactivity({
                id: `${type}_${uid}__state.style.${property}`,
                prefixPath: '_state.style',
                suffixPath: property,
                isState: STYLE_CONFIGURATION[property].states,
                isResponsive: STYLE_CONFIGURATION[property].responsive,
                component,
                availableStates,
            });
        }
        for (let property in STATE_CONFIGURATION) {
            if (property === 'interactions') continue;
            initSimplePropertyReactivity({
                id: `${type}_${uid}__state.${property}`,
                path: `_state.${property}`,
                component,
            });
        }

    }
}
export function useParentContentProperty(path) {
    const componentContent = inject('componentContent');
    const componentRawContent = inject('componentRawContent');
    const setProperty = inject('setComponentProperty');

    return {
        setProperty,
        property: computed(() => get(componentContent, path.value)),
        rawProperty: computed(() => get(componentRawContent, path.value)),
    };
}


function getComponentPropertyConfiguration(type, uid, path) {
    if (path.startsWith('content')) {
        const [property] = path.replace('content.', '').split('.');
        return (getComponentConfiguration(type, uid).properties || {})[property] || {};
    } else if (path.startsWith('_state.style')) {
        const [property] = path.replace('_state.style.', '').split('.');
        return STYLE_CONFIGURATION[property] || {};
    } else if (path.startsWith('_state')) {
        const [property] = path.replace('_state.', '').split('.');
        return STATE_CONFIGURATION[property] || {};
    } else {
        return {};
    }
}

export function useComponentWorkflow({ state, type }, context) {
    function executeWorkflows(name, event = {}) {
        const workflows = (state.interactions || []).filter(({ trigger }) => trigger === name);
        // Launch all workflows in parallel
        workflows.forEach(workflow => {
            executeWorkflow(workflow, { context, event });
        });
    }

    const listeners = computed(() => {
        const allActionEvents = [...new Set((state.interactions || []).map(({ trigger }) => trigger))];
        const allEvents = allActionEvents
            .filter((item, pos) => item && allActionEvents.indexOf(item) === pos)
            .filter(eventName => ['click', 'mouseenter', 'mouseleave'].includes(eventName));

        const listeners = {};

        for (const eventName of allEvents) {
            listeners[`on${eventName[0].toUpperCase()}${eventName.substr(1)}`] = event =>
                executeWorkflows(eventName, event);
        }

        return listeners;
    });

    return { executeWorkflows, listeners };
}
