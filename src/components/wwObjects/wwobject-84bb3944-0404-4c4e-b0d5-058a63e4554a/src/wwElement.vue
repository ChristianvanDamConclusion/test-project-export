<template>
    <div class="ww-webapp-search" :style="cssVariables" :class="{ editing: isEditing, selected: isSelected }">
        <div class="input-container">
            <wwElement
                v-if="content.isEmbedIcon && content.iconPosition === 'left'"
                class="embedIcon"
                v-bind="content.embedIcon"
            />
            <wwElement
                class="text-input"
                v-bind="content.textInput"
                :ww-props="{ value, delay }"
                :name="wwElementState.name"
                @element-event="handleInputChange"
                @keypress.enter="submit"
            />
            <wwElement
                v-if="content.isEmbedIcon && content.iconPosition === 'right'"
                class="embedIcon"
                v-bind="content.embedIcon"
            />
        </div>
        <div v-if="content.useSubmitButton" class="button-container">
            <wwElement class="submitButton" v-bind="content.submitButton" @click="submit" />
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';

export default {
    props: {
        content: { type: Object, required: true },
        uid: { type: String, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['update:content', 'trigger-event'],
    setup(props) {
        const { value: variableValue, setValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'string',
            defaultValue: computed(() => props.content.value === undefined ? '' : props.content.value),
        });
        return { variableValue, setValue };
    },
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        isSelected() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        cssVariables() {
            let flexDirection = 'row';
            if (this.content.buttonPosition === 'left' || this.content.buttonPosition === 'right') {
                if (this.content.buttonPosition === 'left') flexDirection = 'row-reverse';
                else flexDirection = 'row';
            } else {
                if (this.content.buttonPosition === 'top') flexDirection = 'column-reverse';
                else flexDirection = 'column';
            }

            const buttonWidthValue = 100 - wwLib.wwUtils.getLengthUnit(this.content.inputWidth)[0];
            const buttonWidth =
                this.content.buttonPosition === 'top' || this.content.buttonPosition === 'bottom'
                    ? '100%'
                    : buttonWidthValue.toString() + '%';

            return {
                '--container-direction': flexDirection,
                '--input-width': this.content.useSubmitButton ? this.content.inputWidth : '100%',
                '--button-width': buttonWidth,
            };
        },
        value() {
            return `${this.variableValue}`;
        },
        delay() {
            return wwLib.wwUtils.getLengthUnit(this.content.debounceDelay)[0];
        },
    },
    watch: {
        'content.value'(newValue) {
            newValue = `${newValue}`;
            if (newValue === this.value) return;
            this.setValue(newValue);
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: newValue } });
        },
    },
    methods: {
        handleInputChange({ type, value }) {
            if (value !== this.value) {
                this.setValue(value);
            }
            if (type === 'debounce') {
                this.$emit('trigger-event', { name: 'change', event: { value } });
            }
        },
        submit() {
            this.$emit('trigger-event', { name: 'submit', event: { value: this.value } });
        },
    },
};
</script>

<style lang="scss" scoped>
:root {
    --container-direction: row;
}
.ww-webapp-search {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: var(--container-direction);
    align-items: center;

    .input-container {
        width: var(--input-width);
        display: flex;
    }

    .button-container {
        width: var(--button-width);

        .submitButton {
            width: 100%;
        }
    }
}
</style>
