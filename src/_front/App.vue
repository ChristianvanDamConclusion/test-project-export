<template>
    <router-view />
</template>

<script>
export default {
    /* wwFront:start */
    mounted() {
        if (window.__WW_IS_PRERENDER__) {
            window.$rootNode = this;
        }
    },
    /* wwFront:end */
};
</script>
