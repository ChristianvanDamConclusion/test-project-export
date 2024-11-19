<template>
    <component
        :is="tag"
        class="ww-button"
        :class="{ button: tag }"
        :type="buttonType"
        :style="buttonStyle"
        :data-ww-flag="'btn-' + content.buttonType"
        :disabled="content.disabled"
    >
        <wwObject v-if="content.hasLeftIcon && content.leftIcon" v-bind="content.leftIcon"></wwObject>
        <wwEditableText
            class="ww-button__text"
            :disabled="!canEditText"
            :model-value="content.text"
            :text-style="textStyle"
            :sanitize="content.sanitize"
            @update:modelValue="updateText"
        ></wwEditableText>
        <wwObject v-if="content.hasRightIcon && content.rightIcon" v-bind="content.rightIcon"></wwObject>
    </component>
</template>

<script>
const TEXT_ALIGN_TO_JUSTIFY = {
    center: 'center',
    right: 'flex-end',
    left: 'flex-start',
    justify: 'center',
};
export default {
    props: {
        content: { type: Object, required: true },
        wwFrontState: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: [
        'update:content',
        'update:content:effect',
        'change-menu-visibility',
        'change-borders-style',
        'add-state',
        'remove-state',
    ],
    computed: {
        canEditText() {
            /* wwFront:start */
            // eslint-disable-next-line no-unreachable
            return false;
            /* wwFront:end */
        },
        textStyle() {
            return {
                ...(this.content.font
                    ? {
                          fontSize: 'unset',
                          fontFamily: 'unset',
                          lineHeight: 'unset',
                          fontWeight: 'unset',
                          font: this.content.font,
                      }
                    : {
                          fontSize: this.content.fontSize,
                          fontFamily: this.content.fontFamily,
                          lineHeight: this.content.lineHeight,
                          fontWeight: this.content.fontWeight,
                      }),
                textAlign: this.content.textAlign,
                color: this.content.color,
                backgroundColor: this.content.backgroundColor,
                textTransform: this.content.textTransform,
                textShadow: this.content.textShadow,
                letterSpacing: this.content.letterSpacing,
                wordSpacing: this.content.wordSpacing,
                textDecoration: this.content.textDecoration,
                textDecorationStyle: this.content.textDecorationStyle,
                textDecorationColor: this.content.textDecorationColor,
                overflow: this.content.nowrap ? 'hidden' : 'initial',
                whiteSpace: this.content.nowrap ? 'nowrap' : 'initial',
                textOverflow: this.content.ellipsis ? 'ellipsis' : 'initial',
            };
        },
        buttonStyle() {
            return {
                justifyContent: TEXT_ALIGN_TO_JUSTIFY[this.content.textAlign] || 'center',
            };
        },
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        tag() {
            if (this.isEditing) return 'div';
            if (
                this.content.buttonType === 'submit' ||
                this.content.buttonType === 'reset' ||
                this.content.buttonType === 'button'
            )
                return 'button';
            return 'div';
        },
        buttonType() {
            if (this.isEditing) return '';
            if (
                this.content.buttonType === 'submit' ||
                this.content.buttonType === 'reset' ||
                this.content.buttonType === 'button'
            )
                return this.content.buttonType;
            return '';
        },
    },
    watch: {
        'content.disabled': {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'disabled');
                } else {
                    this.$emit('remove-state', 'disabled');
                }
            },
        },
    },
    methods: {
        updateText(text) {
            this.$emit('update:content', { text });
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-button {
    display: flex;
    justify-content: center;
    align-items: center;
    &.button {
        outline: none;
        border: none;
        background: none;
        font-family: inherit;
        font-size: inherit;
    }
}
</style>
