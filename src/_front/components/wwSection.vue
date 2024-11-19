<template>
    <!-- wwFront:start -->
    <wwSectionComponent :key="uid" :uid="uid" v-bind="$attrs"></wwSectionComponent>
    <!-- wwFront:end -->
</template>

<script>
import wwSectionComponent from '@/_front/components/wwSectionComponent';

/* wwFront:start */
import { initComponentData } from '@/_common/use/useComponent';
/* wwFront:end */

export default {
    name: 'wwSection',
    components: {
        wwSectionComponent,
    },
    inheritAttrs: false,
    props: {
        uid: { type: String, required: true },
    },
    /* wwFront:start */
    // DIRTY HACK SO VUE DO NOT CLEAN STUFF
    watch: {
        uid: {
            immediate: true,
            handler() {
                initComponentData({ type: 'section', uid: this.uid });
            },
        },
    },
    /* wwFront:end */
};
</script>
