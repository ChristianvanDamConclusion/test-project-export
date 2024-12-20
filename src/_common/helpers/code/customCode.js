import { isObject } from 'lodash';
import { computed } from 'vue';
import { _wwFormulas } from '@/_common/helpers/code/wwFormulas';

const ERROR_CODES = {
    UNEXPECTED_END_OF_FORMULA: "Unexpected token ';'",
};

export const _collections = computed(() => {
    const collections = wwLib.$store.getters['data/getCollections'];
    return Object.keys(collections).reduce((obj, key) => {
        const item = collections[key];
        obj[item.name] = item;
        obj[key] = item;
        return obj;
    }, {});
});

export const _formulas = computed(() =>
    Object.values(wwLib.$store.getters['data/getFormulas']).reduce((obj, item) => {
        obj[item.name] = obj[item.id] = (...args) => {
            // eslint-disable-next-line no-unused-vars
            const plugins = _plugins.value;
            // eslint-disable-next-line no-unused-vars
            const collections = _collections.value;
            // eslint-disable-next-line no-unused-vars
            const formulas = _formulas.value;
            // eslint-disable-next-line no-unused-vars
            const pluginFormulas = _pluginFormulas.value;
            // eslint-disable-next-line no-unused-vars
            const wwFormulas = _wwFormulas;
            // eslint-disable-next-line no-unused-vars
            const variables = wwLib.globalVariables.customCodeVariables;
            // eslint-disable-next-line no-unused-vars
            const pluginVariables = _pluginVariables.value;
            // eslint-disable-next-line no-unused-vars
            const context = wwLib.globalContext;

            return eval(
                `(function (${item.parameters.map(parameter => parameter.name).join(', ')}) {${
                    item.type === 'f' ? 'return ' : ''
                }${item.code}})(...args)`
            );
        };
        return obj;
    }, {})
);

export const _pluginFormulas = computed(() => {
    const plugins = _plugins.value;
    return Object.values(wwLib.$store.getters['data/getPluginFormulas']).reduce((obj, item) => {
        if (!obj[item.pluginId]) obj[item.pluginId] = {};
        const plugin = Object.values(plugins).find(plugin => plugin.id === item.pluginId);
        obj[item.pluginId][item.name] = (...args) => plugin[item.name].call(plugin, ...args);
        return obj;
    }, {});
});

export const _pluginVariables = computed(() =>
    Object.values(wwLib.$store.getters['data/getPluginVariables']).reduce((obj, item) => {
        if (!obj[item.pluginId]) obj[item.pluginId] = {};
        obj[item.pluginId][item.name] = item.value;
        return obj;
    }, {})
);

export const _plugins = computed(() => wwLib.wwPlugins);

// eslint-disable-next-line no-unused-vars
export function evaluateCode({ code, filter, sort }, context, event) {

    // eslint-disable-next-line no-unused-vars
    const plugins = _plugins.value;
    // eslint-disable-next-line no-unused-vars
    const collections = _collections.value;
    // eslint-disable-next-line no-unused-vars
    const formulas = _formulas.value;
    // eslint-disable-next-line no-unused-vars
    const pluginFormulas = _pluginFormulas.value;
    // eslint-disable-next-line no-unused-vars
    const wwFormulas = _wwFormulas;
    // eslint-disable-next-line no-unused-vars
    const variables = wwLib.globalVariables.customCodeVariables;
    // eslint-disable-next-line no-unused-vars
    const pluginVariables = _pluginVariables.value;

    context = { ...context, ...wwLib.globalContext };

    try {
        const rawValue = eval(`(function () {${code}\n})()`);
        return filterSortData(rawValue, filter, sort, context, event);
    } catch (error) {
        return { error };
    }
}

// eslint-disable-next-line no-unused-vars
export async function executeCode(code, context, event, wwUtils) {

    // eslint-disable-next-line no-unused-vars
    const plugins = _plugins.value;
    // eslint-disable-next-line no-unused-vars
    const collections = _collections.value;
    // eslint-disable-next-line no-unused-vars
    const formulas = _formulas.value;
    // eslint-disable-next-line no-unused-vars
    const pluginFormulas = _pluginFormulas.value;
    // eslint-disable-next-line no-unused-vars
    const wwFormulas = _wwFormulas;
    // eslint-disable-next-line no-unused-vars
    const variables = wwLib.globalVariables.customCodeVariables;
    // eslint-disable-next-line no-unused-vars
    const pluginVariables = _pluginVariables.value;

    context = { ...context, ...wwLib.globalContext };

    try {
        return await eval(`(async function () {${code}\n})()`);
    } catch (error) {
        wwLib.wwLog.error(error);
        throw error;
    }
}

