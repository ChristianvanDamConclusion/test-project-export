export default {
    editor: {
        label: {
            en: 'Text',
            fr: 'Texte',
        },
        icon: 'typography',
        infoTag: content => ({
            color: 'var(--ww-color-blue-500)',
            backgroundColor: 'var(--ww-color-blue-100)',
            text: content.tag === 'button' ? 'BTN' : content.tag && content.tag.toUpperCase(),
            action: () => {
                wwLib.wwSearchBar.executeAction({
                    actions: wwLib.wwSearchBar.getEditSidebarActions('settings', 'custom-0'),
                });
            },
        }),
    },
    options: {
        hyperlink: true,
    },
    properties: {
        text: {
            label: {
                en: 'Text',
                fr: 'Texte',
            },
            type: 'Info',
            options: {
                text: { en: 'Click text to edit' },
            },
            bindable: true,
            multiLang: true,
            defaultValue: {
                en: 'New text',
            },
            hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.text),
        },
        sanitize: {
            label: {
                en: 'Sanitize',
            },
            type: 'OnOff',
            bindable: true,
            defaultValue: false,
            hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.text),
        },
        font: {
            label: {
                en: 'Typography',
                fr: 'Typography',
            },
            type: 'Typography',
            options: content => ({
                initialValue: {
                    fontSize: content.fontSize,
                    fontFamily: content.fontFamily,
                    fontWeight: content.fontWeight,
                    lineHeight: content.lineHeight,
                },
            }),
            responsive: true,
            states: true,
        },
        fontSize: {
            label: {
                en: 'Size',
                fr: 'Taille',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 1, max: 100 },
                    { value: 'em', label: 'em', min: 1, max: 10, digits: 2 },
                    { value: 'rem', label: 'rem', min: 1, max: 10, digits: 2 },
                ],
            },
            responsive: true,
            states: true,
            hidden: content => content.font,
            defaultValue: '16px',
        },
        fontFamily: {
            label: {
                en: 'Font family',
                fr: 'Font',
            },
            type: 'FontFamily',
            responsive: true,
            states: true,
            hidden: content => content.font,
        },
        fontWeight: {
            label: {
                en: 'Font weight',
                fr: 'Graisse',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: null, label: { en: 'Default', fr: 'Par défaut' }, default: true },
                    { value: 100, label: { en: '100 - Thin' } },
                    { value: 200, label: { en: '200 - Extra Light' } },
                    { value: 300, label: { en: '300 - Light' } },
                    { value: 400, label: { en: '400 - Normal' } },
                    { value: 500, label: { en: '500 - Medium' } },
                    { value: 600, label: { en: '600 - Semi Bold' } },
                    { value: 700, label: { en: '700 - Bold' } },
                    { value: 800, label: { en: '800 - Extra Bold' } },
                    { value: 900, label: { en: '900 - Black' } },
                ],
            },
            defaultValue: null,
            responsive: true,
            states: true,
            hidden: content => content.font,
        },
        lineHeight: {
            label: {
                en: 'Line height',
                fr: 'Hauteur de ligne',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'normal', label: 'auto', default: true },
                    { value: 'px', label: 'px', min: 0, max: 100 },
                    { value: '%', label: '%', min: 0, max: 100 },
                    { value: 'em', label: 'em', min: 0, max: 10, digits: 2 },
                    { value: 'rem', label: 'rem', min: 0, max: 10, digits: 2 },
                    { value: 'unset', label: 'none' },
                ],
            },
            responsive: true,
            states: true,
            hidden: content => content.font,
        },
        textAlign: {
            label: {
                en: 'Alignment',
                fr: 'Alignement',
            },
            type: 'TextRadioGroup',
            options: {
                choices: [
                    {
                        value: 'left',
                        default: true,
                        title: { en: 'Left', fr: 'Gauche' },
                        icon: 'menu-alt-2',
                    },
                    { value: 'center', title: { en: 'Center', fr: 'Milieu' }, icon: 'text-middle' },
                    { value: 'right', title: { en: 'Right', fr: 'Droite' }, icon: 'menu-alt-3' },
                    {
                        value: 'justify',
                        title: { en: 'Justify', fr: 'Justifié' },
                        icon: 'menu',
                    },
                ],
            },
            responsive: true,
        },
        color: {
            label: {
                en: 'Text color',
                fr: 'Couleur du texte',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            bindable: true,
            responsive: true,
            states: true,
        },
        textDecoration: {
            label: {
                en: 'Text decoration',
                fr: 'Text decoration',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'none', label: { en: 'None', fr: 'None' }, default: true },
                    { value: 'underline', label: { en: 'Underline' } },
                    { value: 'overline', label: { en: 'Overline' } },
                    { value: 'line-through', label: { en: 'Line-through' } },
                ],
            },
            defaultValue: 'none',
            bindable: true,
            responsive: true,
            states: true,
        },
        textDecorationStyle: {
            label: {
                en: 'Decoration style',
                fr: 'Decoration style',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'solid', label: { en: 'Solid' }, default: true },
                    { value: 'double', label: { en: 'Double' } },
                    { value: 'dotted', label: { en: 'Dotted' } },
                    { value: 'dashed', label: { en: 'Dashed' } },
                    { value: 'wavy', label: { en: 'Wavy' } },
                ],
            },
            defaultValue: 'solid',
            responsive: true,
            bindable: true,
            states: true,
            hidden: content => content.textDecoration === 'none',
        },
        textDecorationColor: {
            label: {
                en: 'Decoration color',
                fr: 'Decoration color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            responsive: true,
            bindable: true,
            states: true,
            hidden: content => content.textDecoration === 'none',
        },
        nowrap: {
            label: {
                en: 'No-wrap',
            },
            type: 'OnOff',
            defaultValue: false,
            responsive: true,
            states: true,
        },
        ellipsis: {
            hidden: content => !content.nowrap,
            label: {
                en: 'Ellipsis',
            },
            type: 'OnOff',
            defaultValue: false,
            responsive: true,
            states: true,
        },
        textTransform: {
            label: {
                en: 'Character case',
                fr: 'Character case',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: null, label: 'none', default: true },
                    { value: 'capitalize', label: 'Capitalize' },
                    { value: 'uppercase', label: 'UPPERCASE' },
                    { value: 'lowercase', label: 'lowercase' },
                ],
            },
            defaultValue: null,
            responsive: true,
            states: true,
        },
        textShadow: {
            label: {
                en: 'Text Shadows',
                fr: 'Ombres du texte',
            },
            type: 'Shadows',
            options: {
                isText: true,
            },
            responsive: true,
            states: true,
        },
        letterSpacing: {
            label: {
                en: 'Letter spacing',
                fr: 'Espacement des lettres',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: -100, max: 100 },
                    { value: 'em', label: 'em', min: -100, max: 100 },
                    { value: 'rem', label: 'rem', min: -100, max: 100 },
                ],
            },
            defaultValue: '0px',
            responsive: true,
            states: true,
        },
        wordSpacing: {
            label: {
                en: 'Word spacing',
                fr: 'Espacement des mots',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 0, max: 100 }],
            },
            defaultValue: '0px',
            responsive: true,
            states: true,
        },
        tag: {
            label: {
                en: 'Html tag',
                fr: 'Tag html',
            },
            section: 'settings',
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'p', label: 'P' },
                    { value: 'h1', label: 'H1' },
                    { value: 'h2', label: 'H2' },
                    { value: 'h3', label: 'H3' },
                    { value: 'h4', label: 'H4' },
                    { value: 'button', label: 'Button' },
                    { value: 'div', label: 'Div' },
                ],
            },
            defaultValue: 'p',
        },
        links: {
            hidden: true,
        },
    },
};
