import { resetCollections, fetchNonStaticCollectionsData } from './collections';
import { executeWorkflows, resetWorkflows } from './workflows';
import { initializeCustomCodeVariables, resetVariables } from './variables';


let isFirstLoad = true;
const beforeUnload = () => {
    executeWorkflows('page-unload');
};

export async function initializeData(toRoute, forceReset = false) {
    wwLib.globalVariables._navigationId++;
    const resetPersistant = isFirstLoad || forceReset;
    isFirstLoad = false;

    /*=================================/
    / RESET & INIT                     /
    /=================================*/
    await wwLib.wwPluginHelper.initPlugins();

    resetCollections(resetPersistant);
    resetWorkflows();
    resetVariables(toRoute, resetPersistant);

    initializeCustomCodeVariables();

    /*=================================/
    / ONLOAD BEFORE FETCH              /
    /=================================*/
    if (resetPersistant) {
        await executeWorkflows('before-collection-fetch-app');
    }
    await executeWorkflows('before-collection-fetch');

    /*=================================/
    / FETCH COLLECTIONS                /
    /=================================*/
    await fetchNonStaticCollectionsData();

    /*=================================/
    / ONLOAD AFTER FETCH               /
    /=================================*/
    if (resetPersistant) {
        await executeWorkflows('onload-app');
    }
    await executeWorkflows('onload');

    /*=================================/
    / SETUP UNLOAD EVENT               /
    /=================================*/
    /* wwFront:start */
    //Remove listener before adding it to be sure it's called only once
    wwLib.getFrontWindow().removeEventListener('beforeunload', beforeUnload);
    wwLib.getFrontWindow().addEventListener('beforeunload', beforeUnload);
    /* wwFront:end */
}

export async function onPageUnload() {
    await executeWorkflows('page-unload');
}

