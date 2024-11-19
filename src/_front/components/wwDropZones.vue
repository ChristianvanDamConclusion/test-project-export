<template>
    <div
        v-if="!wwLayoutOptions_.disableDragDrop"
        class="ww-object__drop-helper start"
        :class="[direction, { active: activeBefore, 'show-drop': hasDragging, centered }]"
        :layoutId="wwLayoutContext_.layoutId"
        :index="wwLayoutItemContext_.index"
    ></div>
    <div
        v-if="
            !wwLayoutOptions_.disableDragDrop && !centered && wwLayoutItemContext_.index === wwLayoutContext_.lastIndex
        "
        class="ww-object__drop-helper end"
        :class="[direction, { active: activeAfter, 'show-drop': hasDragging, centered }]"
        :layoutId="wwLayoutContext_.layoutId"
        :index="wwLayoutItemContext_.index + 1"
    ></div>
</template>

<script>
import { inject, computed } from 'vue';
import { mapGetters } from 'vuex';

export default {
    props: {
        wwLayoutContext: { type: Object, default: () => ({}) },
        centered: { type: Boolean, default: false },
    },
    setup(props) {
        const wwLayoutOptions = inject('wwLayoutOptions', {});
        const wwLayoutItemContext = inject('wwLayoutItemContext', null);

        const wwLayoutContext_ = computed(() => {
            return props.wwLayoutContext || {};
        });
        const wwLayoutOptions_ = computed(() => {
            return wwLayoutOptions || {};
        });
        const wwLayoutItemContext_ = computed(() => {
            return wwLayoutItemContext || {};
        });

        return { wwLayoutContext_, wwLayoutOptions_, wwLayoutItemContext_ };
    },
    data() {
        return {
            activeBefore: false,
            activeAfter: false,
        };
    },
    computed: {
        ...mapGetters({
            draggingObject: 'manager/getDraggingObject',
        }),
        hasDragging() {
            if (!this.wwLayoutContext_ || this.wwLayoutContext_.isBound) return false;
            return this.draggingObject.uid;
        },
        direction() {
            if (!this.wwLayoutContext_) return 'column';
            return this.wwLayoutContext_.direction || 'column';
        },
    },
    watch: {
        hasDragging(newHasDragging, oldHasDragging) {
            if (newHasDragging !== oldHasDragging) {
                this.setDropClasses(this.draggingObject.targetLayout.id, this.draggingObject.targetLayout.index);
            }
        },
        'draggingObject.targetLayout.id'(newId, oldId) {
            if (newId !== oldId) {
                this.setDropClasses(newId, this.draggingObject.targetLayout.index);
            }
        },
        'draggingObject.targetLayout.index'(newIndex, oldIndex) {
            if (newIndex !== oldIndex) {
                this.setDropClasses(this.draggingObject.targetLayout.id, newIndex);
            }
        },
    },
    methods: {
        setDropClasses(layoutId, index) {
            if (layoutId !== this.wwLayoutContext_.layoutId) {
                this.activeBefore = false;
                this.activeAfter = false;
            } else if (index === this.wwLayoutItemContext_.index || this.wwLayoutContext_.length === 0) {
                this.activeBefore = true;
                this.activeAfter = false;
            } else if (
                index > this.wwLayoutItemContext_.index &&
                this.wwLayoutItemContext_.index === this.wwLayoutContext_.lastIndex
            ) {
                this.activeBefore = false;
                this.activeAfter = true;
            } else {
                this.activeBefore = false;
                this.activeAfter = false;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
$thickness: 2px;
$thicknessActive: 6px;
.ww-object__drop-helper {
    z-index: 2;
    opacity: 0;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: 0.3s ease;

    &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: var(--ww-color-green-200);
        opacity: 1;
        z-index: 11;
        border-radius: 10px;
        transform: translate(-50%, -50%);
    }

    &.column {
        left: 50%;
        width: 100%;
        min-width: 50px;
        height: $thickness;
        &:before {
            width: 100%;
        }

        &.active {
            width: calc(100% + 20px);
            height: $thicknessActive;
            border-radius: 10px;
            &:before {
                background-color: var(--ww-color-green-400);
                height: 100%;
            }
        }
        &.start {
            top: 0;
        }
        &.end {
            top: calc(100% - 1px);
        }
        &.centered {
            top: 50%;
        }
    }

    &.row {
        top: 50%;
        height: 100%;
        min-height: 40px;
        width: $thickness;
        &:before {
            height: 100%;
        }

        &.active {
            height: calc(100% + 20px);
            width: $thicknessActive;
            border-radius: 10px;

            &:before {
                background-color: var(--ww-color-green-400);
                width: 100%;
            }
        }
        &.start {
            left: 0;
        }
        &.end {
            left: calc(100% - 1px);
        }
        &.centered {
            left: 50%;
        }
    }

    &.show-drop {
        opacity: 1 !important;
    }
}
</style>
