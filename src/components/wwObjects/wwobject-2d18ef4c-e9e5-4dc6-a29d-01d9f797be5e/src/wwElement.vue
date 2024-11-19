<template>
    <Multiselect
        ref="multiselect"
        v-model="internalValue"
        class="input-multiselect"
        :style="cssVariables"
        :class="{ editing: isEditing }"
        :options="options"
        :close-on-select="content.closeOnSelect"
        :searchable="content.searchable"
        :mode="content.mode"
        :disabled="isReadOnly || content.disabled"
        :hideSelected="content.hideSelected"
        :placeholder="placeholder"
        :create-option="content.allowCreation"
        :canClear="content.clearIcon && !isReadOnly"
        :caret="content.caretIcon && !isReadOnly"
    >
        <!-- Placeholder -->
        <template v-slot:placeholder v-if="placeholder.length">
            <wwElement
                class="multiselect-placeholder-el"
                v-bind="content.placeholderElement"
                :wwProps="{ text: placeholder }"
            />
        </template>

        <!-- Tag selected with remove icon -->
        <template v-slot:tag="{ option, handleTagRemove }">
            <div class="multiselect-tag" :style="option.style || defaultTagStyle">
                <wwLayoutItemContext :index="getOptionIndex(option)" :item="{}" is-repeat :data="option">
                    <wwElement
                        class="multiselect-tag-el"
                        v-bind="content.tagElementSelected"
                        :wwProps="{ text: option.label }"
                    />
                    <wwElement
                        v-if="!isReadOnly"
                        @mousedown.prevent="isEditing ? null : handleTagRemove(option, $event)"
                        v-bind="content.removeTagIconElement"
                    />
                </wwLayoutItemContext>
            </div>
        </template>

        <!-- Tag unselected in list -->
        <template v-if="content.mode === 'tags'" v-slot:option="{ option }">
            <wwLayoutItemContext :index="getOptionIndex(option)" :item="{}" is-repeat :data="option">
                <wwElement class="multiselect-tag-el" v-bind="content.tagElement" :wwProps="{ text: option.label }" />
            </wwLayoutItemContext>
        </template>

        <!-- Small triangle displayed on the right of the input -->
        <template v-slot:caret v-if="!isReadOnly">
            <wwElement v-bind="content.caretIconElement" />
        </template>

        <!-- Clear icon shown when the input has at least one selected options -->
        <template v-slot:clear="{ clear }">
            <wwElement v-bind="content.clearIconElement" @mousedown.prevent="isEditing ? null : clear($event)" />
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import { computed } from 'vue';

const DEFAULT_LABEL_FIELD = 'label';
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_TEXT_COLOR_FIELD = 'textColor';
const DEFAULT_BG_COLOR_FIELD = 'bgColor';

