export default {
    getPagePath(pageId, lang = wwLib.wwLang.lang) {
        const website = wwLib.wwWebsiteData.getInfo();
        if (!website) throw new Error('Project not found.');

        let base = '/';
        /* wwFront:start */
        const baseTag = website.baseTag || {};
        base = baseTag.href || '/';
        base = base.replace(/^\w+:\/\/[^\/]+/, '');
        base = base.endsWith('/') ? base : `${base}/`;
        /* wwFront:end */

        const langFound = website.langs.find(websiteLang => websiteLang.lang === lang);
        if (!langFound) throw new Error('Lang not found.');

        const page = wwLib.wwWebsiteData.getPages().find(page => page.id === pageId || page.linkId === pageId);
        if (!page) throw new Error('Page not found.');

        const isHomePage = page && page.id === website.homePageId;

        return `${base}${langFound.default && !langFound.isDefaultPath ? '' : `${lang}/`}${
            isHomePage ? '' : page.paths[lang] || page.paths.default
        }`;
    },
};
