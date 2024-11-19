
import { getPath } from '@/_common/helpers/pathResolver';

export default {
    /*=============================================m_ÔÔ_m=============================================\
        DESIGN
    \================================================================================================*/
    setFullDesign(state, designInfo) {
        state.design.info = { ...designInfo, pages: undefined, plugins: undefined };

        for (let page of designInfo.pages) {
            state.design.pages.push(page);
        }
    },
    updateDesignInfo(state, designInfo) {
        state.design.info = designInfo;
    },


    /*=============================================m_ÔÔ_m=============================================\
        PAGE
    \================================================================================================*/
    setPageData(state, data) {
        state.sections = { ...state.sections, ...data.sections };
        state.wwObjects = { ...state.wwObjects, ...data.wwObjects };

        for (const page of state.design.pages) {
            if (page && page.id === data.page.id) {
                for (const key of Object.keys(data.page)) {
                    page[key] = data.page[key];
                }
                page.sections = Object.values(data.sections).map(section => ({
                    ...((page.sections || []).find(pageSection => pageSection.uid === section.uid) || {}),
                    ...section,
                }));
                page.pageLoaded = true;
                state.pageId = data.page.id;
            } else {
                if (page) {
                    page.pageLoaded = false;
                }
            }
        }

        //wwLib.wwLog.info(state)
    },
    setPageId(state, id) {
        state.pageId = id;
    },

    /*=============================================m_ÔÔ_m=============================================\
        PLUGINS
    \================================================================================================*/
    addPlugin(state, plugin) {
        const pluginIndexFound = state.plugins.findIndex(elem => elem.name === plugin.name);
        if (pluginIndexFound !== -1) {
            const pluginFound = state.plugins[pluginIndexFound];
            const pluginMerge = pluginFound.isDev ? { ...pluginFound, ...plugin } : { ...plugin, ...pluginFound };
            state.plugins.splice(pluginIndexFound, 1, pluginMerge);
        } else {
            state.plugins.push({
                ...plugin,
                isLoaded: false,
                isDev: false,
            });
        }
    },
    updatePlugin(state, { pluginId, settings, isDev, isLoaded }) {
        const plugin = state.plugins.find(plugin => plugin.name === pluginId || plugin.id === pluginId);
        if (!plugin) return;
        if (settings) plugin.settings = settings;
        if (typeof isDev === 'boolean') plugin.isDev = isDev;
        if (typeof isLoaded === 'boolean') plugin.isLoaded = isLoaded;
    },

    updateComponentProperty(state, { type, uid, path, value, media }) {
        let component;
        if (type === 'element') {
            component = state.wwObjects[uid];
        } else if (type === 'section') {
            component = state.sections[uid];
        }
        path = getPath(path, media);
        set(component, path, value);
    },
    deleteComponentState(state, { type, uid, state: elementState }) {
        const component = type === 'element' ? state.wwObjects[uid] : state.sections[uid];
        set(
            component,
            '_state.states',
            get(component, '_state.states', []).filter(s => s.id !== elementState)
        );
        Object.keys(component._state.style || {}).forEach(key => {
            if (key.startsWith(`${elementState}_`)) {
                delete component._state.style[key];
            }
        });
        Object.keys(component.content || {}).forEach(key => {
            if (key.startsWith(`${elementState}_`)) {
                delete component.content[key];
            }
        });
    },
};
