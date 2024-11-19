/* eslint-disable vue/no-dupe-keys */
<template>
    <div
        v-if="isRendering"
        :style="containerStyle"
        ww-responsive="ww-section"
        class="ww-section"
        :data-section-uid="uid"
        :class="wwSectionClasses"
        @mouseenter="addInternalState('_wwHover', true)"
        @mouseleave="removeInternalState('_wwHover', true)"
    >
        <a :id="sanitize(section.sectionTitle)" class="hash-anchor"></a>
        <!-- BACKGROUND VIDEO -->
        <wwBackgroundVideo
            v-if="
                style &&
                style.background &&
                style.background.type === 'video' &&
                style.background.value &&
                style.background.value.url
            "
            :video="style.background"
            class="ww-section__video"
        ></wwBackgroundVideo>

        <!-- wwFront:start -->
        <component
            :is="componentName"
            ref="component"
            class="ww-section-element"
            :class="[state.class || '']"
            v-bind="componentAttributes"
            :style="elementStyle"
            ww-responsive="ww-section-element"
            :content="content"
            :uid="uid"
            :ww-section-state="wwSectionState"
            :ww-front-state="wwFrontState"
            @trigger-event="onTriggerEvent"
            @add-state="addInternalState"
            @remove-state="removeInternalState"
            @toggle-state="toggleInternalState"
        />
        <!-- wwFront:end -->

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { provide, ref, computed, onUnmounted, toRef } from 'vue';

import {
    getComponentIcon,
    getComponentLabel,
    getComponentName,
    getComponentConfiguration,
    getComponentSize,
    isComponentDisplayed,
} from '@/_common/helpers/component/component';
import { useComponentData, useComponentWorkflow } from '@/_common/use/useComponent';
import { useComponentStates } from '@/_front/use/useComponentStates';

