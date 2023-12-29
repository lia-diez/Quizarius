<script setup lang="ts">
import { computed, provide, ref } from "vue";
import Authpopup from "./components/auth/auth-popup.vue";
import QCardText from "./components/base/q-card-text.vue";
import QCardTitle from "./components/base/q-card-title.vue";
import QCard from "./components/base/q-card.vue";
import HttpClient from "./helpers/httpClient.ts";
import { deleteAuth } from "./helpers/jwt.ts";
import { accountKey } from "./inject-keys.ts";
import { accountData } from "./types";
import QLoader from "./components/base/q-loader.vue";

const drawer = ref(false);
const loading = ref(true);

const accountData = ref<accountData>({})

const setAccountData = (login: string | null, id: string | null, role: string | null) => {
  accountData.value.login = login;
  accountData.value.id = id;
  accountData.value.role = role;
}

const logout = () => {
  setAccountData(null, null, null)
  deleteAuth()
}

const login = async () => {
  const { data, status } = await HttpClient.get('api/auth/profile')
  if (status === 401) {
    logout();
    return;
  }
  accountData.value = data as accountData;
}

login().finally(() => {
  loading.value = false;
})

const loggedIn = computed<boolean>(() => !!accountData.value.id)
const isTeacher = computed<boolean>(() => accountData.value.role === 'teacher')

provide(accountKey, { data: accountData, set: setAccountData, logout: logout, login: login, isTeacher: isTeacher })

function toggleDrawer() {
  drawer.value = !drawer.value
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-nav-icon v-if="loggedIn" @click="toggleDrawer">
      </v-app-bar-nav-icon>

      <v-app-bar-title>
        <router-link to="/">Quizarius <v-chip v-if="isTeacher" class="rounded-xl" variant="flat" color="error">
            Teacher</v-chip></router-link>
      </v-app-bar-title>

      <authpopup></authpopup>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="background" class="pt-3 w-auto" temporary>
      <!-- <router-link to="/">
        <v-list-item title="Мій акаунт" :subtitle="accountData?.login ?? 'Увійдіть'" @click="toggleDrawer"
          prepend-icon="$account"></v-list-item>
      </router-link>
      <v-divider></v-divider> -->
      <router-link to="/course">
        <v-list-item prepend-icon="$books" title="Мої курси"></v-list-item>
      </router-link>
      <router-link to="/quiz">
        <v-list-item prepend-icon="$fileEdit" title="Мої тести"></v-list-item>
      </router-link>
      <router-link to="/course/create" v-if="isTeacher">
        <v-list-item prepend-icon="$booksPlus" title="Створити курс"></v-list-item>
      </router-link>
      <router-link to="/quiz/create" v-if="isTeacher">
        <v-list-item prepend-icon="$filePlus" title="Створити тест"></v-list-item>
      </router-link>
      <router-link to="/about">
        <v-list-item prepend-icon="$info" title="Про сайт"></v-list-item>
      </router-link>
    </v-navigation-drawer>

    <v-main>
      <q-loader :loading="loading">
        <router-view v-if="loggedIn"></router-view>
        <div v-else class="w-100 h-100 d-flex justify-center align-center">
          <q-card>
            <q-card-title>
              <h2>Вас вітає <b>Quizaruis</b></h2>
            </q-card-title>
            <v-divider></v-divider>
            <q-card-text>
              <h3>Для отримання доступу до даного сайту натисність кнопку <b>Увійти</b> у верхньому правому куті екрану та
                <b>зареєструйтесь або увійдіть в акаунт</b>
              </h3>
            </q-card-text>
          </q-card>
        </div>
      </q-loader>
    </v-main>
    <v-footer class="footer d-flex flex-column" color="primary">
      <p class="d-flex flex-wrap text-center">Quizarius - 2023. Даний сайт є курсовою роботою студентки групи ІП-01 Головач Варвари Олександрівни</p>
      <a href="mailto:support@quizarius.pp.ua">support@quizarius.pp.ua</a>
    </v-footer>
  </v-app>
</template>

<style scoped>
.footer {
  margin-top: 30px;
  bottom: 0;
  width: 100%;
  max-height: 80px;
  min-height: 80px;
}

.footer p {
  margin: auto;
  font-size: 12px;
  color: #bbbbbb;
}
</style>
