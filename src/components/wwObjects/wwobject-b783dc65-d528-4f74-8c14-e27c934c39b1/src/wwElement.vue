<template>
    <wwLayout
        class="ww-flexbox"
        path="children"
        :direction="content.direction"
        :style="style"
        :inherit-from-element="inheritFromElement"
        :disable-edit="isFixed"
        ww-responsive="wwLayout"
    >
        <template #default="{ item, index }">
            <wwElement
                v-bind="item"
                :extra-style="getItemStyle(index)"
                class="ww-flexbox__object"
                :ww-responsive="`wwobject-${index}`"
                @click="onElementClick(item.uid, index)"
            ></wwElement>
        </template>
    </wwLayout>
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    provide: {
        __wwIsFlexboxChild: true,
    },
    emits: ['update:content:effect', 'update:content', 'element-event'],
    data() {
        return {
            inheritFromElement: ['width', 'display'],
        };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        style() {
            return {
                flexDirection: this.content.direction,
                justifyContent: this.content.justifyContent,
                alignItems: this.content.alignItems,
                rowGap: this.content.rowGap,
                columnGap: this.content.columnGap,
                flexWrap:
                    this.content.direction === 'column'
                        ? 'nowrap'
                        : this.content.flexWrap === false
                        ? 'nowrap'
                        : 'wrap',
            };
        },
        children() {
            if (!this.content.children || !Array.isArray(this.content.children)) {
                return [];
            }
            return this.content.children;
        },
        isFixed() {
            return this.wwElementState.props.isFixed;
        },
    },
    watch: {
    },
    methods: {
        getItemStyle(index) {
            const style = {};

            //Reverse
            if (this.content.reverse) {
                style.order = this.children.length - 1 - index;
            } else {
                style.order = index;
            }

            //Push last
            if (this.content.pushLast) {
                const push = !this.content.reverse ? index === this.children.length - 1 : index === 0;
                if (push) {
                    if (this.content.direction === 'column') {
                        style.marginTop = 'auto';
                    } else {
                        style.marginLeft = 'auto';
                    }
                }
            }

            return style;
        },
        onElementClick(uid, index) {
            this.$emit('element-event', { type: 'click', uid, index });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-flexbox {
    display: flex;
}
</style>