// eslint-disable-next-line no-unused-vars
export function evaluateFormula({ code, filter, sort }, context, event) {

    // eslint-disable-next-line no-unused-vars
    const plugins = _plugins.value;
    // eslint-disable-next-line no-unused-vars
    const collections = _collections.value;
    // eslint-disable-next-line no-unused-vars
    const formulas = _formulas.value;
    // eslint-disable-next-line no-unused-vars
    const pluginFormulas = _pluginFormulas.value;
    // eslint-disable-next-line no-unused-vars
    const wwFormulas = _wwFormulas;
    // eslint-disable-next-line no-unused-vars
    const variables = wwLib.globalVariables.customCodeVariables;
    // eslint-disable-next-line no-unused-vars
    const pluginVariables = _pluginVariables.value;

    context = { ...context, ...wwLib.globalContext };

    try {
        const rawValue = eval(`(function () {return ${code}\n;})()`);
        return filterSortData(rawValue, filter, sort, context, event);
    } catch (error) {
        if (error.message) {
            let errorMessage = error.message;
            switch (error.message) {
                case ERROR_CODES.UNEXPECTED_END_OF_FORMULA:
                    errorMessage = 'Unexpected end of formula';
            }
            return { error: errorMessage };
        } else return { error };
    }
}

function filterSortData(rawValue, filter, sort, context, event) {
    let value = rawValue;
    if (Array.isArray(value)) {
        let data = [...value];
        if (filter) data = filterData(data, filter, context, event);
        if (sort) data = sortData(data, sort, context, event);
        return { value: data, rawValue };
    } else if (isObject(value) && Array.isArray(value.data) && value.type === 'collection') {
        let data = [...value.data];
        if (filter) data = filterData(data, filter, context, event);
        if (sort) data = sortData(data, sort, context, event);
        return { value: { ...value, data, total: data.length }, rawValue };
    }
    return { value, rawValue };
}

export function getJsValue({ code, filter, sort }, context, event) {
    const { value } = evaluateCode({ code, filter, sort }, context, event);
    return value;
}
export function getFormulaValue({ code, filter, sort }, context, event) {
    const { value } = evaluateFormula({ code, filter, sort }, context, event);
    return value;
}

export function sortData(data, sort, context, event) {
    if (!Array.isArray(data)) return data;
    const computedSort = getValue(sort, context, { event });
    data.sort((a, b) => {
        if (!a || !b) return 0;
        for (const elem of computedSort) {
            let result = 0;
            switch (typeof a[elem.key]) {
                case 'boolean':
                    result = a[elem.key] == b[elem.key] ? 0 : a[elem.key] ? 1 : -1;
                    break;
                case 'string':
                    result = a[elem.key].localeCompare(b[elem.key]);
                    break;
                case 'number':
                    result = a[elem.key] - b[elem.key];
                    break;
                case 'object':
                    result = JSON.stringify(a[elem.key]).localeCompare(JSON.stringify(b[elem.key]));
                    break;
            }
            if (elem.direction === 'DESC') result *= -1;
            if (result) return result;
        }
    });

    return data;
}