export default {
    name: 'wwSection',
    components: {
    },
    props: {
        uid: String,
        index: Number,
    },
    setup(props) {
        const component = ref(null);

        function executeSectionFunction(action, ...payload) {
            if (!component.value) return;
            if (!component.value[action]) return;

            return component.value[action](...payload);
        }

        // TODO: This is not reactive??
        provide('sectionId', props.uid);
        provide('topSection', props.index < 2);


        const uid = toRef(props, 'uid');


        const { currentStates, addInternalState, removeInternalState, toggleInternalState } = useComponentStates(
            { uid: props.uid, type: 'section' },
            {
                context: {},
                propsState: toRef(props, 'states'),
            }
        );

        const {
            content,
            style,
            state,
        } = useComponentData({ type: 'section', uid, currentStates });

        const { listeners, executeWorkflows } = useComponentWorkflow({ state, type: 'section' }, {});


        return {
            component,
            content,
            style,
            state,
            listeners,
            executeWorkflows,
            addInternalState,
            removeInternalState,
            toggleInternalState,
            configuration: computed(() => getComponentConfiguration('section', props.uid)),
        };
    },
    data() {
        return {
            sanitize: wwLib.wwUtils.sanitize,
        };
    },
    computed: {
        ...mapGetters({
            screenSize: 'front/getScreenSize',
        }),
        /* wwFront:start */
        target() {
            return `[data-section-uid="${this.uid}"]`;
        },
        /* wwFront:end */
        wwSectionClasses() {
            // eslint-disable-next-line no-unreachable
            return null;
        },
        section() {
            return this.$store.getters['websiteData/getSection'](this.uid) || {};
        },
        containerStyle() {
            let style = {
                height: this.style.height,
                margin: this.style.margin,
                justifyContent: this.style.align || 'flex-start',
                zIndex: this.style.zIndex || 'unset',
                overflow: this.style.overflow,
            };

            //MIN-HEIGHT
            style.minHeight = getComponentSize(this.style.minHeight);
            //MAX-HEIGHT
            style.maxHeight = getComponentSize(this.style.maxHeight);

            //Manage display
            style.display = isComponentDisplayed(this.style.display) ? 'flex' : 'none';

            if (this.style.position === 'sticky') {
                style.position = this.style.position;
                const hasValue = this.style.top || this.style.bottom || this.style.left || this.style.right;
                style.top = this.style.top || (hasValue ? null : '0px');
                style.bottom = this.style.bottom;
                style.left = this.style.left;
                style.right = this.style.right;
            }

            // BACKGROUND COLOR
            if (this.style.backgroundColor) {
                const bgStyle = wwLib.getStyleFromColor(this.style.backgroundColor);
                Object.assign(style, bgStyle);
            }

            if (this.style.background) {
                if (this.style.background.type === 'image' && this.style.background.value.url) {
                    /* wwFront:start */
                    style.backgroundImage = `url(${this.style.background.value.url})`;
                    /* wwFront:end */

                    if (this.style.background.value.size === 'percent') {
                        style.backgroundSize = this.style.background.value.percent || '100%';
                    } else {
                        style.backgroundSize = this.style.background.value.size || 'cover';
                    }

                    style.backgroundRepeat = this.style.background.value.repeat || 'no-repeat';

                    const x =
                        (this.style.background.value.position ? this.style.background.value.position.x : null) || '50%';
                    const y =
                        (this.style.background.value.position ? this.style.background.value.position.y : null) || '50%';

                    style.backgroundPosition = `${x} ${y}`;

                    style.backgroundAttachment = this.style.background.value.attachment;
                }
            }

            if (this.style.cursor) {
                style.cursor = this.style.cursor;
            }

            style.opacity = this.style.opacity;

            for (const prop in this.style.customCss || {}) {
                style[prop] = this.style.customCss[prop];
            }

                ['cursor'].forEach(prop => {
                    if (this.style[prop]) {
                        style[prop] = this.style[prop];
                    }
                });

            return style;
        },
        elementStyle() {
            const style = {
                padding: this.style.padding,
            };

            //MAX-WIDTH
            style.maxWidth = getComponentSize(this.style.maxWidth);
            //MIN-WIDTH
            style.minWidth = getComponentSize(this.style.minWidth);

            // OTHER
            [
                'border',
                'borderTop',
                'borderBottom',
                'borderLeft',
                'borderRight',
                'borderRadius',
                'boxShadow',
                'transition',
                'transform',
            ].forEach(prop => {
                if (this.style[prop]) {
                    style[prop] = this.style[prop];
                }
            });

            let perspective = this.style.perspective || 0;
            const hasPerspective = wwLib.wwUtils.getLengthUnit(perspective)[0];
            if (hasPerspective) {
                style.perspective = perspective;
            }

            return style;
        },
        isRendering() {
            // eslint-disable-next-line no-unreachable
            return this.style.conditionalRendering;
        },
        componentAttributes() {
            let attributes = { ...this.listeners };

            if (this.state.attributes) {
                try {
                    for (const attr of this.state.attributes.filter(attr => attr.name)) {
                        attributes[attr.name.replace(/ /g, '')] = attr.value;
                    }
                } catch {
                    wwLib.wwLog.warn(
                        `Attributes is missbind for section ${getComponentLabel('section', this.uid)} (${this.uid})`
                    );
                }
            }

            if (this.state.id) {
                attributes.id = this.state.id;
            }

            return attributes;
        },
        wwFrontState() {
            return {
                lang: this.lang,
                pageId: this.pageId,
                screenSize: this.screenSize,
            };
        },
        wwSectionState() {
            return { uid: this.uid };
        },
        lang() {
            return wwLib.$store.getters['front/getLang'];
        },
        pageId() {
            return wwLib.$store.getters['websiteData/getPageId'];
        },
        componentName() {
            return getComponentName('section', this.uid);
        },
    },
    methods: {
        onTriggerEvent({ name, event } = {}) {
            this.executeWorkflows(name, event);
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-section {
    position: relative;
    max-width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ww-section-element {
        width: 100%;
        min-height: 50px;
    }

    .hash-anchor {
        position: absolute;
        top: 0;
        left: 50%;
    }

}
</style>

<style lang="scss">
.ww-section {
    &.-dragging-section .ww-section__drop-helper {
        opacity: 1 !important;
    }
}
</style>
