<template>
    <div v-if="!componentName" class="ww-object-loader">
        <b class="ww-object-error" @click="inspect">ELEM UNDEF</b>
    </div>
    <div v-else-if="!isComponentReady" class="ww-object-loader">
        <wwEditorIcon name="download" />
    </div>
    <slot v-else></slot>
</template>

<script>
import { computed } from 'vue';
import {
    useNormalized,
    setNormalized,
    getHasTriggeredNormalized,
    setHasTriggeredNormalized,
} from '@/_common/use/useNormalized';
import { normalizeContent } from '@/helpers/normalize';
import { getComponentName, getComponentConfiguration } from '@/_common/helpers/component/component';
import { initComponentData } from '@/_common/use/useComponent';

export default {
    inject: {
        parentSectionId: { from: 'sectionId', default: null },
    },
    props: {
        uid: { type: String, required: true },
        type: { type: String, required: true },
    },
    setup(props) {
        const isNormalized = useNormalized(props.type, props.uid);
        const componentName = getComponentName(props.type, props.uid);
        const isComponentRegistered = computed(() =>
            wwLib.$store.getters['manager/isComponentRegistered'](componentName)
        );
        return {
            isNormalized,
            isComponentRegistered,
            componentName,
        };
    },
    data() {
        return { isContentInitialize: false };
    },
    computed: {
        isComponentReady() {
            return this.isNormalized && this.isComponentRegistered && this.isContentInitialize;
        },
        configuration() {
            return getComponentConfiguration(this.type, this.uid);
        },
        sectionId() {
            if (this.type === 'section') {
                return this.uid;
            } else {
                return this.parentSectionId;
            }
        },
    },
    watch: {
        isComponentReady() {
            if (this.isComponentReady) this.$nextTick(() => this.$store.dispatch('manager/readyComponent', this.uid));
        },
        isComponentRegistered: {
            immediate: true,
            async handler(isRegistered, oldIsRegistered) {
                if (isRegistered === oldIsRegistered) return;
                if (!isRegistered) {
                    wwLib.wwAsyncScripts.loadComponent(this.componentName, this.type);
                } else {
                    await this.normalizeContent();
                    initComponentData({ type: this.type, uid: this.uid });
                    this.isContentInitialize = true;
                }
            },
        },
    },
    methods: {
        async normalizeContent() {
            if (getHasTriggeredNormalized(this.type, this.uid)) {
                return;
            }
            setHasTriggeredNormalized(this.type, this.uid, true);
            let content;
            if (this.type === 'element') {
                content = this.$store.getters['websiteData/getWwObjectContent'](this.uid);
            } else {
                content = this.$store.getters['websiteData/getSectionContent'](this.uid);
            }
            content = content || {};

            const update = await normalizeContent(content, this.configuration.properties, this.sectionId);
            await this.updateRootContent(update, true);
            setNormalized(this.type, this.uid, true);
        },
        async updateRootContent(newContent) {
            if (this.type === 'element') {
                await wwLib.$store.dispatch('websiteData/updateWwObjectRawContent', {
                    wwObjectId: this.uid,
                    newContent,
                    noHistory: true,
                });
            } else {
                wwLib.wwSectionHelper.updateRootContent(this.uid, newContent, true);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
</style>
