<script>
import { mapGetters } from 'vuex';
import { h, Comment } from 'vue';

export default {
    name: 'wwLink',
    props: {
        wwLink: { type: [Object, String, Number], default: undefined },
        disabled: { type: Boolean, default: false },
        pageIndex: { type: [Number, String], default: 0 },
        hyperlink: { type: Boolean, default: false },
    },
    emits: ['linkActive'],
    data() {
        return {
            linkActive: false,
        };
    },
    computed: {
        ...mapGetters({
            page: 'websiteData/getPage',
        }),
        normalizedLink() {
            /* wwFront:start */
            if (this.wwLink && this.wwLink.type === 'collection') {
                return { ...this.wwLink, type: 'internal', pageId: `${this.wwLink.pageId}_${this.pageIndex || 0}` };
            }
            /* wwFront:end */

            return typeof this.wwLink === 'string' || typeof this.wwLink === 'number'
                ? { type: 'external', href: `${this.wwLink}`, targetBlank: false }
                : this.wwLink;
        },
        queryParameters() {
            if (!this.wwLink || !this.wwLink.query) return {};
            return this.wwLink.query.reduce((parameters, { name, value }) => {
                parameters[name] = value;
                return parameters;
            }, {});
        },
        attributes() {
            if (this.disabled) {
                return {};
            }
            switch (this.normalizedLink.type) {
                case 'external': {
                    let href = this.normalizedLink.href;

                    //Correct & complete url
                    if (
                        href &&
                        !href.startsWith('http://') &&
                        !href.startsWith('https://') &&
                        href.includes('.') &&
                        !href.includes(':')
                    ) {
                        href = `http://${href}`;
                    } else if (
                        href &&
                        !href.startsWith('http://') &&
                        !href.startsWith('https://') &&
                        !href.startsWith('/') &&
                        !href.includes(':')
                    ) {
                        href = `/${href}`;
                    }

                    if (this.normalizedLink && this.normalizedLink.query) {
                        const query = this.normalizedLink.query
                            .map(({ name, value }) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
                            .join('&');
                        href = `${href}${href.indexOf('?') !== -1 ? '&' : '?'}${query}`;
                    }

                    const normalizedLink = {
                        href,
                    };

                    /* wwFront:start */
                    if (this.normalizedLink.targetBlank) normalizedLink.target = '_blank';
                    /* wwFront:end */

                    return normalizedLink;
                }
                case 'internal':
                case 'collection': {
                    const page =
                        this.$store.getters['websiteData/getPageById'](this.normalizedLink.pageId) ||
                        this.$store.getters['websiteData/getPageByLinkId'](this.normalizedLink.pageId);
                    if (!page) return { href: '' };

                    let href = wwLib.wwPageHelper.getPagePath(page.id);

                    if (this.normalizedLink.sectionId && page && page.sections) {
                        if (this.normalizedLink.sectionId !== 'custom') {
                            const _section = page.sections.find(
                                ({ uid, linkId }) =>
                                    uid === this.normalizedLink.sectionId || linkId === this.normalizedLink.sectionId
                            );
                            if (_section) {
                                const section = wwLib.$store.getters['websiteData/getSection'](_section.uid);
                                if (section) {
                                    href = `${href}#section-${wwLib.wwUtils.sanitize(section.sectionTitle)}`;
                                } else {
                                    href = `${href}`;
                                }
                            }
                        } else {
                            href = `${href}#${this.normalizedLink.customId}`;
                        }
                    }

                    if (this.normalizedLink && this.normalizedLink.query) {
                        const query = this.normalizedLink.query
                            .map(({ name, value }) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
                            .join('&');
                        href = `${href}${href.indexOf('?') !== -1 ? '&' : '?'}${query}`;
                    }

                    const normalizedLink = {
                        pageId: page.id,
                        href,
                    };

                    /* wwFront:start */
                    if (this.normalizedLink.targetBlank) normalizedLink.target = '_blank';
                    /* wwFront:end */

                    return normalizedLink;
                }
                case 'file': {
                    return {
                        href: this.normalizedLink.file.url,
                        target: '_blank',
                        download: this.normalizedLink.file.name || true,
                    };
                }
                case 'mail': {
                    return {
                        href: `mailto:${this.normalizedLink.href}`,
                    };
                }
                case 'tel': {
                    return {
                        href: `tel:${this.normalizedLink.href}`,
                    };
                }
                default:
                    return {};
            }
        },
        tag() {
            if (this.disabled || !this.normalizedLink || this.normalizedLink.type === 'none') return 'span';
            if (this.normalizedLink.type === 'open-popup' || this.normalizedLink.type === 'close-popup')
                return 'button';
            else return this.hyperlink ? 'a' : 'div';
        },
    },
    mouted() {
        this.checkLinkActive();
    },
    watch: {
        $route: {
            handler() {
                this.checkLinkActive();
            },
        },
        wwLink: {
            immediate: true,
            deep: true,
            handler() {
                this.checkLinkActive();
            },
        },
        disabled() {
            this.checkLinkActive();
        },
        linkActive(newLinkActive, oldLinkActive) {
            if (newLinkActive !== oldLinkActive) {
                this.$emit('linkActive', this.linkActive);
            }
        },
    },
    methods: {
        closePopup() {
            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('wwLink:closePopup');
            wwLib.$store.dispatch('front/closeActiveLinkPopup', null);
        },
        openPopup() {
            wwLib.$store.dispatch('front/setActiveLinkPopup', {
                content: this.normalizedLink.content,
                background: this.normalizedLink.background,
            });
        },
        navigate(event) {
            // eslint-disable-next-line vue/custom-event-name-casing
            wwLib.$emit('wwLink:clicked');

            if (
                (this.normalizedLink.pageId === this.$store.getters['websiteData/getPage'].id ||
                    this.normalizedLink.pageId === this.$store.getters['websiteData/getPage'].linkId) &&
                this.normalizedLink.type !== 'collection'
            ) {
                event.preventDefault();
                event.stopPropagation();

                const _section = this.$store.getters['websiteData/getPage'].sections.find(
                    ({ uid, linkId }) =>
                        uid === this.normalizedLink.sectionId || linkId === this.normalizedLink.sectionId
                );

                if (_section) {
                    const section = this.$store.getters['websiteData/getSection'](_section.uid);
                    wwLib.wwUtils.scrollIntoView(
                        wwLib.getFrontDocument().querySelector(`[data-section-uid="${section.uid}"]`)
                    );
                } else {
                    wwLib.getFrontWindow().scroll({
                        top: 0,
                        left: 0,
                        behavior: 'smooth',
                    });
                }
            } else {
                wwLib.getFrontRouter().push(this.attributes.href);
            }
        },
        checkLinkActive() {
            let linkActive = false;
            if (this.disabled || !this.normalizedLink || this.normalizedLink.type !== 'internal') linkActive = false;
            else if (this.page.id === this.normalizedLink.pageId) linkActive = true;
            else linkActive = false;

            this.linkActive = linkActive;
        },
    },
    render() {
        // TODO: REDO THIS !!

        //NO LINK
        if (!this.normalizedLink || this.normalizedLink.type === 'none') {
            const children = this.$slots.default ? this.$slots.default() : [];
            return children.find(({ type }) => type !== Comment) || children[0] || [];
        }

        let className = 'ww-link';

        //If tag is button, add a -btn class
        if (this.tag === 'button') {
            className += ' -btn';
        }

        let listeners = {};

        //SET LINK IF NOT DISABLED (not edit mode)
        if (!this.disabled) {
            switch (this.normalizedLink.type) {
                case 'external':
                    if (this.tag !== 'a') {
                        className += ' -cursor';
                        /* wwFront:start */
                        if (this.normalizedLink.targetBlank) {
                            listeners.onClick = () => {
                                window.open(this.normalizedLink.href, '_blank').focus();
                            };
                        } else {
                            listeners.onClick = () => {
                                window.location = this.normalizedLink.href;
                            };
                        }
                        /* wwFront:end */
                    }
                    break;

                case 'internal':
                case 'collection':
                    /* wwFront:start */
                    if (this.tag !== 'a') {
                        className += ' -cursor';
                        listeners.onClick = this.navigate;
                    }
                    /* wwFront:end */
                    break;

                case 'file':
                    if (this.tag !== 'a') {
                        className += ' -cursor';
                        listeners.onClick = () => {
                            const link = document.createElement('a');
                            link.download = this.normalizedLink.file.name;
                            link.target = '_blank';
                            link.href = this.normalizedLink.file.url;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        };
                    }
                    break;

                case 'mail':
                    if (this.tag !== 'a') {
                        className += ' -cursor';
                        listeners.onClick = () => {
                            window.location.href = `mailto:${this.normalizedLink.href}`;
                        };
                    }
                    break;
                case 'tel':
                    if (this.tag !== 'a') {
                        className += ' -cursor';
                        listeners.onClick = () => {
                            window.location.href = `tel:${this.normalizedLink.href}`;
                        };
                    }
                    break;

                case 'close-popup':
                    listeners.onClick = this.closePopup;
                    break;

                case 'open-popup':
                    listeners.onClick = this.openPopup;
                    break;
            }
        }

        //RENDER LINK
        return h(
            this.tag,
            { ...this.attributes, class: className, ...listeners },
            this.$slots.default ? this.$slots.default() : []
        );
    },
};
</script>

<style lang="scss" scoped>
.ww-link {
    &.-btn {
        font-family: inherit;
        font-size: 100%;
        margin: 0;
        overflow: visible;
        text-transform: none;
        padding: 0;
        outline: none;
        border: none;
        background-color: inherit;
        cursor: pointer !important;
    }
    &.-cursor {
        cursor: pointer !important;
    }
}
</style>
