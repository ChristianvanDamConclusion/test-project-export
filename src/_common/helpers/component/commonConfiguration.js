export const STYLE_CONFIGURATION = {
    backgroundColor: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'background.color',
            type: 'string',
            cssSupports: 'color',
        },
    },
    background: {
        type: 'Object',
        options: {
            item: {
                type: {
                    bindable: true,
                },
                value: {
                    type: 'Object',
                    options: {
                        item: {
                            url: {
                                bindable: true,
                                bindingValidation: {
                                    markdown: 'background.url',
                                    type: 'string',
                                },
                            },
                            size: {
                                bindable: true,
                                bindingValidation: {
                                    markdown: 'background.size',
                                    type: 'string',
                                    cssSupports: 'size',
                                },
                            },
                            percent: {
                                bindable: true,
                                bindingValidation: {
                                    markdown: 'background.percent',
                                    type: 'string',
                                },
                            },
                            repeat: {
                                bindable: true,
                                bindingValidation: {
                                    markdown: 'background.repeat',
                                    type: 'string',
                                },
                            },
                            position: {
                                type: 'Object',
                                options: {
                                    item: {
                                        x: {
                                            bindable: true,
                                            bindingValidation: {
                                                markdown: 'background.x',
                                                type: 'string',
                                                cssSupports: 'x',
                                            },
                                        },
                                        y: {
                                            bindable: true,
                                            bindingValidation: {
                                                markdown: 'background.y',
                                                type: 'string',
                                                cssSupports: 'y',
                                            },
                                        },
                                    },
                                },
                            },
                            attachement: {
                                bindable: true,
                                bindingValidation: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    align: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'align',
            type: 'string',
            cssSupports: 'align',
        },
    },
    zIndex: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'z-index',
            type: 'string',
            cssSupports: 'z-index',
        },
    },
    overflow: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'overflow',
            type: 'string',
            cssSupports: 'overflow',
        },
    },
    position: {
        responsive: true,
        states: true,
        bindingValidation: {
            markdown: 'position',
            type: 'string',
            cssSupports: 'position',
        },
    },
    anchor: {
        responsive: true,
        states: true,
    },
    top: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'top',
            type: 'string',
            cssSupports: 'top',
        },
    },
    bottom: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'bottom',
            type: 'string',
            cssSupports: 'bottom',
        },
    },
    left: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'left',
            type: 'string',
            cssSupports: 'left',
        },
    },
    right: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'right',
            type: 'string',
            cssSupports: 'right',
        },
    },
    height: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'height',
            type: 'string',
            cssSupports: 'height',
        },
    },
    minHeight: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'min-height',
            type: 'string',
            cssSupports: 'min-height',
        },
    },
    maxHeight: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'max-height',
            type: 'string',
            cssSupports: 'max-height',
        },
    },
    width: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'width',
            type: 'string',
            cssSupports: 'width',
        },
    },
    minWidth: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'min-width',
            type: 'string',
            cssSupports: 'min-width',
        },
    },
    maxWidth: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'max-width',
            type: 'string',
            cssSupports: 'max-width',
        },
    },
    padding: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'padding',
            type: 'string',
            cssSupports: 'padding',
        },
    },
    margin: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'margin',
            type: 'string',
            cssSupports: 'margin',
        },
    },
    border: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'border',
            type: 'string',
            cssSupports: 'border',
        },
    },
    borderTop: {
        bindable: true,
        responsive: true,
        states: true,
        bindingValidation: {
            markdown: 'border-top',
            type: 'string',
            cssSupports: 'border-top',
        },
    },
    borderBottom: {
        bindable: true,
        responsive: true,
        states: true,
        bindingValidation: {
            markdown: 'border-bottom',
            type: 'string',
            cssSupports: 'border-bottom',
        },
    },
    borderRight: {
        bindable: true,
        responsive: true,
        states: true,
        bindingValidation: {
            markdown: 'border-right',
            type: 'string',
            cssSupports: 'border-right',
        },
    },
    borderLeft: {
        bindable: true,
        responsive: true,
        states: true,
        bindingValidation: {
            markdown: 'border-left',
            type: 'string',
            cssSupports: 'border-left',
        },
    },
    borderRadius: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'border-radius',
            type: 'string',
            cssSupports: 'border-radius',
        },
    },
    boxShadow: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'box-shadow',
            type: 'string',
            cssSupports: 'box-shadow',
        },
    },
    cursor: {
        responsive: true,
        bindable: true,
        states: true,
        bindingValidation: {
            markdown: 'cursor',
            type: 'string',
            cssSupports: 'cursor',
        },
    },
    display: {
        responsive: true,
        bindable: true,
        states: true,
        defaultUndefined: true,
        bindingValidation: {
            markdown: 'display',
            validations: [
                {
                    type: 'string',
                    cssSupports: 'display',
                },
                {
                    type: 'boolean',
                },
            ],
        },
    },
    customCss: {
        responsive: true,
        states: true,
    },
    transform: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'transform',
            type: 'string',
            cssSupports: 'transform',
        },
    },
    perspective: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'perspective',
            type: 'string',
            cssSupports: 'perspective',
        },
    },
    opacity: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'opacity',
            type: 'number',
            cssSupports: 'opacity',
        },
    },
    transition: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'transition',
            type: 'string',
            cssSupports: 'transition',
        },
    },
    flex: {
        responsive: true,
        states: true,
        bindable: true,
        bindingValidation: {
            markdown: 'flex',
            type: 'string',
            cssSupports: 'flex',
        },
    },
    conditionalRendering: {
        bindable: true,
        defaultUndefined: true,
        responsive: true,
        states: true,
        bindingValidation: {
            validations: [
                {
                    type: 'boolean',
                },
            ],
        },
    },
};

export const STATE_CONFIGURATION = {
    // WE USE THIS AS A REFERENCE IN USECOMPONENT. IF YOU CHANGE ID CONFIGURATION, THIS MAY BREAK THE ENTIRE APP
    id: {
        bindable: true,
    },
    class: {
        bindable: true,
    },
    attributes: {
        type: 'Array',
        options: {
            item: {
                type: 'Object',
                defaultValue: { name: '', value: '' },
                options: {
                    item: {
                        name: {
                            type: 'Text',
                            options: { placeholder: 'Name', prevent: [/ /g] },
                            bindable: true,
                        },
                        value: {
                            type: 'Text',
                            options: { placeholder: 'Value' },
                            bindable: true,
                        },
                    },
                },
            },
        },
        bindable: true,
    },
    link: {
        type: 'Object',
        options: {
            item: {
                type: {},
                pageId: { bindable: true },
                parameters: { bindable: true },
                sectionId: { bindable: true },
                href: { bindable: true },
                file: { bindable: true },
                targetBlank: { bindable: true },
                background: { bindable: true },
                content: {},
                query: {
                    type: 'Array',
                    options: {
                        item: {
                            type: 'Object',
                            options: {
                                item: {
                                    name: { type: 'Text', options: { placeholder: 'Name' } },
                                    value: {
                                        type: 'Text',
                                        bindable: true,
                                        options: { placeholder: 'Value' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    interactions: {},
    forceRendering: {
        editorOnly: true,
    },
};
