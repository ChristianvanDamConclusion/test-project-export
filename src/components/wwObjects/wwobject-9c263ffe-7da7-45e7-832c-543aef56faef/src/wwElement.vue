<template>
    <input
        class="ww-text-input"
        :class="{ editing: isEditing }"
        :style="cssVariables"
        type="text"
        :placeholder="wwLang.getText(content.placeholder)"
        :value="internalValue"
        @input="handleInput"
    />
</template>

<script>
export default {
    props: {
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['element-event'],
    data() {
        return {
            internalValue: this.wwElementState.props.value || '',
            lastDebounceValue: null,
        };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        cssVariables() {
            return {
                '--input-color': this.content.color,
                '--input-fontFamily': this.content.fontFamily,
                '--input-fontSize': this.content.fontSize,
            };
        },
        value() {
            return this.wwElementState.props.value || '';
        },
        delay() {
            return this.wwElementState.props.delay || 0;
        },
    },
    watch: {
        value(value) {
            if (value === this.lastDebounceValue) {
                this.lastDebounceValue = null;
            } else {
                this.internalValue = value;
                this.$emit('element-event', { type: 'change', value });
            }
        },
    },
    methods: {
        handleInput(event) {
            this.internalValue = event.target.value;
            this.$emit('element-event', { type: 'change', value: event.target.value });
            if (this.debounce) {
                clearTimeout(this.debounce);
            }
            this.debounce = setTimeout(() => {
                this.lastDebounceValue = event.target.value;
                this.$emit('element-event', { type: 'debounce', value: this.lastDebounceValue });
            }, this.delay);
        },
    },
};
</script>

<style lang="scss" scoped>
.ww-text-input {
    width: 100%;
    outline: none;
    font-family: var(--input-fontFamily);
    color: var(--input-color);
    font-size: var(--input-fontSize);
    border: none;
    background-color: inherit;
    border-radius: inherit;
    &::placeholder {
        color: var(--input-color);
        opacity: 0.7;
    }
}
</style>