export default {
    components: { Multiselect },
    emits: ['trigger-event', 'update:content:effect', 'add-state', 'remove-state'],
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },

        wwElementState: { type: Object, required: true },
    },
    setup(props, { emit }) {
        const { value: currentSelection, setValue: setCurrentSelection } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentSelection',
            type: 'array',
            defaultValue: computed(() => (Array.isArray(props.content.initialValue) ? props.content.initialValue : [])),
        });
        return { currentSelection, setCurrentSelection };
    },
    data: () => ({
        options: [],
    }),
    created() {
        this.init();
    },
    computed: {
        isEditing() {

            // eslint-disable-next-line no-unreachable
            return false;
        },
        internalValue: {
            get() {
                if (this.content.allowCreation) {
                    // we need to make available custom options before using them
                    for (const selection of this.currentSelection) {
                        if (!this.options.some(option => option.value === selection)) {
                            this.options.push(this.formatOption(selection));
                        }
                    }
                }
                return Array.isArray(this.currentSelection) ? this.currentSelection : [];
            },
            set(newValue, oldValue) {
                if (newValue === oldValue) return;
                this.setCurrentSelection(newValue);
                this.$emit('trigger-event', { name: 'change', event: { domEvent: {}, value: newValue } });
            },
        },
        placeholder() {
            return wwLib.wwLang.getText(this.content.placeholder);
        },
        defaultTagStyle() {
            return {
                backgroundColor: this.content.tagsDefaultBgColor,
                color: this.content.tagsDefaultTextColor,
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
                '--ms-bg-disabled': this.isReadOnly ? 'transparent' : null,
                '--ms-bg': 'transparent',
                '--ms-radius': '0',
                '--search-font-size': this.content.searchFontSize || 'inherit',
                '--search-font-family': this.content.searchFontFamily || 'inherit',
                '--search-font-color': this.content.searchFontColor || 'inherit',
            };
        },
        isReadOnly() {

            return this.wwElementState.props.readonly === undefined
                ? this.content.readonly
                : this.wwElementState.props.readonly;
        },
    },
    watch: {
        isEditing() {
            this.handleOpening(this.content.isOpen);
        },
        'content.initialValue'() {
            this.refreshInitialValue();
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: this.content.initialValue } });
        },
        'content.options'() {
            this.refreshOptions();
        },
        'content.labelField'() {
            this.refreshOptions();
        },
        'content.valueField'() {
            this.refreshOptions();
        },
        'content.bgColorField'() {
            this.refreshOptions();
        },
        'content.textColorField'() {
            this.refreshOptions();
        },
        isReadOnly: {
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
    methods: {
        init() {
            const initialOptions = Array.isArray(this.content.options) ? [...this.content.options] : [];
            this.options.push(...initialOptions.map(option => this.formatOption(option)));

            if (this.content.initialValue !== undefined) {
                // add initial values as custom options if not already included
                const initialValue = Array.isArray(this.content.initialValue) ? [...this.content.initialValue] : [];
                this.options.push(
                    ...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection))
                );
                // We set internalValue after the options to avoid mismatch
                this.internalValue = initialValue;
            }
        },
        /**
         * We need to avoid to have a value not present in options
         * So here we take care of not removing an used option
         */
        refreshOptions() {
            // we removed unused options
            this.options = this.options.filter(option => this.internalValue.includes(option.value));
            // Then we add the new initial options and avoid duplicate
            const initialOptions = Array.isArray(this.content.options) ? [...this.content.options] : [];
            const newOptions = initialOptions.filter(
                option => !this.options.some(currentOpt => currentOpt.value === option.value)
            );
            this.options.push(...newOptions.map(option => this.formatOption(option)));
            // Then we add current selection as custom options if not already included
            this.options.push(
                ...this.internalValue.filter(selection => !this.options.map(option => option.value).includes(selection))
            );
        },
        refreshInitialValue() {
            const initialValue = Array.isArray(this.content.initialValue) ? [...this.content.initialValue] : [];
            this.options.push(
                ...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection))
            );

            this.setCurrentSelection(initialValue);
        },
        formatOption(option) {
            const labelField = this.content.labelField || DEFAULT_LABEL_FIELD;
            const valueField = this.content.valueField || DEFAULT_VALUE_FIELD;
            const bgColorField = this.content.bgColorField || DEFAULT_BG_COLOR_FIELD;
            const textColorField = this.content.textColorField || DEFAULT_TEXT_COLOR_FIELD;

            return typeof option === 'object'
                ? {
                      label: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(option, labelField)),
                      value: wwLib.resolveObjectPropertyPath(option, valueField),
                      style: {
                          backgroundColor:
                              wwLib.resolveObjectPropertyPath(option, bgColorField) || this.content.tagsDefaultBgColor,
                          color:
                              wwLib.resolveObjectPropertyPath(option, textColorField) ||
                              this.content.tagsDefaultTextColor,
                      },
                  }
                : {
                      // to allow flat array / option
                      label: option,
                      value: option,
                  };
        },
        handleOpening(value) {
            if (value) this.$refs.multiselect.open();
            else this.$refs.multiselect.close();
        },
        onTagSelected(isSelected) {
            if (isSelected) this.$refs.multiselect.open();
        },
        getOptionIndex(option) {
            return this.options.indexOf(option);
        },
    },
    mounted() {
        this.handleOpening(this.content.isOpen);
    },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss" scoped>
.input-multiselect {
    --ms-border-width: 0px;

    position: relative;
    min-height: calc(var(--font-size) + 20px);

    &.is-active {
        box-shadow: unset;
    }


}
.input-multiselect::v-deep .multiselect-tag {
    padding: 4px;
    border-radius: 4px;
}
.input-multiselect::v-deep .multiselect-tags-search {
    background-color: transparent;
    font-size: var(--search-font-size);
    font-family: var(--search-font-family);
    color: var(--search-font-color);
}
.input-multiselect::v-deep .multiselect-caret {
    margin-top: 10px;
    margin-bottom: 10px;
}
.input-multiselect::v-deep .multiselect-dropdown {
    max-height: unset;
}
.input-multiselect::v-deep .multiselect-placeholder-el {
    position: absolute !important;
    top: 50% !important;
    left: 0px !important;
    transform: translateY(-50%);
}
</style>
