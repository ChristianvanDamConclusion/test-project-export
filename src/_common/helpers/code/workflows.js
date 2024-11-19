import { executeCode, getValue } from '@/_common/helpers/code/customCode';
import { detectInfinityLoop } from '@/_common/helpers/code/workflowsCallstack';
/* wwFront:start */
import { nativeLog } from '@/_common/helpers/code/workflowsLogger';
/* wwFront:end */

const metaActionTypes = ['loop', 'if', 'filter', 'switch'];
export async function executeWorkflow(workflow, { context = {}, event = {}, callstack = [], isError } = {}) {

    let error, result;
    if (!workflow) return {};
    callstack = [...callstack, workflow.id];

    if (detectInfinityLoop(callstack)) {
        wwLib.wwLog.warn(`Possible infinity loop detected! The workflow "${workflow.name}" was stopped.`);
        return {};
    }


    if (!isError) {
        ({ error, result } = await executeWorkflowActions(workflow, workflow.firstAction, {
            context,
            event,
            callstack,
            isError: false,
        }));
    }

    if (error) {
        await wwLib.$store.dispatch('data/setWorkflowError', {
            workflowId: workflow.id,
            actionId: 'error',
            value: convertErrorToObject(error),
        });
    }

    // Execute error workflow
    if (isError || error) {
        const { result: errorResult } = await executeWorkflowActions(workflow, workflow.firstErrorAction, {
            context,
            event,
            callstack,
            isError: true,
        });
        // Always return initial error, we ignore error from the error branch
        return { error, result: errorResult };
    }

    return { error, result };
}

export async function executeWorkflowActions(
    workflow,
    actionId,
    { context, event, callstack = [], isError, queue = [] }
) {
    try {
        if (!workflow || !actionId) return {};
        const action = workflow.actions[actionId];
        if (!action) return {};

        // Each action may change workflows info, so we refetch new data on each iteration
        let localContext = {
            ...context,
            workflow: wwLib.$store.getters['data/getWorkflowResults'](workflow.id),
        };

        const { result, stop } = await executeWorkflowAction(workflow, actionId, {
            context: localContext,
            event,
            callstack,
            isError,
            standalone: false,
        });

        if (stop) {
            return { result };
        }

        const branch = (action.branches || []).find(({ value }) => value === result);
        if (branch && branch.id) {
            return await executeWorkflowActions(workflow, branch.id, {
                context: localContext,
                event,
                callstack,
                isError,
                queue: action.next ? [action.next, ...queue] : queue,
            });
        } else if (action.next) {
            return await executeWorkflowActions(workflow, action.next, {
                context: localContext,
                event,
                callstack,
                isError,
                queue,
            });
        } else if (queue.length) {
            return await executeWorkflowActions(workflow, queue[0], {
                context: localContext,
                event,
                callstack,
                isError,
                queue: queue.slice(1),
            });
        } else {
            return { result };
        }
    } catch (error) {
        // Stop the actions if one failed (legacy behavior)
        return { error };
    }
}

