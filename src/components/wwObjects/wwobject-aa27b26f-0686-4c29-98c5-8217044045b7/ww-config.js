export default {
    editor: {
        label: {
            en: 'Loader',
        },
        icon: 'loader',
    },
    properties: {
        spinner: {
            label: {
                en: 'Loader',
                fr: 'Loader',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'plane', label: { en: 'Plane' } },
                    { value: 'chase', label: { en: 'Chase' } },
                    { value: 'bounce', label: { en: 'Bounce' } },
                    { value: 'wave', label: { en: 'Wave' } },
                    { value: 'pulse', label: { en: 'Pulse' } },
                    { value: 'flow', label: { en: 'Flow' } },
                    { value: 'swing', label: { en: 'Swing' } },
                    { value: 'circle', label: { en: 'Circle' } },
                    { value: 'circle-fade', label: { en: 'Circle Fade' } },
                    { value: 'grid', label: { en: 'Grid' } },
                    { value: 'fold', label: { en: 'Fold' } },
                    { value: 'wander', label: { en: 'Wander' } },
                ],
            },
            defaultValue: 'plane',
        },
        color: {
            label: {
                en: 'Color',
            },
            type: 'Color',
            defaultValue: '#F23636',
            bindable: true,
        },
        size: {
            label: {
                en: 'Size',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 0, max: 2000 }],
            },
            defaultValue: '100px',
        },
    },
};
