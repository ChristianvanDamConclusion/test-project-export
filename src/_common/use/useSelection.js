import { useStore } from 'vuex';
import { computed, reactive } from 'vue';

import { getComponentName } from '@/_common/helpers/component/component';

export default function useSelection() {
    const store = useStore();
    const elements = computed(() => store.getters['manager/getSelectedObjects']);
    const section = computed(() => store.getters['manager/getSelectedSection']);

    return reactive({
        isActive: computed(() => elements.value.length || section.value.uid),
        component: computed(() => {
            if (elements.value.length > 1) {
                const { uid, componentId } = elements.value[0];
                return {
                    type: 'element',
                    uid,
                    componentId,
                    multiple: true,
                    elements: elements.value,
                    isSame: new Set(elements.value.map(element => getComponentName('element', element.uid))).size === 1,
                };
            } else if (elements.value.length === 1) {
                const { uid, componentId } = elements.value[0];
                return {
                    type: 'element',
                    uid,
                    componentId,
                    elements: elements.value,
                    multiple: false,
                };
            } else if (section.value && section.value.uid) {
                const { uid } = section.value;
                return { type: 'section', uid };
            } else {
                return { type: 'none' };
            }
        }),
    });
}
