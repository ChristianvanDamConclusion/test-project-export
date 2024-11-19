<template>
    <td>
        <div class="ww-data-grid-action-cell">
            <!-- wwFront:start -->
            <template v-if="false"></template>
            <!-- wwFront:end -->
            <template v-else>
                <wwElement
                    :class="{ 'hide-container': edit }"
                    v-bind="editContainer"
                    :ww-props="{ isFixed: true }"
                    @element-event="onEditContainerEvent"
                    @update:is-selected="onIsEditContainerSelected"
                    @update:child-selected="onIsEditContainerSelected"
                ></wwElement>
                <wwElement
                    :class="{ 'hide-container': !edit }"
                    v-bind="editingContainer"
                    :ww-props="{ isFixed: true }"
                    @element-event="onEditingContainerEvent"
                    @update:is-selected="onIsEditingContainerSelected"
                    @update:child-selected="onIsEditingContainerSelected"
                ></wwElement>
            </template>
        </div>
    </td>
</template>

<script>
export default {
    props: {
        id: { type: undefined, required: true },
        editContainer: { type: Object, required: true },
        editingContainer: { type: Object, required: true },
        edit: { type: Boolean, default: false },
    },
    emits: ['update:edit', 'validate', 'delete', 'cancel'],
    methods: {
        onEditContainerEvent(event) {
            if (event.type === 'click') {
                if (event.index === 0) {
                    // Edit button
                    this.$emit('update:edit', !this.edit);
                } else {
                    this.$emit('delete');
                }
            }
        },
        onEditingContainerEvent(event) {
            if (event.type === 'click') {
                if (event.index === 0) {
                    this.$emit('validate');
                } else {
                    this.$emit('cancel');
                }
            }
        },
        onIsEditContainerSelected(event) {
            if (event && this.edit) {
                this.$emit('update:edit', false);
            }
        },
        onIsEditingContainerSelected(event) {
            if (event && !this.edit) {
                this.$emit('update:edit', true);
            }
        },
    },
};
</script>

<style>
.ww-data-grid-action-cell > .hide-container {
    display: none !important;
}
</style>
<style lang="scss" scoped>
</style>
