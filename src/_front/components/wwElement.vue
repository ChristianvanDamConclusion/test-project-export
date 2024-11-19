<template>
        <wwElementComponent :key="uid" ref="elementComponent" :uid="uid" v-bind="$attrs"></wwElementComponent>
</template>

<script>
import wwElementComponent from '@/_front/components/wwElementComponent';

/* wwFront:start */
import { initComponentData } from '@/_common/use/useComponent';
/* wwFront:end */

export default {
    name: 'wwElement',
    components: {
        wwElementComponent,
    },
    inheritAttrs: false,
    props: {
        uid: { type: String, required: true },
    },
    computed: {
        componentRef() {
            if (this.$refs.elementComponent) {
                return this.$refs.elementComponent.$refs.component;
            } else {
                return null;
            }
        },
    },
    /* wwFront:start */
    // DIRTY HACK SO VUE DO NOT CLEAN STUFF
    watch: {
        uid: {
            immediate: true,
            handler() {
                initComponentData({ type: 'element', uid: this.uid });
            },
        },
    },
    /* wwFront:end */
};
</script>
