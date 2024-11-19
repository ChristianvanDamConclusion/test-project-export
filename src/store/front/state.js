export default {
    isPrerenderHydration: true,
    /*=============================================m_ÔÔ_m=============================================\
        LANG
    \================================================================================================*/
    lang: 'en',
    /*=============================================m_ÔÔ_m=============================================\
        SCREEN SIZE
    \================================================================================================*/
    screenSize: null,

    //TODO : When comming from publisher, also inject in prerenderProcess.js
    screenSizes: {
        default: {
            order: 0,
            label: {
                en: 'Desktop',
                fr: 'Ordinateur',
            },
            breakPoint: null,
            icon: 'monitor',
            query: null,
            defaultWidth: 1100,
            defaultHeight: (1100 * 9) / 16,
            prerenderWidth: 1920,
        },
        tablet: {
            order: 1,
            label: {
                en: 'Tablet',
                fr: 'Tablette',
            },
            breakPoint: 991,
            icon: 'tablet',
            query: 'max-width: 991px',
            defaultWidth: 770,
            defaultHeight: (770 * 14) / 9,
            prerenderWidth: 991,
        },
        mobile: {
            order: 2,
            label: {
                en: 'Mobile',
                fr: 'Mobile',
            },
            breakPoint: 767,
            icon: 'mobile',
            query: 'max-width: 767px',
            defaultWidth: 400,
            defaultHeight: (400 * 13) / 9,
            prerenderWidth: 767,
        },
    },
    isScreenSizeActive: {},
    /*=============================================m_ÔÔ_m=============================================\
        COMPONENTS CONFIG
    \================================================================================================*/
    /* wwFront:start */
    // eslint-disable-next-line no-undef
    componentConfigs: {'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb': { ...require('@/components/plugins/plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb/ww-config.js').default, name: 'plugin-2bd1c688-31c5-443e-ae25-59aa5b6431fb' },'plugin-f5856798-485d-47be-b433-d43d771c64e1': { ...require('@/components/plugins/plugin-f5856798-485d-47be-b433-d43d771c64e1/ww-config.js').default, name: 'plugin-f5856798-485d-47be-b433-d43d771c64e1' },'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad': { ...require('@/components/wwObjects/wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad/ww-config.js').default, name: 'wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad' },'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214': { ...require('@/components/wwObjects/wwobject-6f8796b1-8273-498d-95fc-7013b7c63214/ww-config.js').default, name: 'wwobject-6f8796b1-8273-498d-95fc-7013b7c63214' },'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15': { ...require('@/components/wwObjects/wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15/ww-config.js').default, name: 'wwobject-83d890fb-84f9-4386-b459-fb4be89a8e15' },'wwobject-25edb26f-a365-4447-8de5-4964f9f7dc77': { ...require('@/components/wwObjects/wwobject-25edb26f-a365-4447-8de5-4964f9f7dc77/ww-config.js').default, name: 'wwobject-25edb26f-a365-4447-8de5-4964f9f7dc77' },'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba': { ...require('@/components/wwObjects/wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba/ww-config.js').default, name: 'wwobject-aeb78b9a-6fb6-4c49-931d-faedcfad67ba' },'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1': { ...require('@/components/wwObjects/wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1/ww-config.js').default, name: 'wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1' },'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63': { ...require('@/components/wwObjects/wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63/ww-config.js').default, name: 'wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63' },'section-99586bd3-2b15-4d6b-a025-6a50d07ca845': { ...require('@/components/sectionBases/section-99586bd3-2b15-4d6b-a025-6a50d07ca845/ww-config.js').default, name: 'section-99586bd3-2b15-4d6b-a025-6a50d07ca845' },'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d': { ...require('@/components/sectionBases/section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d/ww-config.js').default, name: 'section-ef0ecc71-9a59-4eab-94b0-b36d66d3d61d' },'wwobject-9202d35c-2813-45bc-a7f3-0adb85f83e5e': { ...require('@/components/wwObjects/wwobject-9202d35c-2813-45bc-a7f3-0adb85f83e5e/ww-config.js').default, name: 'wwobject-9202d35c-2813-45bc-a7f3-0adb85f83e5e' },'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299': { ...require('@/components/wwObjects/wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299/ww-config.js').default, name: 'wwobject-af811adf-94d9-49dd-ab22-e2f29ae30299' },'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8': { ...require('@/components/wwObjects/wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8/ww-config.js').default, name: 'wwobject-88ef76b6-46d5-4685-878f-2f1fa0d54cb8' },'wwobject-a36eacfa-16af-4363-858d-a03177f211d4': { ...require('@/components/wwObjects/wwobject-a36eacfa-16af-4363-858d-a03177f211d4/ww-config.js').default, name: 'wwobject-a36eacfa-16af-4363-858d-a03177f211d4' },'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834': { ...require('@/components/wwObjects/wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834/ww-config.js').default, name: 'wwobject-69d0b3ef-b265-494c-8cd1-874da4aa1834' },'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7': { ...require('@/components/wwObjects/wwobject-aa27b26f-0686-4c29-98c5-8217044045b7/ww-config.js').default, name: 'wwobject-aa27b26f-0686-4c29-98c5-8217044045b7' },'wwobject-734633a1-457d-4fe5-9eaa-773dddc755f1': { ...require('@/components/wwObjects/wwobject-734633a1-457d-4fe5-9eaa-773dddc755f1/ww-config.js').default, name: 'wwobject-734633a1-457d-4fe5-9eaa-773dddc755f1' },'wwobject-84bb3944-0404-4c4e-b0d5-058a63e4554a': { ...require('@/components/wwObjects/wwobject-84bb3944-0404-4c4e-b0d5-058a63e4554a/ww-config.js').default, name: 'wwobject-84bb3944-0404-4c4e-b0d5-058a63e4554a' },'wwobject-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e': { ...require('@/components/wwObjects/wwobject-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e/ww-config.js').default, name: 'wwobject-2d18ef4c-e9e5-4dc6-a29d-01d9f797be5e' },'wwobject-9c263ffe-7da7-45e7-832c-543aef56faef': { ...require('@/components/wwObjects/wwobject-9c263ffe-7da7-45e7-832c-543aef56faef/ww-config.js').default, name: 'wwobject-9c263ffe-7da7-45e7-832c-543aef56faef' },'wwobject-85044fa4-8fc0-4115-9eaf-ca30a1b4b528': { ...require('@/components/wwObjects/wwobject-85044fa4-8fc0-4115-9eaf-ca30a1b4b528/ww-config.js').default, name: 'wwobject-85044fa4-8fc0-4115-9eaf-ca30a1b4b528' },'wwobject-18998884-a757-4a87-80fe-44f129cf0962': { ...require('@/components/wwObjects/wwobject-18998884-a757-4a87-80fe-44f129cf0962/ww-config.js').default, name: 'wwobject-18998884-a757-4a87-80fe-44f129cf0962' },'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061': { ...require('@/components/wwObjects/wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061/ww-config.js').default, name: 'wwobject-5a88036f-22ea-4f8d-b4a5-bc226ef95061' },},
    /* wwFront:end */
    activeLinkPopup: null,
    elementStates: {},
};
