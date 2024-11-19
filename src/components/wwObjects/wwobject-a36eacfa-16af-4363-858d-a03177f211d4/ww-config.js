export default {
    editor: {
        label: {
            en: 'Input select',
            fr: 'Champs sélection',
        },
        icon: 'select',
        deprecated: 'Use a select input from the Elements panel instead of this one.',
        customStylePropertiesOrder: [
            ['optionsDefaultBgColor', 'optionsDefaultTextColor'],
            [
                'dropdownBackgroundColor',
                'optionBackgroundPointed',
                'optionBackgroundSelected',
                'optionBackgroundSelectedPointed',
                'dropdownBorderWidth',
                'dropdownBorderColor',
                'dropdownBorderRadius',
                'dropdownMaxHeight',
            ],
        ],
        customSettingsPropertiesOrder: [
            'readonly',
            'isOpen',
            ['initialValue', 'options'],
            ['placeholder'],
            ['disabled', 'mode', 'allowCreation', 'canDeselect', 'hideSelected', 'searchable', 'closeOnSelect'],
            ['clearIcon', 'caretIcon'],
            ['hintFields', 'labelField', 'valueField', 'textColorField', 'bgColorField'],
        ],
    },
    options: {
        noBorderRadiusClipping: true,
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: '' }, default: true }],
    inherit: { type: 'ww-text', exclude: ['text'] },
    properties: {
        readonly: {
            label: { en: 'Read only', fr: 'Lecture seule' },
            type: 'OnOff',
            section: 'settings',
            bindable: true,
            defaultValue: false,
            hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.readonly !== undefined),
        },
        isOpen: {
            type: 'OnOff',
            label: {
                en: 'Is open?',
                fr: 'Is open?',
            },
            defaultValue: false,
            bindable: true,
            section: 'settings',
        },
        placeholder: {
            label: {
                en: 'Placeholder',
                fr: 'Texte par défaut',
            },
            type: 'Text',
            defaultValue: { en: 'Placeholder' },
            section: 'settings',
            bindable: true,
            multiLang: true,
        },
        disabled: {
            label: {
                en: 'Disabled',
                fr: 'Désactivé',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
        },
        allowCreation: {
            label: {
                en: 'Allow to create option',
                fr: "Permettre la création d'option",
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
        },
        canDeselect: {
            label: {
                en: 'Can unselect',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        hideSelected: {
            label: {
                en: 'Hide selected elements',
                fr: 'Cacher les éléments sélectionnés',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        searchable: {
            label: {
                en: 'Searchable',
                fr: 'Recherche',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        closeOnSelect: {
            label: {
                en: 'Close on select',
                fr: 'Ferme à la sélection',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        clearIcon: {
            label: {
                en: 'Clear icon',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        caretIcon: {
            label: {
                en: 'Caret icon',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        initialValue: {
            label: {
                en: 'Initial value',
                fr: 'Valeur initiale',
            },
            type: 'Text',
            bindable: true,
            section: 'settings',
        },
        options: {
            label: { en: 'Options', fr: 'Options' },
            type: 'Array',
            section: 'settings',
            options: {
                item: {
                    type: 'Object',
                    defaultValue: { label: { en: 'New option' }, value: '' },
                    options: {
                        item: {
                            label: {
                                label: { en: 'Label' },
                                type: 'Text',
                                options: { placeholder: 'Label' },
                                multiLang: true,
                            },
                            value: {
                                label: { en: 'Value' },
                                type: 'Text',
                                options: { placeholder: 'Value' },
                            },
                            textColor: {
                                label: { en: 'Color' },
                                type: 'Color',
                            },
                            bgColor: {
                                label: { en: 'Background color' },
                                type: 'Color',
                            },
                        },
                    },
                },
            },
            defaultValue: [
                { value: 'option', label: { en: 'option - 1' }, bgColor: '#FFFFFF00', textColor: '#000000' },
                { value: 'option2', label: { en: 'option - 2' }, bgColor: '#FFFFFF00', textColor: '#000000' },
            ],
            bindable: true,
        },
        hintFields: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || content.options,
            label: {
                en: 'Options fields',
                fr: 'Champs des options',
            },
            type: 'Info',
            options: {
                text: { en: 'Please provide at least one option to configure fields' },
            },
            editorOnly: true,
            section: 'settings',
        },
        labelField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Label field',
                fr: 'Label field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: '',
            section: 'settings',
        },
        valueField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Value field',
                fr: 'Value field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: '',
            section: 'settings',
        },
        bgColorField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Background color field',
                fr: 'Background color field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: '#FFFFFF00',
            section: 'settings',
        },
        textColorField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Text color field',
                fr: 'Text color field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: '#000000',
            section: 'settings',
        },
        placeholderElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-text',
                state: {
                    name: 'Placeholder text',
                    style: {
                        default: {
                            color: '#D1D5DB',
                            padding: '0px 0px 0px 12px',
                        },
                    },
                },
            },
            navigator: {
                group: 'Select',
            },
        },
        optionElementSelected: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-text',
                state: {
                    name: 'Text - selected',
                    style: {
                        default: {
                            padding: '0px 0px 0px 12px',
                            borderRadius: '4px',
                            color: '#000000',
                        },
                    },
                },
            },
            navigator: {
                group: 'Option',
            },
        },
        optionElement: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Text' } },
            navigator: {
                group: 'Option',
            },
        },
        caretIconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Caret icon',
                    style: {
                        default: {
                            padding: '12px',
                        },
                    },
                },
                content: { default: { icon: 'fas fa-caret-down', color: '#9CA3AF', fontSize: '16' } },
            },
            navigator: {
                group: 'Select',
            },
        },
        clearIconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Clear icon',
                    style: {
                        default: {
                            padding: '12px',
                        },
                    },
                },
                content: { default: { icon: 'wwi wwi-cross', color: '#9CA3AF', fontSize: '14' } },
            },
            navigator: {
                group: 'Select',
            },
        },
        optionsDefaultBgColor: {
            label: {
                en: 'Default option background',
            },
            type: 'Color',
            defaultValue: '#FFFFFF00',
        },
        optionsDefaultTextColor: {
            label: {
                en: 'Default option text color',
            },
            type: 'Color',
            defaultValue: '#000000',
        },
        optionBackgroundPointed: {
            label: {
                en: 'Dropdown option hover color',
            },
            type: 'Color',
            defaultValue: '#d1d5db',
        },
        optionBackgroundSelected: {
            label: {
                en: 'Dropdown option selected color',
            },
            type: 'Color',
            defaultValue: '#8e9091',
        },
        optionBackgroundSelectedPointed: {
            label: {
                en: 'Dropdown option selected - hover color',
            },
            type: 'Color',
            defaultValue: '#6a6a6b',
        },
        dropdownBackgroundColor: {
            label: {
                en: 'Dropdown background color',
            },
            type: 'Color',
            defaultValue: '#ffffff',
        },
        dropdownBorderWidth: {
            type: 'Length',
            label: {
                en: 'Dropdown border width',
            },
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 100 }],
            },
            defaultValue: '1px',
        },
        dropdownBorderColor: {
            label: {
                en: 'Dropdown border color',
            },
            type: 'Color',
            defaultValue: '#d1d5db',
        },
        dropdownBorderRadius: {
            type: 'Length',
            label: {
                en: 'Dropdown border radius',
            },
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 100 }],
            },
            defaultValue: '4px',
        },
        dropdownMaxHeight: {
            label: {
                en: 'Dropdown max height',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 500 }],
            },
            responsive: true,
            states: true,
            defaultValue: '150px',
        },
    },
};