function filterDataElem(elem, filter) {
    if (!isObject(filter)) return true;
    if (filter.if === false) return null;
    if (!filter.conditions || !filter.conditions.length) return null;
    if (!elem) return false;

    const filteredConditions = filter.conditions.filter(
        condition => !(condition.isEmptyIgnored && wwLib.wwUtils.isEmpty(condition.value))
    );

    let result = null;
    for (const condition of filteredConditions) {
        let rCondition = null;
        if (condition.link) {
            rCondition = filterDataElem(elem, condition);
        } else {
            switch (condition.operator) {
                case '$eq':
                    rCondition = elem[condition.field] === condition.value;
                    break;
                case '$ne':
                    rCondition = elem[condition.field] !== condition.value;
                    break;
                case '$lt':
                    rCondition = elem[condition.field] < condition.value;
                    break;
                case '$gt':
                    rCondition = elem[condition.field] > condition.value;
                    break;
                case '$lte':
                    rCondition = elem[condition.field] <= condition.value;
                    break;
                case '$gte':
                    rCondition = elem[condition.field] >= condition.value;
                    break;
                case '$iLike:contains':
                    if (typeof elem[condition.field] !== 'string' && typeof condition.value === 'string') {
                        rCondition = JSON.stringify(elem[condition.field] || '')
                            .toLowerCase()
                            .includes(condition.value.toLowerCase());
                    } else if (typeof condition.value === 'string') {
                        rCondition = elem[condition.field].toLowerCase().includes(condition.value.toLowerCase());
                    } else {
                        rCondition = false;
                    }
                    break;
                case '$notILike:contains':
                    if (typeof elem[condition.field] !== 'string' && typeof condition.value === 'string') {
                        rCondition = !JSON.stringify(elem[condition.field] || '')
                            .toLowerCase()
                            .includes(condition.value.toLowerCase());
                    } else if (typeof condition.value === 'string') {
                        rCondition = !elem[condition.field].toLowerCase().includes(condition.value.toLowerCase());
                    } else {
                        rCondition = false;
                    }
                    break;
                case '$iLike:startsWith':
                    rCondition =
                        typeof elem[condition.field] === 'string' && typeof condition.value === 'string'
                            ? elem[condition.field].toLowerCase().startsWith(condition.value.toLowerCase())
                            : false;
                    break;
                case '$iLike:endsWith':
                    rCondition =
                        typeof elem[condition.field] === 'string' && typeof condition.value === 'string'
                            ? elem[condition.field].toLowerCase().endsWith(condition.value.toLowerCase())
                            : false;
                    break;
                case '$eq:null':
                    rCondition =
                        elem[condition.field] == null ||
                        elem[condition.field] === '' ||
                        (isObject(elem[condition.field]) && !Object.keys(elem[condition.field]).length) ||
                        (Array.isArray(elem[condition.field]) && !elem[condition.field].length);
                    break;
                case '$ne:null':
                    rCondition =
                        elem[condition.field] != null &&
                        elem[condition.field] !== '' &&
                        (!isObject(elem[condition.field]) || !!Object.keys(elem[condition.field]).length) &&
                        (!Array.isArray(elem[condition.field]) || !!elem[condition.field].length);
                    break;
                case '$in':
                    rCondition = Array.isArray(condition.value) && condition.value.includes(elem[condition.field]);
                    break;
                case '$notIn':
                    rCondition = Array.isArray(condition.value) && !condition.value.includes(elem[condition.field]);
                    break;
                case '$overlap':
                    rCondition =
                        Array.isArray(condition.value) &&
                        Array.isArray(elem[condition.field]) &&
                        condition.value.some(val => elem[condition.field].includes(val));
                    break;
                case '$notOverlap':
                    rCondition =
                        Array.isArray(condition.value) &&
                        Array.isArray(elem[condition.field]) &&
                        !condition.value.some(val => elem[condition.field].includes(val));
                    break;
                case '$contains':
                    rCondition =
                        Array.isArray(condition.value) &&
                        Array.isArray(elem[condition.field]) &&
                        condition.value.every(val => elem[condition.field].includes(val));
                    break;
                case '$has':
                    rCondition = elem[condition.field][condition.value] != null;
                    break;
                case '$hasNot':
                    rCondition = elem[condition.field][condition.value] == null;
                    break;
                case '$match':
                    rCondition =
                        stringToRegex(condition.value) && stringToRegex(condition.value).test(elem[condition.field]);
                    break;
                case '$notMatch':
                    rCondition =
                        stringToRegex(condition.value) && !stringToRegex(condition.value).test(elem[condition.field]);
                    break;
            }
        }

        if (rCondition === null) continue;
        else if (result === null) result = rCondition;
        else result = filter.link === '$or' ? result || rCondition : result && rCondition;
    }

    return result;
}

function stringToRegex(str) {
    if (!str) return;
    const main = str.match(/\/(.+)\/.*/) && str.match(/\/(.+)\/.*/)[1] ? str.match(/\/(.+)\/.*/)[1] : '';
    const options = str.match(/\/.+\/(.*)/) && str.match(/\/.+\/(.*)/)[1] ? str.match(/\/.+\/(.*)/)[1] : '';

    return new RegExp(main, options);
}

export function filterData(data, filter, context, event) {
    if (!Array.isArray(data)) return data;
    const computedFilter = getValue(filter, context, { event });
    return data.filter(elem => {
        const result = filterDataElem(elem, computedFilter);
        return result === null || result;
    });
}

export function getValue(rawValue, context, { event, recursive = true, defaultUndefined } = {}) {
    if (rawValue === undefined) return _.cloneDeep(defaultUndefined);
    if (!rawValue) return rawValue;

    let value;
    if (rawValue.__wwtype === 'f') {
        value = getFormulaValue(
            { code: rawValue.code, filter: rawValue.filter, sort: rawValue.sort },
            context || {},
            event
        );
    } else if (rawValue.__wwtype === 'js') {
        value = getJsValue({ code: rawValue.code, filter: rawValue.filter, sort: rawValue.sort }, context || {}, event);
    } else if (Array.isArray(rawValue) && recursive) {
        value = rawValue.map(raw => getValue(raw, context, { event }));
    } else if (typeof rawValue === 'object' && recursive) {
        value = {};
        Object.keys(rawValue).forEach(key => {
            value[key] = getValue(rawValue[key], context, { event });
        });
    } else {
        return rawValue;
    }

    return value;
}
