import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#009975',
                secondary: '#50C878',
                accent: '#8c9eff',
                error: '#ff0033',
            },
        },
    },
});
