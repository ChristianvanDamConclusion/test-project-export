<template>
    <div
        v-if="isRendering"
        class="ww-object"
        v-bind="attributes"
        :data-ww-uid="uid"
        :data-ww-component-id="componentId"
        contenteditable="false"
        :class="[
            {
                wwbg: isBackground,
            },
        ]"
        :style="wwObjectStyle"
        ww-responsive="ww-main"
        @mouseenter="addInternalState('_wwHover', true)"
        @mouseleave="removeInternalState('_wwHover', true)"
    >
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
        ></wwBackgroundVideo>
        <!-- WWOBJECT -->
        <wwLink
            ref="wwlink"
            :ww-link="state.link"
            :hyperlink="configurationOptions.hyperlink"
            :style="elementStyle"
            ww-responsive="ww-elem"
            :disabled="isLinkDisabled"
            :page-index="bindingContext ? bindingContext.repeatIndex : undefined"
            @linkActive="$event ? addInternalState('_wwLinkActive') : removeInternalState('_wwLinkActive')"
        >
            <!-- wwFront:start -->
            <component
                :is="componentName"
                ref="component"
                class="ww-object-elem"
                :class="[state.class || '']"
                v-bind="componentAttributes"
                :content="content"
                :uid="uid"
                :ww-front-state="wwFrontState"
                :ww-element-state="wwElementState"
                @trigger-event="onTriggerEvent"
                @element-event="$emit('element-event', $event)"
                @add-state="addInternalState"
                @remove-state="removeInternalState"
                @toggle-state="toggleInternalState"
            ></component>
            <!-- wwFront:end -->
        </wwLink>
    </div>
</template>

<script>
import { computed, ref, toRef, reactive, inject, onUnmounted, watch, provide } from 'vue';
import { mapGetters } from 'vuex';

import {
    getComponentName,
    getComponentIcon,
    getComponentConfiguration,
    getComponentLabel,
    getComponentSize,
    isComponentDisplayed,
} from '@/_common/helpers/component/component';


import { useComponentData, useComponentWorkflow } from '@/_common/use/useComponent';
import { useComponentStates } from '@/_front/use/useComponentStates';

let componentId = 1;

