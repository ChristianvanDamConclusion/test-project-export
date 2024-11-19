import { createStore } from 'vuex';
import websiteData from './websiteData';
import data from './data';
import front from './front';

export default createStore({
    modules: {
        websiteData,
        data,
        front,
    },
});
