import { ref, readonly as setReadonly, computed, inject, unref } from 'vue';

export default {
    getValue(variableId) {
        const variables = wwLib.$store.getters['data/getAllVariables'];

        const variable = variables[variableId];

        if (!variable) {
            wwLib.wwLog.error(`Variable ${variableId} not found`);
            return null;
        }

        return variable.value;
    },
    updateValue(variableId, value, { path, index, arrayUpdateType } = {}) {
        const variables = wwLib.$store.getters['data/getAllVariables'];
        const variable = variables[variableId];

        try {
            if (!variable) {
                throw new Error('variable not found');
            }

            if (value === undefined) {
                return;
            }

            switch (variable.type) {
                case 'boolean':
                    if (value === 'true') value = true;
                    if (value === 'false') value = false;
                    if (typeof value !== 'boolean') throw new Error('value must be a boolean');
                    break;
                case 'query':
                case 'string':
                    if (value !== null && typeof value === 'object')
                        throw new Error('value must be a string, a number or a boolean');
                    if (value !== null) value = `${value}`;
                    break;
                case 'number':
                    if (typeof value === 'string') {
                        try {
                            value = parseFloat(value);
                            if (isNaN(value)) value = null;
                        } catch (error) {
                            value = null;
                        }
                    }
                    if (value !== null && typeof value !== 'number') throw new Error('value must be a number');
                    break;
                case 'array':
                    if (value !== null && !Array.isArray(value) && !arrayUpdateType)
                        throw new Error('value must be an array');
                    break;
                case 'object':
                    if (value !== null && typeof value !== 'object' && !path)
                        throw new Error('value must be an object');
                    break;
            }
            wwLib.$store.dispatch('data/setVariableValue', {
                variableId,
                value,
                path,
                index,
                arrayUpdateType,
            });
            return value;
        } catch (error) {
            wwLib.wwLog.error(
                `Unable to update variable ${
                    variable ? `${variable.name} of type ${variable.type}` : ''
                } (${variableId}) : ${error.message} - got : `
            );
            wwLib.wwLog.error(value);
        }
    },
    registerComponentVariable({
        uid,
        name,
        defaultValue,
        componentType,
        type,
        readonly,
        resettable,
        sectionId,
        labelOnly,
    }) {
        const id = `${uid}-${name}`;
        wwLib.$store.dispatch('data/setComponentVariable', {
            componentUid: uid,
            id,
            name,
            value: unref(defaultValue),
            defaultValue,
            componentType,
            type,
            readonly,
            resettable,
            sectionId,
            labelOnly,
        });

        return id;
    },
    useComponentVariable({
        uid,
        name,
        defaultValue,
        componentType = 'element',
        type = 'any',
        readonly = false,
        resettable = false,
        onUpdate = () => {},
        labelOnly = null,
    }) {
        if (!uid) {
            wwLib.wwLog.error(`Missing uid for creating component variable ${name}`);
            return;
        }
        const variableId = ref(null);
        const bindingContext = inject('bindingContext', null);
        const isInsideRepeat = computed(() => bindingContext !== null);
        const sectionId = inject('sectionId');

        if (!isInsideRepeat.value) {
            variableId.value = wwLib.wwVariable.registerComponentVariable({
                uid,
                name,
                defaultValue,
                componentType,
                type,
                readonly,
                resettable,
                sectionId,
                labelOnly,
            });
        }

        const wwElementState = inject('wwElementState');
        const propValue = computed(() => wwElementState.props[name]);
        const hasPropValue = computed(() => Object.keys(wwElementState.props).includes(name));

        const internalValue = ref(
            isInsideRepeat.value ? unref(defaultValue) : wwLib.wwVariable.getValue(variableId.value)
        );
        const currentValue = computed(() => {
            if (hasPropValue.value) {
                return propValue.value;
            }
            return isInsideRepeat.value ? internalValue.value : wwLib.wwVariable.getValue(variableId.value);
        });

        const triggerElementEvent = inject('triggerElementEvent');
        function setValue(value) {
            const oldValue = _.cloneDeep(currentValue.value);
            if (hasPropValue.value) {
                triggerElementEvent({ type: `update:${name}`, value });
                return;
            }
            if (!isInsideRepeat.value) {
                const newValue = wwLib.wwVariable.updateValue(variableId.value, value);
                if (newValue !== oldValue) onUpdate(newValue, oldValue);
            }
            internalValue.value = value;
        }

        return {
            value: setReadonly(currentValue),
            internalValue: setReadonly(internalValue),
            setValue,
        };
    },
};
