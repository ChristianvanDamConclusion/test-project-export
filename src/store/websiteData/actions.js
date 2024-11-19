

export default {
    /*=============================================m_ÔÔ_m=============================================\
      DESIGN
    \================================================================================================*/
    async setFullDesign(context, designInfo) {
        context.commit('setFullDesign', designInfo);
        designInfo.plugins.forEach(plugin => context.commit('addPlugin', plugin));
    },


    /*=============================================m_ÔÔ_m=============================================\
      PAGE
    \================================================================================================*/
    async setPageData(context, pageData) {

        context.commit('setPageData', pageData);
        context.dispatch('data/removeComponentVariables', null, { root: true });

    },
    setPageId(context, pageId) {
        context.commit('setPageId', pageId || context.getters['getDesignInfo'].homePageId);
    },
    setPageIdFromRoute(context, route) {
        const langs = context.state.design.info.langs.map(langData => langData.lang);

        function correctRoute(_route) {
            if (_route && _route[0] == '/') _route = _route.substring(1);
            if (_route && _route[_route.length - 1] == '/') _route = _route.substring(0, _route.length - 1);

            for (const lang of langs) {
                if (_route && _route.indexOf(lang + '/') === 0) _route = _route.substring(lang.length + 1);
                if (_route && _route == lang) _route = '@home';
            }
            return _route;
        }
        const routes = {};
        route = correctRoute(route) || '@home';

        for (const page of context.state.design.pages) {
            if (page.id == context.state.design.info.homePageId) {
                routes['@home'] = page.id;
                routes['/'] = page.id;
            } else {
                for (const lang of page.langs) {
                    routes[correctRoute(page.paths[lang] || page.paths.default)] = page.id;
                }
            }
        }

        if (routes[route]) {
            context.commit('setPageId', routes[route]);
        } else if (routes['404']) {
            context.commit('setPageId', routes['404']);
        } else {
            context.commit('setPageId', routes['@home']);
        }
    },


    /*=============================================m_ÔÔ_m=============================================\
        PLUGINS
    \================================================================================================*/
    addPlugin({ commit }, plugin) {
        commit('addPlugin', plugin);
        return plugin;
    },
    addDevPlugin({ commit }, { name }) {
        const plugin = {
            name,
            storeName: {
                en: name,
            },
            repository: {},
            icon: 'code',
            isDev: true,
        };
        commit('addPlugin', plugin);
        return plugin;
    },
    updatePlugin({ commit }, { pluginId, settings, isDev, isLoaded }) {
        commit('updatePlugin', { pluginId, settings, isDev, isLoaded });
    },
    async updatePluginSettings({ commit, getters }, { pluginId, settings }) {
        if (!settings) return;
        const plugin = getters.getPluginById(pluginId);
        if (plugin && !plugin.isDev)
            await window.wwLib.wwPlugin.saveSettings(pluginId, settings.id, settings.publicData, settings.privateData);
        commit('updatePlugin', { pluginId, settings });
    },

};
