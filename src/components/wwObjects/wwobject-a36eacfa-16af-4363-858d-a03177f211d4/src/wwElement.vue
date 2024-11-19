<template>
    <Multiselect
        v-if="!isReadonly"
        ref="select"
        v-model="internalValue"
        class="ww-input-select"
        :style="cssVariables"
        :class="{ editing: isEditing }"
        :options="options"
        :close-on-select="content.closeOnSelect"
        :searchable="content.searchable"
        mode="single"
        :disabled="content.disabled"
        :hide-selected="content.hideSelected"
        :placeholder="placeholder"
        :create-option="content.allowCreation"
        :can-clear="content.clearIcon"
        :can-deselect="content.canDeselect"
        :caret="content.caretIcon"
        :name="wwElementState.name"
    >
        <!-- Placeholder -->
        <template v-if="placeholder.length" #placeholder>
            <wwElement
                class="multiselect-placeholder-el"
                v-bind="content.placeholderElement"
                :ww-props="{ text: placeholder || '' }"
            />
        </template>

        <!-- Tag selected with remove icon -->
        <template #singlelabel="{ value }">
            <div class="multiselect-single-label" :style="value.style || defaultOptionStyle">
                <wwLayoutItemContext :index="value => getValueIndex(value)" :item="{}" is-repeat :data="value">
                    <!-- <wwElement
                        class="multiselect-single-label-el"
                        v-bind="content.optionElementSelected"
                        :wwProps="{ text: value.label }"
                    /> -->
                    <wwText class="multiselect-single-label-el" :text="value.label || ''"></wwText>
                </wwLayoutItemContext>
            </div>
        </template>

        <!-- Tag unselected in list -->
        <template #option="{ option }">
            <wwLayoutItemContext :index="option => getOptionIndex(option)" :item="{}" is-repeat :data="option">
                <wwElement
                    class="multiselect-single-label-el"
                    v-bind="content.optionElement"
                    :ww-props="{ text: option.label || '' }"
                />
            </wwLayoutItemContext>
        </template>

        <!-- Small triangle displayed on the right of the input -->
        <template #caret>
            <wwElement v-bind="content.caretIconElement" />
        </template>

        <!-- Clear icon shown when the input has at least one selected options -->
        <template #clear="{ clear }">
            <wwElement v-bind="content.clearIconElement" @mousedown.prevent="isEditing ? null : clear($event)" />
        </template>
    </Multiselect>
    <wwText v-else :text="valueLabel"></wwText>
</template>

<script>
import Multiselect from '@vueform/multiselect';

const DEFAULT_LABEL_FIELD = 'label';
const DEFAULT_VALUE_FIELD = 'value';

