export default {
    getIsPrerenderHydration(state) {
        return state.isPrerenderHydration;
    },
    /*=============================================m_ÔÔ_m=============================================\
        LANG
    \================================================================================================*/
    getLang(state) {
        return state.lang;
    },
    /*=============================================m_ÔÔ_m=============================================\
        SCREEN SIZE
    \================================================================================================*/
    getScreenSize: state => {
        const activeScreenSizes = Object.keys(state.isScreenSizeActive)
            .filter(screenSize => state.isScreenSizeActive[screenSize])
            .map(screenSize => {
                return { name: screenSize, order: state.screenSizes[screenSize].order };
            });

        activeScreenSizes.sort(({ order: orderA }, { order: orderB }) => {
            return orderB - orderA;
        });

        return activeScreenSizes.length ? activeScreenSizes[0].name : 'default';
    },
    getScreenSizes: state => state.screenSizes,
    /*=============================================m_ÔÔ_m=============================================\
        COMPONENTS CONFIG
    \================================================================================================*/
    getComponentConfig: state => name => {
        return state.componentConfigs[name] || { options: {}, editor: {}, properties: {} };
    },
    getActiveLinkPopup: state => state.activeLinkPopup,
};