export async function executeWorkflowAction(
    workflow,
    actionId,
    { context = {}, event = {}, callstack = [], isError, standalone = true }
) {
    let result, stop;
    if (!workflow || !actionId) return { result };

    if (!Object.keys(context).includes('workflow')) {
        context = { ...context, workflow: wwLib.$store.getters['data/getWorkflowResults'](workflow.id) };
    }

    const action = workflow.actions[actionId];
    if (!action) return { result };


    const wwUtils = {
        /* wwFront:start */
        log: nativeLog,
        /* wwFront:end */
    };

    try {
        switch (action.type) {
            case 'custom-js': {
                if (!action.code) throw new Error('No custom code defined.');
                result = await executeCode(action.code, context, event, wwUtils);
                break;
            }
            case 'variable': {
                if (!action.varId) throw new Error('No variable selected.');
                const variable = wwLib.$store.getters['data/getAllVariables'][action.varId];

                if (!variable) throw new Error('Variable not found.');
                const value = getValue(action.varValue, context, { event, recursive: false });
                const path = action.usePath ? getValue(action.path || '', context, { event, recursive: false }) : null;
                const index = getValue(action.index || 0, context, { event, recursive: false });

                wwLib.wwVariable.updateValue(action.varId, value, {
                    path,
                    index,
                    arrayUpdateType: action.arrayUpdateType,
                });
                break;
            }
            case 'reset-variables': {
                for (const varId of action.varsId || []) {
                    if (!varId) continue;
                    const variable = wwLib.$store.getters['data/getAllVariables'][varId];
                    if (!variable) throw new Error('Variable not found.');
                    wwLib.wwVariable.updateValue(
                        varId,
                        variable.defaultValue === undefined ? null : variable.defaultValue
                    );
                }
                break;
            }
            case 'fetch-collection': {
                if (!action.collectionId) throw new Error('No collection selected.');
                const collection = wwLib.$store.getters['data/getCollections'][action.collectionId];
                if (!collection) throw new Error('Collection not found.');
                await wwLib.wwCollection.fetchCollection(action.collectionId);
                if (collection.error) {
                    if (collection.error.message) throw new Error(collection.error.message);
                    else throw new Error('Error while fetching the collection');
                }
                break;
            }
            case 'fetch-collections': {
                if (!action.collectionsId.length) throw new Error('No collection selected.');
                const collections = wwLib.$store.getters['data/getCollections'];
                await Promise.all(
                    action.collectionsId
                        .filter(id => !!id)
                        .map(async collectionId => {
                            const collection = collections[collectionId];
                            if (!collection) throw new Error('Collection not found.');
                            await wwLib.wwCollection.fetchCollection(collectionId);
                            if (collection.error) {
                                if (collection.error.message) throw new Error(collection.error.message);
                                else throw new Error(`Error while fetching the collection ${collection.name}`);
                            }
                        })
                );
                break;
            }
            case 'change-page': {
                if (!action.pageId) throw new Error('No page selected.');
                let href;
                const value = getValue(action.pageId, context, { event });
                const pageId = typeof value === 'object' ? value.id : value;
                const page = wwLib.$store.getters['websiteData/getPageById'](pageId);
                if (!page) throw new Error('Page not found.');
                /* wwFront:start */
                href = wwLib.wwPageHelper.getPagePath(pageId);
                /* wwFront:end */
                let queries = {};
                if (action.queries && action.queries.length) {
                    queries = action.queries.reduce((queries, query) => {
                        queries[query.name] = getValue(query.value, context, { event });
                        return queries;
                    }, {});
                }

                const resolvedParameters = Object.keys(action.parameters || {}).reduce(
                    (result, param) => ({ ...result, [param]: getValue(action.parameters[param], context, { event }) }),
                    {}
                );
                const variables = wwLib.$store.getters['data/getPageParameterVariablesFromId'](pageId);

                /* wwFront:start */
                for (const variable of variables) {
                    href = href.replace(
                        `{{${variable.id}|${variable.defaultValue || ''}}}`,
                        resolvedParameters[variable.id]
                    );
                }
                /* wwFront:end */

                wwLib.goTo(href, queries, { openInNewTab: action.openInNewTab });
                break;
            }
            case 'upload-file': {
                if (!action.varId) throw new Error('No file variable selected.');

                const designId = wwLib.$store.getters['websiteData/getDesignInfo'].id;
                const fileVariable = wwLib.$store.getters['data/getComponentVariables'][action.varId];

                if (!fileVariable) throw new Error('File variable not found.');
                if (!fileVariable.value) throw new Error('No file selected.');

                const progressVariable =
                    wwLib.$store.getters['data/getComponentVariables'][`${fileVariable.componentUid}-progress`];
                const element = wwLib.$store.getters['websiteData/getWwObject'](fileVariable.componentUid) || {};
                const isMultiple = element.content.default.multiple;

                let progress = 0;
                result = [];

                const files = isMultiple ? fileVariable.value : [fileVariable.value];
                for (const file of files) {
                    const { data } = await axios.post(
                        `${wwLib.wwApiRequests._getApiUrl()}/designs/${designId}/user-files`,
                        {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            tag: `${getValue(action.fileTag, context, { event, recursive: false }) || ''}`,
                        }
                    );
                    await axios.put(data.signedRequest, file, {
                        headers: { Accept: '*/*', 'Content-Type': file.type },
                        skipAuthorization: true,
                        onUploadProgress: data => {
                            if (!progressVariable) return;
                            wwLib.$store.dispatch('data/setVariableValue', {
                                variableId: progressVariable.id,
                                value: progress + ((data.loaded / data.total) * 100) / files.length,
                            });
                        },
                    });
                    result.push({ url: data.url, name: data.name, ext: data.ext, tag: data.tag, size: data.size });
                    progress += 100 / files.length;
                }
                if (!isMultiple) result = result[0];
                break;
            }
            case 'execute-workflow': {
                if (!action.workflowId) throw new Error('No workflow selected.');
                const workflow = wwLib.$store.getters['data/getGlobalWorkflows'][action.workflowId];
                if (!workflow) throw new Error('Workflow not found.');
                const parameters = {};
                Object.keys(action.parameters || {}).forEach(paramName => {
                    parameters[paramName] = getValue(action.parameters[paramName], context, { event });
                });
                const execution = await executeWorkflow(workflow, {
                    context: {
                        ...context,
                        parameters,
                        workflow: wwLib.$store.getters['data/getWorkflowResults'](action.workflowId),
                    },
                    event,
                    callstack,
                });
                result = execution.result;
                if (execution.error) {
                    throw execution.error;
                }
                break;
            }
            case 'return': {
                result = getValue(action.value, context, { event });
                break;
            }
            case 'if': {
                result = !!getValue(action.value, context, { event });
                break;
            }
            case 'switch': {
                result = getValue(action.value, context, { event });
                break;
            }
            case 'filter': {
                result = !!getValue(action.value, context, { event });
                stop = !result;
                break;
            }
            case 'wait': {
                if (action.value === undefined) throw new Error('No time delay defined.');
                const delay = getValue(action.value, context, { event });
                await new Promise(resolve => setTimeout(resolve, delay));
                break;
            }
            case 'user-location': {
                if (!('geolocation' in navigator)) {
                    throw new Error('Geolocation is not available.');
                }

                try {
                    const response = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });

                    result = {
                        coords: {
                            accuracy: response.coords.accuracy,
                            altitude: response.coords.altitude,
                            altitudeAccurary: response.coords.altitudeAccurary,
                            heading: response.coords.heading,
                            latitude: response.coords.latitude,
                            longitude: response.coords.longitude,
                            speed: response.coords.speed,
                        },
                        timestamp: response.timestamp,
                    };
                } catch (error) {
                    throw new Error('Error while geolocation.');
                }

                break;
            }
            case 'loop': {
                let items = getValue(action.value, context, { event });
                if (!Array.isArray(items)) {
                    throw new Error('Fail to start loop, as items to parse is not iterable');
                } else {
                }
                for (const [index, item] of items.entries()) {
                    wwLib.$store.dispatch('data/setWorkflowActionLoop', {
                        workflowId: workflow.id,
                        actionId,
                        loop: {
                            index,
                            item,
                            items,
                        },
                    });
                    const { error: loopError, result: loopResult } = await executeWorkflowActions(
                        workflow,
                        action.loop,
                        {
                            isError,
                            context,
                            event,
                            callstack,
                        }
                    );
                    if (loopError) {
                        throw loopError;
                    }
                    result = loopResult;
                }
                break;
            }
            case 'change-lang': {
                if (!action.lang) throw new Error('No language selected.');
                const lang = getValue(action.lang, context, { event });


                const setLangSuccess = wwLib.wwLang.setLang(lang);
                if (!setLangSuccess) throw new Error(`Page does not contain the lang "${lang}"`);

                break;
            }
            default: {
                const actions = wwLib.$store.getters['data/getPluginActions'];
                const currentAction = actions[action.type];
                if (!currentAction) break;
                const plugin =
                    currentAction.pluginId && wwLib.$store.getters['websiteData/getPluginById'](currentAction.pluginId);
                const code =
                    (currentAction.isAsync ? 'return await ' : 'return ') +
                    (plugin ? `plugins['${plugin.name}']['${currentAction.code}']` : `actions['${currentAction.id}']`);
                const args = getValue(action.args || [], context, { event });
                result = await executeCode(`${code}(${JSON.stringify(args)}, wwUtils)`, context, event, wwUtils);
                break;
            }
        }

        wwLib.$store.dispatch('data/setWorkflowActionResult', {
            workflowId: workflow.id,
            actionId,
            result,
            error: null,
        });


    } catch (err) {
        const error = convertErrorToObject(err);
        wwLib.$store.dispatch('data/setWorkflowActionResult', {
            workflowId: workflow.id,
            actionId,
            error,
            result,
        });


        throw err;
    }

    return { result, stop };
}

function convertErrorToObject(err) {
    const keys = ['name', ...Object.getOwnPropertyNames(err)];
    let error = {};
    for (const key of keys) error[key] = err[key];
    return error;
}