export default {
    components: {
    },

    inject: {
        topSection: { default: false },
        parentId: { from: 'objectId', default: null },

    },

    provide() {
        const _this = this;

        return {
            get objectId() {
                return _this.uid;
            },
            get componentId() {
                return _this.componentId;
            },
            getObjectStyle: () => {
                return _this.style;
            },
            wwLayoutDirectParent: null, // we provide null so only direct child of wwLayout have access to this
        };
    },
    props: {
        uid: { type: String, required: true },
        isWwObject: { type: Boolean, default: true }, // only here to not have warning on vbind
        deactivate: { type: Boolean, default: false },
        isBackground: { type: Boolean, default: false },
        wwProps: { type: Object, default: () => ({}) },
        states: { type: Array, default: () => [] },
    },
    emits: ['element-event', 'update:child-selected', 'update:is-selected'],
    setup(props, { emit }) {
        const id = componentId;
        componentId++;
        const uid = toRef(props, 'uid');

        const wwLayoutDirectParent = inject('wwLayoutDirectParent', null);
        const wwLayoutContext = inject('wwLayoutContext', null);
        const wwLayoutItemContext = inject('wwLayoutItemContext', null);
        const bindingContext = inject('bindingContext', null);
        const sectionId = inject('sectionId', null);
        const isFlexboxChild = inject('__wwIsFlexboxChild', false);

        provide('wwLayoutContext', {});
        provide('__wwIsFlexboxChild', false);


        const context = reactive({
            item: computed(() => bindingContext || {}),
            layout: computed(() => ({ id: wwLayoutContext && wwLayoutContext.layoutId })),
        });

        const { currentStates, addInternalState, removeInternalState, toggleInternalState } = useComponentStates(
            { uid: props.uid, type: 'element' },
            {
                context,
                propsState: toRef(props, 'states'),
            }
        );


        const {
            content,
            style,
            state,
            rawContent,
            name: elementName,
        } = useComponentData({ type: 'element', uid, currentStates, context });

        const wwFrontState = reactive({
            lang: computed(() => wwLib.$store.getters['front/getLang']),
            pageId: computed(() => wwLib.$store.getters['websiteData/getPageId']),
            sectionId,
            screenSize: computed(() => wwLib.$store.getters['front/getScreenSize']),
            screenSizes: computed(() => wwLib.$store.getters['front/getScreenSizes']),
        });
        provide('wwFrontState', wwFrontState);

        const hasLink = computed(() => {
            return state.link && state.link.type !== 'none';
        });
        const isParentInsideLink = inject('isInsideLink', false);
        const isInsideLink = computed(() => {
            return isParentInsideLink.value || hasLink.value;
        });
        provide('isInsideLink', isInsideLink);

        const wwElementState = reactive({
            isBackground: toRef(props, 'isBackground'),
            props: toRef(props, 'wwProps'),
            isInsideLink,
            uid,
            name: elementName,
            states: currentStates,
        });
        provide('wwElementState', wwElementState);

        async function updateContent(newContent, noHistory, forced) {
            if (!forced && wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.PREVIEW) {
                wwLib.wwLog.log('\x1b[33m%s\x1b[0m', 'Content cannot be updated in PREVIEW mode.');
                return;
            }

            await wwLib.$store.dispatch('websiteData/updateWwObjectContent', {
                wwObjectId: uid.value,
                newContent,
                noHistory,
            });
        }
        provide('updateContent', updateContent);

        async function updateSidepanelContent({ path, value } = {}) {
            wwLib.$store.dispatch('manager/setSidePanelContent', {
                type: 'element',
                uid: uid.value,
                path,
                componentId: id,
                value,
            });
        }
        provide('updateSidepanelContent', updateSidepanelContent);

        async function updateContentAsEffect(newContent) {
            if (wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.PREVIEW) {
                wwLib.wwLog.log('\x1b[33m%s\x1b[0m', 'Content cannot be updated in PREVIEW mode.');
                return;
            }

            // We ignore other elements because it may cause too much update
            if (wwEditorState.isACopy) {
                return;
            }
            await wwLib.$store.dispatch('websiteData/updateWwObjectContent', {
                wwObjectId: uid.value,
                newContent,
                noHistory: true,
            });
        }
        provide('updateContentAsEffect', updateContentAsEffect);

        function triggerElementEvent(event) {
            emit('element-event', event);
        }
        provide('triggerElementEvent', triggerElementEvent);


        const { listeners, executeWorkflows } = useComponentWorkflow({ state, type: 'element' }, context);

        return {
            content,
            style,
            state,
            componentId: id,
            sectionId,
            configuration: computed(() => getComponentConfiguration('element', props.uid)),
            bindingContext,
            wwLayoutDirectParent,
            rawContent,
            wwLayoutContext,
            wwLayoutItemContext,
            context,
            elementName,
            addInternalState,
            removeInternalState,
            toggleInternalState,
            listeners,
            executeWorkflows,
            wwFrontState,
            hasLink,
            wwElementState,
            updateContent,
            updateSidepanelContent,
            updateContentAsEffect,
            isFlexboxChild,
        };
    },
    data() {
        return {
            hasSelectedChild: false,
        };
    },
    computed: {
        /*=============================================m_ÔÔ_m=============================================\
            VUEX
        \================================================================================================*/
        ...mapGetters({
        }),

        /*=============================================m_ÔÔ_m=============================================\
            WWOBJECT PROPS
        \================================================================================================*/
        componentName() {
            return getComponentName('element', this.uid);
        },
        /*=============================================m_ÔÔ_m=============================================\
            CONFIG / STATE
        \================================================================================================*/
        isRendering() {
            // eslint-disable-next-line no-unreachable
            return this.style.conditionalRendering;
        },
        configurationOptions() {
            return this.configuration.options || {};
        },
        attributes() {
            // eslint-disable-next-line no-unreachable
            if (this.bindingContext && this.bindingContext.repeatIndex)
                return { 'data-ww-repeat-index': this.bindingContext.repeatIndex };
            return {};
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
                        `Attributes is missbind for element ${getComponentLabel('element', this.uid)} (${this.uid})`
                    );
                }
            }

            if (this.state.id) {
                attributes.id = this.state.id;
            }

            return attributes;
        },
        isLinkDisabled() {
            let isLinkDisabledByConfiguration =
                this.configuration && this.configuration.options && this.configuration.options.disableLink;
            if (typeof isLinkDisabledByConfiguration === 'function') {
                isLinkDisabledByConfiguration = isLinkDisabledByConfiguration(this.content);
            }
            // eslint-disable-next-line no-unreachable
            return isLinkDisabledByConfiguration;
        },

        /*=============================================m_ÔÔ_m=============================================\
            STYLE
        \================================================================================================*/
        wwObjectStyle() {
            const wwObjectStyle = {
                margin: this.style.margin || '0',
                alignSelf: this.style.align || 'unset',
                zIndex: this.style.zIndex || 'unset',
                overflow: this.style.overflow,
            };

            //DISPLAY
            wwObjectStyle.display = isComponentDisplayed(this.style.display) ? 'flex' : 'none';

            //POSITION
            if (
                this.style.position === 'sticky' ||
                this.style.position === 'absolute' ||
                this.style.position === 'fixed'
            ) {
                wwObjectStyle.position = this.style.position;
                const hasValue = this.style.top || this.style.bottom || this.style.left || this.style.right;
                wwObjectStyle.top = this.style.top || (hasValue ? null : '0px');
                wwObjectStyle.bottom = this.style.bottom;
                wwObjectStyle.left = this.style.left;
                wwObjectStyle.right = this.style.right;
            }

            //WIDTH
            wwObjectStyle.width = getComponentSize(
                this.style.width,
                this.configurationOptions.autoByContent ? 'auto' : null
            );

            if (this.isFlexboxChild && this.style.flex) {
                wwObjectStyle.flex = this.style.flex;
            }

            // MAX-WIDTH
            wwObjectStyle.maxWidth = getComponentSize(this.style.maxWidth);
            // MIN-WIDTH
            wwObjectStyle.minWidth = getComponentSize(this.style.minWidth);

            //PERSPECTIVE
            let perspective = this.style.perspective || 0;
            const hasPerspective = wwLib.wwUtils.getLengthUnit(perspective)[0];
            if (hasPerspective) {
                wwObjectStyle.perspective = perspective;
            }

            // HEIGHT / RATIO
            const height = this.style.height || 'auto';
            if (this.configurationOptions.sizable && (!height || height === 'auto' || height === 'unset')) {
                wwObjectStyle.aspectRatio = !(height || height === 'auto' || height === 'unset')
                    ? 100 / 56
                    : 100 / parseInt(height.replace('%', ''));
                wwObjectStyle.height = 'unset';
            } else if (height && height.indexOf('%') !== -1) {
                wwObjectStyle.aspectRatio = 100 / parseInt(height.replace('%', ''));
                wwObjectStyle.height = 'unset';
            } else if (height && (height.indexOf('px') !== -1 || height.indexOf('vh') !== -1)) {
                wwObjectStyle.height = height;
            } else if (height && height == 'auto') {
                wwObjectStyle.height = 'auto';
            }

            //MAX-HEIGHT
            wwObjectStyle.maxHeight = getComponentSize(this.style.maxHeight);
            //MIN-HEIGHT
            wwObjectStyle.minHeight = getComponentSize(this.style.minHeight);

            // BACKGROUND COLOR
            if (this.style.backgroundColor) {
                const style = wwLib.getStyleFromColor(this.style.backgroundColor);
                Object.assign(wwObjectStyle, style);
            }
            // BACKGOUND
            if (this.style.background) {
                if (
                    this.style.background.type === 'image' &&
                    this.style.background.value &&
                    this.style.background.value.url
                ) {
                    /* wwFront:start */
                    wwObjectStyle.backgroundImage = `url(${this.style.background.value.url})`;
                    /* wwFront:end */

                    if (this.style.background.value.size === 'percent') {
                        wwObjectStyle.backgroundSize = this.style.background.value.percent || '100%';
                    } else {
                        wwObjectStyle.backgroundSize = this.style.background.value.size || 'cover';
                    }

                    wwObjectStyle.backgroundRepeat = this.style.background.value.repeat || 'no-repeat';

                    const x =
                        (this.style.background.value.position ? this.style.background.value.position.x : null) || '50%';
                    const y =
                        (this.style.background.value.position ? this.style.background.value.position.y : null) || '50%';

                    wwObjectStyle.backgroundPosition = `${x} ${y}`;

                    wwObjectStyle.backgroundAttachment = this.style.background.value.attachment;
                } else if (this.style.background.type === 'none') {
                    wwObjectStyle.background = 'none';
                }
            }

            // OTHER
            [
                'border',
                'borderTop',
                'borderBottom',
                'borderLeft',
                'borderRight',
                'borderRadius',
                'boxShadow',
                'opacity',
                'transition',
                'transform',
            ].forEach(prop => {
                if (this.style[prop] !== undefined && this.style[prop] !== null) {
                    wwObjectStyle[prop] = this.style[prop];
                }
            });

            //CURSOR
                if (this.style.cursor) {
                    wwObjectStyle.cursor = this.style.cursor;
                }

            //CUSTOM CSS
            for (const prop in this.style.customCss || {}) {
                wwObjectStyle[prop] = this.style.customCss[prop];
            }

            //ADD EXTRA-STYLE
            return { ...wwObjectStyle, ...(this.$attrs['extra-style'] || {}) };
        },
        elementStyle() {
            const style = {
                padding: this.style.padding || '0',
            };
            return style;
        },
        /*=============================================m_ÔÔ_m=============================================\
            STYLE HELPERS
        \================================================================================================*/
    },
    watch: {
        'style.transition'() {
            if (this.style.transition) {
                this.lastTransition = this.style.transition;
            }
        },
    },
    mounted() {
    },
    beforeUnmount() {
    },
    methods: {
        onTriggerEvent({ name, event } = {}) {
            this.executeWorkflows(name, event);
        },
    },
};
</script>

<style scoped lang="scss">
.ww-object {
    transition: max-height 0.3s ease, opacity 0.5s ease, transform 0.5s ease;
    position: relative;
    box-sizing: border-box;
    display: flex;
    min-height: 5px;
    min-width: 5px;
    pointer-events: all;

    &-elem {
        position: relative;
        text-align: initial;
        width: 100%;
        height: 100%;
    }

}

.ww-link {
    text-decoration: none;
    color: inherit;
}

</style>

<style lang="scss">
</style>
