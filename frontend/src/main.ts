import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import {
    mdiAccountOutline,
    mdiAccountGroup,
    mdiBookshelf,
    mdiLogin,
    mdiTimerSand,
    mdiCalendarMultiselectOutline,
    mdiRefresh,
    mdiPlusThick,
    mdiMinusThick,
    mdiDelete,
    mdiClipboardTextOutline,
    mdiCheckBold,
    mdiCloseThick,
    mdiBookMultipleOutline,
    mdiBookPlusMultipleOutline,
    mdiFileDocumentEditOutline,
    mdiFileDocumentPlusOutline,
    mdiInformationOutline

} from "@mdi/js";
import { md3 } from 'vuetify/blueprints'
import QuizView from "./components/quiz/quiz-view.vue";
import * as VueRouter from 'vue-router'
import Main from "./components/main.vue";
import { createWebHistory } from "vue-router";
import quizListView from './components/quiz/quiz-list-view.vue'
import quizCreateView from './components/create-quiz/quiz-create.vue'
import CourseCreate from "./components/course/course-create.vue";
import CourseView from './components/course/course-view.vue'
import CourseInvite from './components/course/course-invite.vue'
import CourseListView from './components/course/course-list-view.vue'
import Test from './components/test.vue'
import About from './components/about.vue'
import attemptView from './components/quiz/attempt-view.vue'

const appTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#EBEBEB',
        surface: '#F7F7F7',
        primary: '#011936',
        // primary: '#581845',
        'primary-darken-1': '#3700B3',
        secondary: '#56876d',
        'secondary-darken-1': '#018786',
        error: '#922d50',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#bb7a2f',

    },
}

const routes = [
    { path: '/', component: Main },
    { path: '/quiz', component: quizListView },
    { path: '/quiz/create', component: quizCreateView },
    { path: '/quiz/:id', component: QuizView },
    { path: '/course/create', component: CourseCreate },
    { path: '/course/:id', component: CourseView },
    { path: '/course', component: CourseListView},
    { path: '/invite/:id', component: CourseInvite },
    { path: '/test', component: Test },
    { path: '/about', component: About},
    { path: '/attempt/:id', component: attemptView},
    { path: '/result/:id', component: attemptView}
]
const router = VueRouter.createRouter({
    history: createWebHistory(),
    routes,
})


const vuetify = createVuetify({
    components,
    directives,
    blueprint: md3,
    theme: {
        defaultTheme: 'appTheme',
        themes: {
            appTheme
        }
    },
    icons: {
        defaultSet: 'mdi',
        aliases: {
            ...aliases,
            login: mdiLogin,
            account: mdiAccountOutline,
            bookshelf: mdiBookshelf,
            accountGroup: mdiAccountGroup,
            timerSand: mdiTimerSand,
            calendar: mdiCalendarMultiselectOutline,
            refresh: mdiRefresh,
            plus: mdiPlusThick,
            minus: mdiMinusThick,
            delete: mdiDelete,
            clipboard: mdiClipboardTextOutline,
            check: mdiCheckBold,
            close: mdiCloseThick,
            books: mdiBookMultipleOutline,
            booksPlus: mdiBookPlusMultipleOutline,
            fileEdit: mdiFileDocumentEditOutline,
            filePlus: mdiFileDocumentPlusOutline,
            info: mdiInformationOutline
        },
        sets: {
            mdi,
        },
    }
});


createApp(App).use(vuetify).use(router).mount('#app')
