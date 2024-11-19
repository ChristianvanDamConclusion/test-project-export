export default {
    editor: {
        label: {
            en: 'Icon',
            fr: 'Icône',
        },
        icon: 'star',
    },
    options: {
        hyperlink: true,
    },
    properties: {
        fontSize: {
            label: { en: 'Size', fr: 'Taille' },
            type: 'Number',
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: 20,
        },
        color: {
            label: { en: 'Color', fr: 'Couleur' },
            type: 'Color',
            bindable: true,
            responsive: true,
            states: true,
            defaultValue: '#000000',
        },
        icon: {
            label: { en: 'Icon', fr: 'Icône' },
            type: 'Icon',
            bindable: true,
            states: true,
            defaultValue: 'wwi wwi-icon',
        },
    },
};
