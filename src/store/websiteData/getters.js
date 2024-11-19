import utils from './utils';
import get from 'lodash.get';

export default {
    /*=============================================m_ÔÔ_m=============================================\
        DESIGN
    \================================================================================================*/
    getDesign(state) {
        if (!state.design) {
            return null;
        }

        return state.design;
    },
    getDesignInfo(state) {
        if (!state.design || !state.design.info) {
            return {};
        }

        return state.design.info;
    },


    /*=============================================m_ÔÔ_m=============================================\
        PAGES
    \================================================================================================*/
    getPages(state) {
        // eslint-disable-next-line no-unreachable
        return state.design.pages;
    },
    getPage(state) {
        return utils.getPage(state);
    },
    getPageById: state => id => state.design.pages.find(page => page.id === id),
    getPageByLinkId: state => linkId => state.design.pages.find(page => page.linkId === linkId || page.id === linkId),
    getFullPage(state) {
        return utils.getFullPage(state);
    },
    getPageId(state) {
        return state.pageId;
    },

    /*=============================================m_ÔÔ_m=============================================\
        WWOBJECTS
    \================================================================================================*/
    getWwObject: state => id => state.wwObjects[id],
    getWwObjectState: state => id => {
        const { _state } = state.wwObjects[id] || {};
        return _state || {};
    },
    getComponentAvailableStates:
        state =>
        ({ type, uid }) => {
            let _state;
            if (type === 'element') {
                _state = (state.wwObjects[uid] && state.wwObjects[uid]._state) || {};
            } else {
                _state = (state.sections[uid] && state.sections[uid]._state) || {};
            }
            return (_state.states || []).map(state => state.id);
        },
    getComponentRawStates:
        state =>
        ({ type, uid }) => {
            let _state;
            if (type === 'element') {
                _state = (state.wwObjects[uid] && state.wwObjects[uid]._state) || {};
            } else {
                _state = (state.sections[uid] && state.sections[uid]._state) || {};
            }
            return _state.states || [];
        },
    getWwObjectContent: state => id => {
        const { content } = state.wwObjects[id] || {};
        return content || {};
    },
    getWwObjectCms: state => id => {
        const { cms } = state.wwObjects[id] || {};
        return cms || {};
    },
    getWwObjectType: state => id => {
        if (!state.wwObjects[id]) {
            return null;
        }
        const { name } = state.wwObjects[id].wwObjectBase || {};
        return name || state.wwObjects[id].type; // TODO remove
    },
    getWwObjectBaseId: state => id => {
        if (!state.wwObjects[id]) return null;
        return state.wwObjects[id].wwObjectBaseId;
    },
    getWwObjectStyle: state => id => {
        const { _state = {} } = state.wwObjects[id] || {};
        return _state.style || {};
    },
    getFullWwObject:
        state =>
        (uid, asTemplate = false) => {
            return utils.parseFullObject(state, { uid, isWwObject: true }, asTemplate);
        },
    getWwObjects(state) {
        return state.wwObjects;
    },
    /*=============================================m_ÔÔ_m=============================================\
      SECTIONS
    \================================================================================================*/
    getSection(state) {
        return function (sectionId) {
            if (state.sections[sectionId]) {
                return state.sections[sectionId];
            }
            return null;
        };
    },
    getSectionState: state => id => {
        const { _state } = state.sections[id] || {};
        return _state || {};
    },
    getSectionAvailableStates: state => id => {
        return get(state, `sections.['${id}']._state.states`, []);
    },
    getSectionContent: state => id => {
        const { content } = state.sections[id] || {};
        return content || {};
    },
    getSectionType: state => id => {
        if (!state.sections[id]) {
            return null;
        }
        const sectionBase = state.sections[id].sectionBase;
        if (!sectionBase) return null;

        const { name } = sectionBase;
        return name;
    },
    getSectionBaseId: state => id => {
        if (!state.sections[id]) return null;
        return state.sections[id].sectionBaseId;
    },

    getSectionStyle: state => id => {
        const { _state = {} } = state.sections[id] || {};
        return _state.style || {};
    },
    getFullSection(state) {
        return function (sectionId) {
            if (state.sections[sectionId]) {
                let section = _.cloneDeep(state.sections[sectionId]);
                return utils.parseFullObject(state, section);
            }
            return null;
        };
    },
    getSections: state => state.sections,
    getIsSectionLinked: state => sectionId =>
        state.design.pages
            .map(page => page.sections || [])
            .flat()
            .filter(section => section.uid === sectionId).length > 1,
    /*=============================================m_ÔÔ_m=============================================\
        PLUGINS
    \================================================================================================*/
    getPlugins: state => state.plugins,
    getPluginsByCategory: state => category =>
        state.plugins.filter(
            plugin => !category || (plugin.pluginCategory && plugin.pluginCategory.name === category)
        ) || [],
    getDataPlugins: (_, getters) => getters.getPluginsByCategory('data'),
    getAuthPlugins: (_, getters) => getters.getPluginsByCategory('auth'),
    getSettingsPlugins: (_, getters) => getters.getPluginsByCategory('settings'),
    getPluginByComponentId: state => componentId =>
        state.plugins.find(plugin => plugin.id && `plugin-${plugin.id}` === componentId),
    getPluginByName: state => name => state.plugins.find(plugin => plugin.name === name),
    getPluginById: state => id => state.plugins.find(plugin => id && plugin.id === id),
    getPluginSettings: (_, getters) => id => {
        const plugin = getters.getPluginById(id);
        return plugin && plugin.settings;
    },
    getPluginIsLoaded: (_, getters) => id => {
        const plugin = getters.getPluginById(id);
        return plugin && plugin.isLoaded;
    },
};
