<template>
    <slot></slot>
</template>

<script>
import { provide, inject, reactive, computed } from 'vue';

export default {
    props: {
        index: { type: Number, required: true },
        item: { type: [Object, null], required: true },
        data: { type: undefined, required: true },
        isRepeat: { type: Boolean, default: false },
        repeatedItems: { type: [Array, null], default: null },
    },
    setup(props) {
        const parentBindingContext = inject('bindingContext', null);

        provide(
            'wwLayoutItemContext',
            reactive({
                index: computed(() => props.index),
                item: computed(() => props.item),
            })
        );

        // Normally we are ok doing this here, as key for isRepeat and not repeat item or not the same
        if (props.isRepeat) {
            const bindingContext = reactive({
                parent: parentBindingContext,
                data: computed(() => props.data),
                index: computed(() => props.index),
                repeatIndex: computed(() => {
                    return props.index;
                }),
                isACopy: computed(() => (parentBindingContext && parentBindingContext.isACopy) || props.index > 0),
                repeatedItems: computed(() => props.repeatedItems),
            });

            provide('bindingContext', bindingContext);
        }
    },
};
</script>
