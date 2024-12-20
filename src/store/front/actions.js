export default {
    setIsPrerenderHydration({ commit }, isPrerenderHydration) {
        commit('setIsPrerenderHydration', isPrerenderHydration);
    },
    /*=============================================m_ÔÔ_m=============================================\
        LANG
    \================================================================================================*/
    setLang({ commit }, newLang) {
        commit('setLang', newLang);
    },
    /*=============================================m_ÔÔ_m=============================================\
        SCREEN SIZE
    \================================================================================================*/
    setIsScreenSizeActive({ commit }, { screenSize, isActive }) {
        commit('setIsScreenSizeActive', { screenSize, isActive });
    },
    /*=============================================m_ÔÔ_m=============================================\
        COMPONENTS CONFIG
    \================================================================================================*/
    addComponentConfig({ commit }, options) {
        commit('addComponentConfig', options);
    },
    setActiveLinkPopup({ commit }, { content, background, sectionId }) {
        commit('setActiveLinkPopup', { content, background, sectionId });
    },
    closeActiveLinkPopup({ commit }) {
        commit('setActiveLinkPopup', null);
    },
};
