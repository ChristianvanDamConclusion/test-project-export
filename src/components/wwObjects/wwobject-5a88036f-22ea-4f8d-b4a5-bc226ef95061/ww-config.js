export default {
  editor: {
    label: {
      en: 'Stack',
    },
    icon: 'inbox-in'
  },
  triggerEvents: [
    { 
      name: 'item:moved',
      label: { en: 'On item moved' },
      event: { 
        item: {},
        oldIndex: 0,
        newIndex: 1,
        updatedList: []
      }
    },
    { 
      name: 'item:added',
      label: { en: 'On item added' },
      event: { 
        item: {},
        newIndex: 1,
        updatedList: []
      }
    },
    { 
      name: 'item:removed',
      label: { en: 'On item removed' },
      event: { 
        item: {},
        oldIndex: 0,
        updatedList: []
      }
    },
  ],
  properties: {
    group: {
      hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.group),
      label: {
        en: 'Group'
      },
      type: 'Text',
      bindable: true,
      defaultValue: 'common',
      section: 'settings'
    },
    items: {
      hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.items),
      label: {
        en: 'Items',
      },
      type: 'Info',
      options: {
        text: { en: 'Bind your data' }
      },
      bindable: true,
      defaultValue: [],
      section: 'settings',
    },
    sortable: {
      hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.sortable),
      label: {
        en: 'Sortable',
      },
      type: 'OnOff',
      defaultValue: true,
      section: 'settings',
    },
    itemElement: {
      hidden: true,
      defaultValue: [{ isWwObject: true, type: 'ww-flexbox' }],
      navigator: {
        group: 'Item',
      },
    },
    headerElement: {
      hidden: true,
      defaultValue: [{ isWwObject: true, type: 'ww-text' }],
      navigator: {
        group: 'Header',
      },
    },
    footerElement: {
      hidden: true,
      defaultValue: [],
      navigator: {
        group: 'Footer',
      },
    },
  },
};
