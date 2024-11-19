const INFO = {
    submit: 'sub',
    reset: 'rst',
    button: 'btn',
};

export default {
    options: {
        autoByContent: true,
        hyperlink: true,
        disableLink: content => content.disabled,
    },
    editor: {
        label: {
            en: 'Button',
            fr: 'Bouton',
        },
        icon: 'cursor-click',
        infoTags: content => {
            if (content.buttonType && INFO[content.buttonType]) {
                return {
                    color: 'var(--ww-color-blue-500)',
                    backgroundColor: 'var(--ww-color-blue-100)',
                    text: INFO[content.buttonType].toUpperCase(),
                    action: () => {
                        wwLib.wwSearchBar.executeAction({
                            actions: wwLib.wwSearchBar.getEditSidebarActions('settings', 'custom-0'),
                        });
                    },
                };
            } else {
                return [];
            }
        },
        workflowHint: content => {
            if (content.buttonType !== 'submit') {
                return false;
            }

            return {
                type: 'warning',
                header: {
                    en: 'You probably shouldn’t trigger workflows on submit buttons.',
                    fr: 'Vous ne devriez pas déclencher un workflow depuis un bouton submit',
                },
                text: {
                    en: 'For your users to benefit from automatic form field validation, you should trigger submit workflows on the form container. Unless you are 100% sure of what you’re doing and want to bypass this behavior.',
                    fr: 'Pour que vos utilisateurs bénéficient de la validation automatique des champs de formulaire, vous devez déclencher des workflows de soumission sur le conteneur de formulaire. À moins que vous ne soyez sûr à 100 % de ce que vous faites et que vous souhaitiez contourner ce comportement.',
                },
                button: {
                    text: { en: 'Select form container', fr: 'Selectionnez le form container' },
                    action: 'selectParentFormContainer',
                },
            };
        },
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
                en: 'New button',
            },
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
                    { value: 'initial', label: { en: 'Default', fr: 'Par défaut' } },
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
            defaultValue: 'initial',
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
        backgroundColor: {
            label: {
                en: 'Text Background',
                fr: 'Background du Texte',
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
                    { value: 'none', label: 'none' },
                    { value: 'capitalize', label: 'Capitalize' },
                    { value: 'uppercase', label: 'UPPERCASE' },
                    { value: 'lowercase', label: 'lowercase' },
                ],
            },
            defaultValue: 'none',
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
        buttonType: {
            label: {
                en: 'Type',
                fr: 'Type',
            },
            type: 'TextSelect',
            section: 'settings',
            options: {
                options: [
                    { value: null, label: 'none' },
                    { value: 'button', label: 'Button' },
                    { value: 'submit', label: 'Submit Button' },
                ],
            },
            defaultValue: 'button',
        },
        disabled: {
            label: { en: 'Disabled' },
            type: 'OnOff',
            section: 'settings',
            defaultValue: false,
            bindable: true,
        },
        hasLeftIcon: {
            label: { en: 'Left icon', fr: 'Icône gauche' },
            section: 'settings',
            type: 'OnOff',
        },
        leftIcon: {
            hidden: true,
        },
        hasRightIcon: {
            label: { en: 'Right icon', fr: 'Icône droite' },
            type: 'OnOff',
            section: 'settings',
        },
        rightIcon: {
            hidden: true,
        },
    },
};
