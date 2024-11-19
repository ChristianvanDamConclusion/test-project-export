/*=============================================m_ÔÔ_m=============================================\
    SCREEN SIZES
\================================================================================================*/
const screenSizes = {
    default: {
        order: 0,
        icon: 'move',
        query: null,
        queryCss: '(min-width: 992px)',
        defaultWidth: null,
        defaultHeight: null,
        prerenderWidth: 1920,
    },
    tablet: {
        order: 1,
        icon: 'tablet',
        query: 'max-width: 991px',
        queryCss: '(min-width: 768px) and (max-width: 991px)',
        defaultWidth: 770,
        defaultHeight: (770 * 14) / 9,
        prerenderWidth: 991,
    },
    mobile: {
        order: 2,
        icon: 'mobile',
        query: 'max-width: 767px',
        queryCss: '(max-width: 767px)',
        defaultWidth: 400,
        defaultHeight: (400 * 13) / 9,
        prerenderWidth: 767,
    },
};

const orderedScreenSizes = Object.keys(screenSizes)
    .map(screenSize => ({ order: screenSizes[screenSize].order, screenSize }))
    .sort(({ order: orderA }, { order: orderB }) => orderA - orderB)
    .map(({ screenSize }) => screenSize);

/*=============================================m_ÔÔ_m=============================================\
    UTILS
\================================================================================================*/
function delayAsync(fn, delay) {
    return new Promise(resolve => {
        setTimeout(async () => {
            resolve(await fn());
        }, delay);
    });
}

/*=============================================m_ÔÔ_m=============================================\
    FUNCTIONS
\================================================================================================*/
async function startProcess() {
    let delay = 1000;

    for (const screenSize of orderedScreenSizes) {
        const styles = await resizeIframe(screenSizes[screenSize], delay);
        addCss(styles, screenSize);
    }

    return delayAsync(() => {
        const rootNode = iframe.contentWindow.$rootNode;

        function insertBefore(parentElement, targetElement, element) {
            parentElement.insertBefore(element, targetElement);
        }
        function insertAfter(parentElement, targetElement, element) {
            if (!parentElement.children || !parentElement.children.length) {
                parentElement.append(element);
            } else if (parentElement.children[parentElement.children.length - 1] === targetElement) {
                parentElement.append(element);
            } else {
                parentElement.insertBefore(element, targetElement.nextSibling);
            }
        }

        // j'ai passé des heures à faire ça alors je vais pas non plus t'expliquer, tu te débrouilles.
        // (Peut etre que Flo se rappel, demande lui.)
        function addFragmentNode(node) {
            let vnode = node;
            if (!vnode) return;

            if (vnode.type && vnode.type.toString().startsWith('Symbol') && vnode.el) {
                const parentElement = vnode.el.parentElement;
                const openFragmentElement = iframe.contentWindow.document.createComment('[');
                const closeFragmentElement = iframe.contentWindow.document.createComment(']');

                if (vnode.anchor) {
                    insertBefore(parentElement, vnode.el, openFragmentElement);
                    insertAfter(parentElement, vnode.anchor, closeFragmentElement);
                }
            }

            if (vnode.children && Array.isArray(vnode.children)) {
                for (const child of vnode.children) {
                    addFragmentNode(child);
                }
            } else if (vnode.component && vnode.component.subTree) {
                addFragmentNode(vnode.component.subTree);
            }
        }

        addFragmentNode(rootNode._.subTree);

        const wwResponsives = iframe.contentWindow.document.querySelectorAll('[ww-responsive]');
        for (const wwResponsive of wwResponsives) {
            wwResponsive.style.cssText = '';
        }
        const content = iframe.contentWindow.document.querySelector('html').outerHTML;
        // const langAttribute = iframe.contentWindow.document.querySelector("html").attributes.lang && iframe.contentWindow.document.querySelector("html").attributes.lang.value;
        // const ampAttribute = iframe.contentWindow.document.querySelector("html").attributes.amp && iframe.contentWindow.document.querySelector("html").attributes.amp.value;

        document.querySelector('html').innerHTML = content;
        // document.querySelector("html").setAttribute("lang", langAttribute);
        // document.querySelector("html").setAttribute("amp", ampAttribute);

        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('ww-prerender-page', { detail: `<!DOCTYPE html>${content}` }));
        }, 1000);
    }, 5000);
}

