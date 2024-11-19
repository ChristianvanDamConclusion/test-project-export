function getDataObject(content) {
    if (!content.data) return {};
    if (Array.isArray(content.data)) {
        return content.data[0] || {};
    }
    if (Array.isArray(content.data.data)) {
        return content.data.data[0] || {};
    }
    return {};
}
function hasData(content) {
    if (!content.data) return false;
    if (Array.isArray(content.data)) {
        return content.data.length;
    }
    if (Array.isArray(content.data.data)) {
        return content.data.data.length;
    }
    return false;
}

export default {
    editor: {
        label: {
            en: 'DataGrid',
        },
        icon: 'table',
        bubble: {
            icon: 'table',
        },
        customStylePropertiesOrder: [
            'verticalAlignement',
            'alternateBackground',
            ['rowBackgroundColor', 'rowBackgroundColorAlt', 'rowBackgroundColorHover', 'rowBackgroundColorSelected'],
            'displayHeader',
            'hasStickyHeader',
            'headerBackgroundColor',
            'isTrBorderSplit',
            ['trBorders', 'trBordersVertical', 'trBordersHorizontal'],
            'isTdBorderSplit',
            ['tdBorders', 'tdBordersVertical', 'tdBordersHorizontal'],
            'isTheadBorderSplit',
            ['theadBorders', 'theadBordersVertical', 'theadBordersHorizontal'],
            'isThBorderSplit',
            ['thBorders', 'thBordersVertical', 'thBordersHorizontal'],
        ],
    },
    triggerEvents: [
        {
            name: 'update:row',
            label: { en: 'On Row update' },
            event: { value: '', id: '' },
            getTestEvent: 'getTestEvent',
            default: true,
        },
        {
            name: 'delete:row',
            label: { en: 'On Row delete' },
            event: { value: '', id: '' },
            getTestEvent: 'getTestEvent',
        },
        { name: 'sort', label: { en: 'On Sort' }, event: { value: '', column: '' } },
    ],
    properties: {
        // SETTINGS
        data: {
            label: {
                en: 'Grid data',
            },
            type: 'Info',
            options: {
                text: { en: 'Bind your data' },
            },
            bindable: 'repeatable',
            defaultValue: [],
            section: 'settings',
        },
        warning: {
            type: 'Info',
            editorOnly: true,
            options: {
                text: { en: 'Please bind your data to an array to configure your data-grid' },
            },

            section: 'settings',
            hidden: content => hasData(content),
        },
        dataIdPath: {
            label: {
                en: 'Unique id',
            },
            type: 'ObjectPropertyPath',
            options: content => ({
                object: getDataObject(content),
            }),
            hidden: content => !hasData(content),
            section: 'settings',
        },
        columns: {
            label: {
                en: 'Columns',
            },
            type: 'Array',
            hidden: content => !hasData(content),
            options: {
                item: {
                    type: 'Object',
                    options: {
                        item: {
                            name: {
                                label: 'Name',
                                type: 'Text',
                            },
                            type: {
                                label: { en: 'Type' },
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'text', label: 'Text' },
                                        { value: 'select', label: 'Select' },
                                        { value: 'multiselect', label: 'Multi-select' },
                                        { value: 'checkbox', label: 'Checkbox' },
                                        { value: 'date', label: 'Date' },
                                        { value: 'custom', label: 'Custom' },
                                    ],
                                },
                            },
                            path: {
                                label: { en: 'Path' },
                                type: 'ObjectPropertyPath',
                                options: content => ({
                                    object: getDataObject(content),
                                }),
                            },
                            width: {
                                label: { en: 'Width' },
                                type: 'Length',
                            },
                            display: {
                                label: { en: 'Display' },
                                type: 'OnOff',
                                bindable: true,
                                defaultValue: true,
                            },
                            editable: {
                                label: { en: 'Editable' },
                                type: 'OnOff',
                                bindable: true,
                                defaultValue: true,
                                hidden: content => !content.inlineEditing,
                            },
                            editableType: {
                                label: { en: 'Edition Type' },
                                type: 'TextSelect',
                                options: {
                                    options: [
                                        { value: 'text', label: 'Text' },
                                        { value: 'select', label: 'Select' },
                                        { value: 'multiselect', label: 'Multi-select' },
                                        { value: 'checkbox', label: 'Checkbox' },
                                        { value: 'date', label: 'Date' },
                                    ],
                                },
                                hidden: (content, sidepanelContent, boundProps, wwProps, array) =>
                                    !(array.item && array.item.type === 'custom' && array.item.editable),
                            },
                            sortable: {
                                label: { en: 'Sortable' },
                                type: 'OnOff',
                                defaultValue: false,
                                hidden: true,
                            },
                            id: {
                                hidden: true,
                            },
                        },
                    },
                    defaultValue: { label: 'Header' },
                },
                add: 'addColumn',
                remove: 'removeColumn',
                movable: true,
                expandable: true,
                getItemLabel(item, index) {
                    return (item && item.name) || `Column ${index + 1}`;
                },
            },
            defaultValue: [],
            section: 'settings',
        },
        actionColumnWidth: {
            label: 'Actions Width',
            type: 'Length',
            section: 'settings',
            hidden: content => !content.inlineEditing,
        },
        inlineEditing: {
            label: {
                en: 'Inline editing',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        forcedInlineEditing: {
            label: {
                en: 'See edit mode (1st line)',
            },
            type: 'OnOff',
            editorOnly: true,
            defaultValue: false,
            section: 'settings',
            hidden: content => !content.inlineEditing,
        },
        selectable: {
            label: {
                en: 'Allow selection',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        selectColumnWidth: {
            label: 'Select Width',
            type: 'Length',
            section: 'settings',
            hidden: content => !content.selectable,
        },
        // HEADER
        displayHeader: {
            label: {
                en: 'Show Header',
            },
            type: 'OnOff',
            defaultValue: true,
            responsive: true,
        },
        hasStickyHeader: {
            label: {
                en: 'Sticky Header?',
            },
            type: 'OnOff',
            defaultValue: false,
            hidden: content => !content.displayHeader,
        },
        headerBackgroundColor: {
            label: {
                en: 'Header Background color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            hidden: content => !content.displayHeader,
        },
        isTheadBorderSplit: {
            label: {
                en: 'Split header border',
            },
            type: 'OnOff',
            hidden: content => !content.displayHeader,
        },
        theadBorders: {
            label: {
                en: 'Header borders',
            },
            type: 'Border',
            hidden: content => content.isTheadBorderSplit || !content.displayHeader,
        },
        theadBordersVertical: {
            label: {
                en: 'Header borders (vertical)',
            },
            type: 'Border',
            hidden: content => !content.isTheadBorderSplit || !content.displayHeader,
        },
        theadBordersHorizontal: {
            label: {
                en: 'Header borders (horizontal)',
            },
            type: 'Border',
            hidden: content => !content.isTheadBorderSplit || !content.displayHeader,
        },
        isThBorderSplit: {
            label: {
                en: 'Split cell header border',
            },
            type: 'OnOff',
            hidden: content => !content.displayHeader,
        },
        thBorders: {
            label: {
                en: 'Header cell borders',
            },
            type: 'Border',
            hidden: content => content.isThBorderSplit || !content.displayHeader,
        },
        thBordersVertical: {
            label: {
                en: 'Header cell borders (vertical)',
            },
            type: 'Border',
            hidden: content => !content.isThBorderSplit || !content.displayHeader,
        },
        thBordersHorizontal: {
            label: {
                en: 'Header cell borders (horizontal)',
            },
            type: 'Border',
            hidden: content => !content.isThBorderSplit || !content.displayHeader,
        },
        // COLUMNS
        verticalAlignement: {
            label: { en: 'Vertical Alignement' },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'top', label: 'Top' },
                    { value: 'middle', label: 'Middle' },
                    { value: 'bottom', label: 'Bottom' },
                ],
            },
            default: 'top',
        },
        alternateBackground: {
            label: {
                en: 'Alternate background?',
            },
            type: 'OnOff',
            defaultValue: false,
        },
        rowBackgroundColor: {
            label: {
                en: 'Row Background color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
        },
        rowBackgroundColorAlt: {
            label: {
                en: 'Row Background color (alt)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            hidden: content => !content.alternateBackground,
        },
        rowBackgroundColorHover: {
            label: {
                en: 'Row Background color (hover)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
        },
        rowBackgroundColorSelected: {
            label: {
                en: 'Row Background color (selected)',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
        },
        isTrBorderSplit: {
            label: {
                en: 'Split row border',
            },
            type: 'OnOff',
            hidden: content => !content.displayHeader,
        },
        trBorders: {
            label: {
                en: 'Row borders',
            },
            type: 'Border',
            hidden: content => content.isTrBorderSplit || !content.displayHeader,
        },
        trBordersVertical: {
            label: {
                en: 'Row borders (vertical)',
            },
            type: 'Border',
            hidden: content => !content.isTrBorderSplit || !content.displayHeader,
        },
        trBordersHorizontal: {
            label: {
                en: 'Row borders (horizontal)',
            },
            type: 'Border',
            hidden: content => !content.isTrBorderSplit || !content.displayHeader,
        },
        isTdBorderSplit: {
            label: {
                en: 'Split cell border',
            },
            type: 'OnOff',
            hidden: content => !content.displayHeader,
        },
        tdBorders: {
            label: {
                en: 'Cell borders',
            },
            type: 'Border',
            hidden: content => content.isTdBorderSplit || !content.displayHeader,
        },
        tdBordersVertical: {
            label: {
                en: 'Cell borders (vertical)',
            },
            type: 'Border',
            hidden: content => !content.isTdBorderSplit || !content.displayHeader,
        },
        tdBordersHorizontal: {
            label: {
                en: 'Cell borders (horizontal)',
            },
            type: 'Border',
            hidden: content => !content.isTdBorderSplit || !content.displayHeader,
        },
        // ELEMENTS
        editContainer: {
            navigator: {
                group: 'Edit Buttons',
                hidden: content => !content.inlineEditing,
            },
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                content: {
                    children: [
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Edit' } },
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Delete' } },
                        },
                    ],
                },
            },
        },
        editingContainer: {
            navigator: {
                group: 'Edit Buttons',
                hidden: content => !content.inlineEditing,
            },
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                content: {
                    children: [
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Validate' } },
                        },
                        {
                            isWwObject: true,
                            type: 'ww-button',
                            content: { text: { en: 'Cancel' } },
                        },
                    ],
                },
            },
        },
        columnsElement: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Cells',
            },
        },
        editableCustomColumnsElement: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Editable Cells',
            },
        },
        headerTextSelectable: {
            hidden: true,
            navigator: {
                group: 'Headers',
                hidden: content => !content.displayHeader || !content.selectable,
            },
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Header - Selection' } },
        },
        headerTextElements: {
            hidden: true,
            defaultValue: {},
            navigator: {
                group: 'Headers',
                hidden: content => !content.displayHeader,
            },
        },
        headerTextActions: {
            hidden: true,
            navigator: {
                group: 'Headers',
                hidden: content => !content.displayHeader || !content.inlineEditing,
            },
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Header - Actions' } },
        },
        selectCheckbox: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-checkbox', state: { name: 'Select checkbox' } },
            navigator: {
                group: 'UI elements',
                hidden: content => !content.displayHeader || !content.selectable,
            },
        },
        sortIcon: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: { name: 'Sort Icon', style: { default: { cursor: 'pointer' } } },
                content: { icon: 'icon-chevron-down' },
            },
            navigator: {
                group: 'UI elements',
            },
        },
    },
};
