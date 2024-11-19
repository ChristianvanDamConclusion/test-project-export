import { createRouter, createWebHistory } from 'vue-router';
import wwPage from './views/wwPage.vue';

import { initializeData, onPageUnload } from '@/_common/helpers/data';

let router;
const routes = [];


/* wwFront:start */
// eslint-disable-next-line no-undef
window.wwg_designInfo = {"id":"7e0915ba-afff-4f7b-ae13-b72e496e5cc8","homePageId":"95f8da11-95b9-412f-831b-d8a291198612","designVersionId":"2cb3afd7-f3c0-4eba-a806-6e1fb14c1217","cacheVersion":41,"langs":[{"lang":"en","default":true}],"baseTag":null,"name":"Templates - CRM","workflows":[{"id":"8c5d996d-70e5-4fba-b5ad-e9d12262934e","name":"Display or Hide Sidebar depending on the breakpoint","actions":{"18446934-06df-4df1-8066-33800bd13cd4":{"id":"18446934-06df-4df1-8066-33800bd13cd4","name":"Display Sidebar","type":"execute-workflow","parameters":{"display":true},"workflowId":"b552d567-8261-4fb1-9209-159d0d89eff1"},"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3":{"id":"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3","name":"Display Sidebar","type":"execute-workflow","parameters":{"display":true},"workflowId":"b552d567-8261-4fb1-9209-159d0d89eff1"},"703bdf64-15c6-4027-b539-a033cceef13e":{"id":"703bdf64-15c6-4027-b539-a033cceef13e","type":"switch","value":{"code":"context.browser['breakpoint']","__wwtype":"f"},"branches":[{"id":"6696f480-a5e2-4dd5-b001-e11e2ba3f1d3","value":"default"},{"id":"18446934-06df-4df1-8066-33800bd13cd4","value":"tablet"},{"id":"ed5e49f7-7cd2-4877-987f-db7d858811eb","value":"mobile"}]},"ed5e49f7-7cd2-4877-987f-db7d858811eb":{"id":"ed5e49f7-7cd2-4877-987f-db7d858811eb","name":"Hide Sidebar","type":"execute-workflow","parameters":{"display":false},"workflowId":"b552d567-8261-4fb1-9209-159d0d89eff1"}},"trigger":"before-collection-fetch","firstAction":"703bdf64-15c6-4027-b539-a033cceef13e"}],"prerenderDisabled":false,"wewebPreviewURL":null,"pages":[{"id":"95f8da11-95b9-412f-831b-d8a291198612","linkId":"8e106f57-c664-4b2a-90e5-97bfc461d9d2","paths":{"en":"home","default":"home"},"langs":["en"],"sections":[{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"ba347906-5cdd-4923-aeb0-58f5dd3e31b0","linkId":"cd916d01-3d80-450f-9de7-c06e0d8802a6","sectionTitle":"Responsive Sidemenu"},{"uid":"9abd3bda-32fb-4a9d-944d-a7f737b14802","linkId":"177f8625-a483-43de-b61c-82807b464eb7","sectionTitle":"Deal details"},{"uid":"2332bbe6-7ac7-43f5-bcad-1f329c1cf2c9","linkId":"c1e46286-bedb-4835-8dd8-1bd639f544a4","sectionTitle":"Add new deal"},{"uid":"7fb17180-759f-4a90-9bb7-dc9a1cfd1563","linkId":"5250d9f9-3992-48e3-8a7a-c3516527dbe3","sectionTitle":"Deals"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}],"title":{"en":"Weweb CRM template","fr":"Vide | Commencer à partir de zéro"},"meta":{"desc":{"en":"Wanna build a custom CRM without code? It's possible with weweb.io!"},"keywords":{},"socialDesc":{},"socialTitle":{}},"metaImage":null,"favicon":"https://cdn.weweb.io/designs/7e0915ba-afff-4f7b-ae13-b72e496e5cc8/sections/WeWeb2_1.png?_wwcv=1663853857494"},{"id":"465c188c-6b88-4209-9e3b-5b5479532df7","linkId":"465c188c-6b88-4209-9e3b-5b5479532df7","paths":{"en":"login","default":"login"},"langs":["en"],"sections":[{"uid":"c8277451-a535-4459-9b98-3049e70ea8cc","linkId":"9de553b6-0954-4a93-8713-d8d8ddd2771d","sectionTitle":"Section"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]},{"id":"b4985ceb-eb75-4f98-875c-f3222910579b","linkId":"b4985ceb-eb75-4f98-875c-f3222910579b","paths":{"en":"signup","default":"signup"},"langs":["en"],"sections":[{"uid":"00738e97-a289-4185-87ab-ca282f098e53","linkId":"ae1c7f09-f551-4c96-89fa-af368ac96ef5","sectionTitle":"Section"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]},{"id":"41ee05e0-c47f-4ae3-8048-c9807fcce4b2","linkId":"41ee05e0-c47f-4ae3-8048-c9807fcce4b2","paths":{"en":"reset-password","default":"reset-password"},"langs":["en"],"sections":[{"uid":"974fc2c6-b2f3-447b-8534-ccabb69d981f","linkId":"a55d07a2-9c34-4370-9be9-28276791d746","sectionTitle":"Section"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]},{"id":"84d85016-a5e0-4b39-a645-4e644630145c","linkId":"84d85016-a5e0-4b39-a645-4e644630145c","paths":{"en":"post_google_oauth_redirect_page","default":"post_google_oauth_redirect_page"},"langs":["en"],"sections":[]},{"id":"2d76105e-33fb-4c36-bc53-7b4225321f18","linkId":"2d76105e-33fb-4c36-bc53-7b4225321f18","paths":{"en":"contacts","default":"contacts"},"langs":["en"],"sections":[{"uid":"1e338d4d-0c3f-4017-981b-20660260dda5","linkId":"9944b3d9-4d03-4a38-806a-0234def073d7","sectionTitle":"Contacts"},{"uid":"e5809034-84e8-4b61-a13e-e35835bba1eb","linkId":"a9283515-e8b9-4b7f-bfd2-ea1c9d4f3071","sectionTitle":"Add new contact"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"ba347906-5cdd-4923-aeb0-58f5dd3e31b0","linkId":"cd916d01-3d80-450f-9de7-c06e0d8802a6","sectionTitle":"Responsive Sidemenu"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]},{"id":"bdb8cea3-66af-4ba1-a01e-52455d0a62cb","linkId":"bdb8cea3-66af-4ba1-a01e-52455d0a62cb","paths":{"en":"user-management","default":"user-management"},"langs":["en"],"sections":[{"uid":"2873912c-6ff1-4b1b-ab3c-dbf7b13d0be7","linkId":"7b861f38-44e1-44d5-8bbf-0d04a4b3186a","sectionTitle":"Page header"},{"uid":"ba347906-5cdd-4923-aeb0-58f5dd3e31b0","linkId":"cd916d01-3d80-450f-9de7-c06e0d8802a6","sectionTitle":"Responsive Sidemenu"},{"uid":"27570856-98d9-4262-8bf9-5423f715a6e4","linkId":"47889b4c-8f2c-4945-825b-fadf70d78b9b","sectionTitle":"Contacts"},{"uid":"3c917925-bd1c-4604-a5a8-853d32e19bf8","linkId":"ec43f8d3-aea8-42be-b4da-c906c8eb76a2","sectionTitle":"Made with Weweb"}]},{"id":"2a44f50a-e8d9-4f86-99f1-c54ba03e4759","linkId":"2a44f50a-e8d9-4f86-99f1-c54ba03e4759","paths":{"en":"forgot-password","default":"forgot-password"},"langs":["en"],"sections":[{"uid":"3c567a1f-2588-49c4-a4a9-35c58f40be38","linkId":"b556d587-9ab2-42aa-8640-983f7b7e103c","sectionTitle":"Section"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]},{"id":"90ec6b28-3c33-46a6-a827-dc10b5c66100","linkId":"90ec6b28-3c33-46a6-a827-dc10b5c66100","paths":{"en":"companies","default":"companies"},"langs":["en"],"sections":[{"uid":"41554b66-199d-473f-9149-7e71fc757cbf","linkId":"8a9b4347-ece6-4c77-baf6-11e2c172dff9","sectionTitle":"Companies"},{"uid":"16c50266-b341-45e7-ac74-319a56eb7f7b","linkId":"d1dc9cea-3abe-4e43-b115-a19895288242","sectionTitle":"Alert"},{"uid":"9885f32b-bf8a-42f8-9107-56b938f89c73","linkId":"72136051-ed2f-451f-9e7d-e2d6b765fdad","sectionTitle":"Add new company"},{"uid":"ba347906-5cdd-4923-aeb0-58f5dd3e31b0","linkId":"cd916d01-3d80-450f-9de7-c06e0d8802a6","sectionTitle":"Responsive Sidemenu"},{"uid":"2289fac9-f1e8-4cb3-83b9-056048807f5a","linkId":"71b66f0f-8e6d-46cc-b2c2-13b847b5e92e","sectionTitle":"Made with Weweb"}]}],"plugins":[{"id":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","name":"restApi","hasCode":false,"versionId":"71a9bc8c-1b5c-4c18-b218-0089504e1b24"},{"id":"f5856798-485d-47be-b433-d43d771c64e1","name":"xanoAuth","hasCode":false,"versionId":"020bdf8a-0de8-4805-8b70-5784e51b5033"}]};
// eslint-disable-next-line no-undef
window.wwg_cacheVersion = 41;
// eslint-disable-next-line no-undef
window.wwg_pluginsSettings = {"2bd1c688-31c5-443e-ae25-59aa5b6431fb":{"id":"2050a682-6a4d-40a5-a5bd-245d5900256e","designId":"7e0915ba-afff-4f7b-ae13-b72e496e5cc8","pluginId":"2bd1c688-31c5-443e-ae25-59aa5b6431fb","publicData":{}},"f5856798-485d-47be-b433-d43d771c64e1":{"id":"4834a8dc-32da-4ca3-a9b6-00e42be5fa33","designId":"7e0915ba-afff-4f7b-ae13-b72e496e5cc8","pluginId":"f5856798-485d-47be-b433-d43d771c64e1","publicData":{"getMeEndpoint":"https://xc0b-vcze-d4we.n7.xano.io/api:QvNUhc0V/auth/me","loginEndpoint":"https://xc0b-vcze-d4we.n7.xano.io/api:QvNUhc0V/auth/login","signupEndpoint":"https://xc0b-vcze-d4we.n7.xano.io/api:QvNUhc0V/auth/signup","socialProviders":{"google-oauth":{"id":25,"api":"https://xc0b-vcze-d4we.n7.xano.io/api:nGBRmpLi","name":"google-oauth","description":"This API group handles all aspects of Google OAuth support.","swaggerspec":"https://xc0b-vcze-d4we.n7.xano.io/apispec:nGBRmpLi?type=json"}},"afterNotSignInPageId":"465c188c-6b88-4209-9e3b-5b5479532df7"}}};

const defaultLang = window.wwg_designInfo.langs.find(({ default: isDefault }) => isDefault) || {};

const registerRoute = (page, lang, forcedPath) => {
    const langSlug = !lang.default || lang.isDefaultPath ? `/${lang.lang}` : '';
    let path =
        forcedPath ||
        (page.id === window.wwg_designInfo.homePageId ? '/' : `/${page.paths[lang.lang] || page.paths.default}`);

    //Replace params
    path = path.replace(/{{([\w]+)\|([^/]+)?}}/g, ':$1');

    routes.push({
        path: langSlug + path,
        component: wwPage,
        name: `page-${page.id}-${lang.lang}`,
        meta: {
            pageId: page.id,
        },
        async beforeEnter(to, from, next) {
            if (to.name === from.name) return next();
            //If the app has already been mounted once (hydration of prerendered content done)
            //We set isPrerenderHydration to false so we don't lazy load sections
            if (wwLib.isMounted) wwLib.$store.dispatch('front/setIsPrerenderHydration', false);

            //Set page lang
            wwLib.wwLang.defaultLang = defaultLang.lang;
            wwLib.$store.dispatch('front/setLang', lang.lang);

            try {
                await import(`@/pages/${page.id.split('_')[0]}/components.js`);
                await wwLib.wwWebsiteData.fetchPage(page.id);

                //Scroll to section or on top after page change
                if (to.hash) {
                    const targetElement = document.getElementById(to.hash.replace('#', ''));
                    if (targetElement) targetElement.scrollIntoView();
                } else {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                }

                return next();
            } catch (err) {
                if (err.redirectUrl) {
                    return next({ path: err.redirectUrl || '404' });
                } else {
                    //Any other error: go to target page using window.location
                    window.location = to.fullPath;
                }
            }
        },
    });
};

for (const page of window.wwg_designInfo.pages) {
    for (const lang of window.wwg_designInfo.langs) {
        if (!page.langs.includes(lang.lang)) continue;
        registerRoute(page, lang);
    }
}

if (!window.__WW_IS_PRERENDER__) {
    const page404 = window.wwg_designInfo.pages.find(page => page.paths.default === '404');
    if (page404) {
        for (const lang of window.wwg_designInfo.langs) {
            // Create routes /:lang/:pathMatch(.*)* etc for all langs of the 404 page
            if (!page404.langs.includes(lang.lang)) continue;
            registerRoute(
                page404,
                {
                    default: false,
                    lang: lang.lang,
                },
                '/:pathMatch(.*)*'
            );
        }
        // Create route /:pathMatch(.*)* using default project lang
        registerRoute(page404, { default: true, isDefaultPath: false, lang: defaultLang.lang }, '/:pathMatch(.*)*');
    } else {
        routes.push({
            path: '/:pathMatch(.*)*',
            async beforeEnter() {
                window.location.href = '/404';
            },
        });
    }
}

let routerOptions = {};

if (!window.__WW_IS_PRERENDER__ && window.wwg_designInfo.baseTag && window.wwg_designInfo.baseTag.href) {
    routerOptions = {
        base: window.wwg_designInfo.baseTag.href,
        history: createWebHistory(window.wwg_designInfo.baseTag.href),
        routes,
    };
} else {
    routerOptions = {
        history: createWebHistory(),
        routes,
    };
}

router = createRouter(routerOptions);

if (!window.__WW_IS_PRERENDER__) {
    //Trigger on page unload
    let isFirstNavigation = true;
    router.beforeEach(async (to, _from, next) => {
        if (!isFirstNavigation) await onPageUnload();
        isFirstNavigation = false;
        return next();
    });

    //Init page
    router.afterEach((to, from, failure) => {
        let fromPath = from.path;
        let toPath = to.path;
        if (!fromPath.endsWith('/')) fromPath = fromPath + '/';
        if (!toPath.endsWith('/')) toPath = toPath + '/';
        if (failure || (from.name && toPath === fromPath)) return;
        initializeData(to);
    });
}
/* wwFront:end */

export default router;