export default {
    components: { Multiselect },
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        wwElementState: { type: Object, required: true },
    },
    emits: ['trigger-event', 'update:content:effect', 'add-state', 'remove-state'],
    setup(props) {
        const { value: currentSelection, setValue: setCurrentSelection } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'value',
            type: 'string',
            defaultValue: props.content.initialValue ? props.content.initialValue : '',
        });

        return { currentSelection, setCurrentSelection };
    },
    data: () => ({
        options: [],
    }),
    computed: {
        isEditing() {
            // eslint-disable-next-line no-unreachable
            return false;
        },
        internalValue: {
            get() {
                if (this.content.allowCreation) {
                    // we need to make available custom options before using them
                    if (this.currentSelection && !this.options.some(option => option.value === this.currentSelection)) {
                        this.options.push(this.formatOption(this.currentSelection));
                    }
                }

                return this.currentSelection;
            },
            set(value) {
                this.setCurrentSelection(value);
            },
        },
        placeholder() {
            return wwLib.wwLang.getText(this.content.placeholder);
        },
        valueLabel() {
            const _option = this.options.find(option => option.value === this.internalValue);
            return _option ? _option.label : this.internalValue;
        },
        defaultOptionStyle() {
            return {
                backgroundColor: this.content.optionsDefaultBgColor,
                color: this.content.optionsDefaultTextColor,
            };
        },
        cssVariables() {
            return {
                '--ms-dropdown-bg': this.content.dropdownBackgroundColor,
                '--ms-dropdown-border-width': this.content.dropdownBorderWidth,
                '--ms-dropdown-border-color': this.content.dropdownBorderColor,
                '--ms-dropdown-radius': this.content.dropdownBorderRadius,
                '--ms-max-height': this.content.dropdownMaxHeight || '10rem',
                '--ms-option-bg-pointed': this.content.optionBackgroundPointed,
                '--ms-option-bg-selected': this.content.optionBackgroundSelected,
                '--ms-option-bg-selected-pointed': this.content.optionBackgroundSelectedPointed,
            };
        },
        isReadonly() {
            return this.wwElementState.props.readonly === undefined
                ? this.content.readonly
                : this.wwElementState.props.readonly;
        },
    },
    watch: {
        isEditing() {
            this.handleOpening(this.content.isOpen);
        },
        currentSelection(value) {
            this.$emit('trigger-event', { name: 'change', event: { domEvent: {}, value } });
        },
        textStyle() {
            return wwLib.getTextStyleFromContent(this.content);
        },
        async 'content.initialValue'() {
            this.init();

            // await to avoid mismatch (multiselect not rendering custom tags)
            await this.$nextTick();
            this.internalValue = this.content.initialValue;
        },
        'content.options'() {
            this.init();
        },
        isReadonly: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'readonly');
                } else {
                    this.$emit('remove-state', 'readonly');
                }
            },
        },
    },
    created() {
        this.init();
    },
    mounted() {
        this.handleOpening(this.content.isOpen);
    },
    methods: {
        async init() {
            // reset selection and option to avoid mismatch
            this.options = [];
            const initialOptions = Array.isArray(this.content.options) ? [...this.content.options] : [];
            this.options.push(...initialOptions.map(option => this.formatOption(option)));

            // add initial values as custom options if not already included
            if (
                this.content.initialValue !== undefined &&
                this.content.allowCreation &&
                !this.options.some(
                    option => option === this.content.initialValue || option.value === this.content.initialValue
                )
            ) {
                this.options.push(this.formatOption(this.content.initialValue));
            }
        },

        getValueIndex(value) {
            return this.options.findIndex(option => option.value === value.value);
        },
        getOptionIndex(option) {
            return this.options.indexOf(option);
        },
        formatOption(option) {
            const labelField = this.content.labelField || DEFAULT_LABEL_FIELD;
            const valueField = this.content.valueField || DEFAULT_VALUE_FIELD;

            return typeof option === 'object'
                ? {
                      label: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(option, labelField)),
                      value: wwLib.resolveObjectPropertyPath(option, valueField),
                      style: {
                          backgroundColor:
                              wwLib.resolveObjectPropertyPath(option, 'bgColor') || this.content.optionsDefaultBgColor,
                          color:
                              wwLib.resolveObjectPropertyPath(option, 'textColor') ||
                              this.content.optionsDefaultTextColor,
                      },
                  }
                : {
                      // to allow flat array / option
                      label: option,
                      value: option,
                  };
        },
        handleOpening(value) {
            if (this.$refs.select) {
                if (value) this.$refs.select.open();
                else this.$refs.select.close();
            }
        },
    },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss" scoped>
/* We need to use multiselect classname  */
.ww-input-select {
    --ms-bg: transparent;

    --ms-border-width: 0px;
    position: relative;
    min-height: calc(var(--font-size) + 20px);

    &.is-active {
        box-shadow: unset;
    }

}
.ww-input-select::v-deep .multiselect-single-label {
    position: relative !important;
    line-height: inherit !important;
    padding: 0px !important;
    width: 100%;
}
.ww-input-select::v-deep .multiselect-placeholder-el {
    flex-grow: 1;
}
</style>