function resizeIframe(screenSize, delay) {
    return delayAsync(async () => {
        iframe.style.width = `${screenSize.prerenderWidth}px`;

        return await delayAsync(() => {
            return extractInlineStyle();
        }, 10000);
    }, delay);
}

function extractInlineStyle() {
    const wwResponsives = iframe.contentWindow.document.querySelectorAll('[ww-responsive]');
    let style = {};
    for (const wwResponsive of wwResponsives) {
        let parentObject = wwResponsive.closest('[data-ww-uid]');

        let className;
        if (parentObject) {
            if (parentObject.attributes['data-ww-uid'] && parentObject.attributes['data-ww-uid'].value) {
                const splited = parentObject.attributes['data-ww-uid'].value.split('-');
                const troncatedUid = splited[splited.length - 1];
                let repeatIndex;
                if (
                    parentObject.attributes['data-ww-repeat-index'] &&
                    parentObject.attributes['data-ww-repeat-index'].value &&
                    !isNaN(parentObject.attributes['data-ww-repeat-index'].value)
                )
                    repeatIndex = parentObject.attributes['data-ww-repeat-index'].value;
                className = `ww-style-${troncatedUid}-${wwResponsive.attributes['ww-responsive'].value}${
                    repeatIndex ? `-${repeatIndex}` : ''
                }`;
            }
        } else {
            parentObject = wwResponsive.closest('[data-section-uid]');
            if (parentObject.attributes['data-section-uid'] && parentObject.attributes['data-section-uid'].value) {
                const splited = parentObject.attributes['data-section-uid'].value.split('-');
                const troncatedUid = splited[splited.length - 1];
                className = `ww-style-${troncatedUid}-${wwResponsive.attributes['ww-responsive'].value}`;
            }
        }

        const regexPropValue = /([^:]*):(.*)/;
        if (className) {
            let dataVattr = 'data-v-unknown';
            for (const attr of wwResponsive.attributes) {
                if (attr.name && attr.name.startsWith('data-v-')) {
                    dataVattr = attr.name;
                    break;
                }
            }
            if (wwResponsive.style) {
                style[`${className}[ww-responsive][${dataVattr}]`] = wwResponsive.style.cssText
                    .split(';')
                    .reduce((style, declaration) => {
                        const match = declaration.match(regexPropValue);

                        if (match && match.length >= 3) {
                            const prop = match[1];
                            const value = match[2];
                            if (prop && value) {
                                style[prop] = value;
                            }
                        }
                        return style;
                    }, {});
                wwResponsive.classList.add(className);
                // wwResponsive.style.cssText = '';
            }
        }
    }

    return style;
}

function generateCss(styles, screenSize) {
    let css = '';

    const media = screenSizes[screenSize].query ? `@media (${screenSizes[screenSize].query})` : '';

    let style = '';
    for (const className in styles) {
        const classStyle = Object.keys(styles[className])
            .map(prop => `${prop}:${styles[className][prop]}`)
            .join(';');

        if (classStyle) {
            style += `.${className}{${classStyle}}`;
        }
    }

    if (style) {
        if (media) {
            css += `${media}{${style}}`;
        } else {
            css += `${style}`;
        }
    }

    return css;
}

function addCss(styles, screenSize) {
    const css = generateCss(styles, screenSize);
    const headCss = iframe.contentWindow.document.createElement('style');
    headCss.setAttribute('generated-css', screenSize);
    headCss.setAttribute('generated-media', screenSizes[screenSize].queryCss);
    headCss.innerText = css;
    iframe.contentWindow.document.head.append(headCss);
}

/*=============================================m_ÔÔ_m=============================================\
    EXPORT
\================================================================================================*/
let iframe;
export default function () {
    iframe = document.createElement('iframe');
    iframe.setAttribute('ww-prerender', true);

    iframe.style.width = `${screenSizes[orderedScreenSizes[0]].prerenderWidth}px`;
    iframe.style.height = '1px';
    iframe.src = window.location;
    document.body.append(iframe);

    startProcess();
}
