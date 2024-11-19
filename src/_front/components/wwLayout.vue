<template>
    <component
        :is="tag"
        class="ww-layout"
        :data-ww-layout-id="layoutId"
        :class="{}"
    >
        <template v-if="internalList[0]">
            <wwLayoutItemContext
                v-for="index in restrictedLength"
                :key="isBound ? `${internalList[0].uid}_${index - 1}` : `${internalList[index - 1].uid}`"
                :index="offset + index - 1"
                :item="isBound ? internalList[0] : internalList[index - 1]"
                :is-repeat="isBound"
                :data="isBound && boundData ? boundData[offset + index - 1] : null"
                :repeated-items="boundData"
            >
                <slot
                    v-bind="{
                        item: isBound ? internalList[0] : internalList[index - 1],
                        index: offset + index - 1,
                        data: isBound && boundData ? boundData[offset + index - 1] : null,
                        layoutId,
                    }"
                >
                    <wwElement v-bind="isBound ? internalList[0] : internalList[index - 1]"></wwElement>
                </slot>
            </wwLayoutItemContext>
        </template>
    </component>
</template>

<script>
import { computed, inject, toRef, reactive, provide, onUnmounted } from 'vue';
import get from 'lodash.get';

import { useParentContentProperty } from '@/_common/use/useComponent';

import wwLayoutItem from './wwLayoutItem';
import wwLayoutItemContext from './wwLayoutItemContext';


let layoutId = 1;
const MAX_REPEAT = 200;

export default {
    name: 'wwLayout',
    components: {
        wwLayoutItem,
        wwLayoutItemContext,
    },
    provide() {
        return {
            // We keep it even in front mode, because its a way to know if we are a wwLayout direct child
            wwLayoutDirectParent: {
            },
            wwLayoutContext: computed(() => ({
                layoutId: this.layoutId,
                direction: this.direction,
                offset: this.offset,
                lastIndex: this.offset + this.restrictedLength - 1,
                inheritFromElement: this.inheritFromElement,
                isBound: this.isBound,
            })),
        };
    },
    props: {
        path: { type: String, required: false, default: undefined },
        tag: { type: String, default: 'div' },
        direction: { type: String, default: 'column' },
        inheritFromElement: { type: Array, default: () => [] },
        disableDragDrop: { type: Boolean, default: false },
        disableEdit: { type: Boolean, default: false },
    },
    emits: ['update:list'],
    setup(props) {
        const id = layoutId++;
        const objectId = inject('objectId', null);
        const sectionId = inject('sectionId');
        const bindingContext = inject('bindingContext', null);

        const { rawProperty, property, setProperty } = useParentContentProperty(toRef(props, 'path'));

        const isBound = computed(() => rawProperty.value && !!rawProperty.value.__wwtype);
        const boundData = computed(() => {
            if (!isBound.value) return null;
            if (!property.value) return null;
            if (Array.isArray(property.value)) {
                return property.value;
            }
            if (!property.value.data) {
                return null;
            }
            return Array.isArray(property.value.data) ? property.value.data : null;
        });
        const internalList = computed(() => {
            const { __wwtype, repeatable } = rawProperty.value || {};
            return (__wwtype ? repeatable : property.value) || [];
        });
        const hasBindValue = computed(() => {
            return isBound.value && !!rawProperty.value.code;
        });
        const paginationOptions = computed(() => {
            if (!isBound.value) return null;
            if (!property.value) return null;
            if (Array.isArray(property.value)) {
                return null;
            }
            if (!property.value.limit) return null;
            if (!property.value.total) return null;
            return property.value;
        });
        const offset = computed(() => {
            if (paginationOptions.value) return parseInt(paginationOptions.value.offset) || 0;
            return 0;
        });
        const length = computed(() => {
            if (!isBound.value) {
                return internalList.value.length;
            }
            if (paginationOptions.value) {
                if (!boundData.value) {
                    return 0;
                } else {
                    const maxIndex = Math.min(
                        offset.value + paginationOptions.value.limit,
                        paginationOptions.value.total || 0
                    );
                    const length = Math.max(maxIndex - offset.value, 0);
                    return isNaN(length) ? 0 : length;
                }
            }
            return boundData.value ? boundData.value.length : 0;
        });


        return {
            layoutId: id,
            objectId,
            sectionId,
            rawProperty,
            property,
            setProperty,
            bindingContext,
            isBound,
            boundData,
            length,
            internalList,
            offset,
            paginationOptions,
        };
    },
    computed: {
        restrictedLength() {
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return this.length;
            /* wwFront:end */
        },
    },

    watch: {
    },
    methods: {
    },
};
</script>

<style lang="scss">
/* No Scoped css to be easily overwrite */
.ww-layout {
    display: flex;
    min-width: 20px;
    pointer-events: all;

    &__placeholder {
        position: relative;
        width: 100%;
        height: 30px;

        &:after {
            content: '';
            border: 1px dashed var(--ww-color-dark-700);
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
        }
    }

    &__borders {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border: 2px solid var(--ww-color-green-500);
        background-color: var(--ww-color-green-100);
        opacity: 0.1;
        pointer-events: none;
    }

    &.ww-layout-target {
        &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
            border: 3px dashed var(--ww-color-green-50);
            // background-color: rgba(171, 245, 209, 0.3);
            opacity: 0.6;
            border-radius: 10px;
        }
    }
}
</style>

<style lang="scss" scoped>
</style>
