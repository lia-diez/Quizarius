<script setup lang="ts">
import {inject, Ref, ref} from "vue";
import Loginform from "./login-form.vue";
import Registerform from "./register-form.vue";
import {accountKey} from "../../inject-keys.ts";
import {accountData} from "../../types";

const dialog = ref(false)
const tab = ref('login')
const {data: account, logout} = inject(accountKey) as {
  data: Ref<accountData>,
  logout: () => void
}

</script>

<template>
  <v-btn prepend-icon="$login">
    {{ account.login ? account.login : 'Увійти' }}
    <v-dialog v-model="dialog" activator="parent" max-width="500px">
      <v-card v-if="!account.login">
        <v-tabs v-model="tab">
          <v-tab value="login">Вхід</v-tab>
          <v-tab value="register">Реєстрація</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="login">
              <loginform @close="dialog = !dialog"></loginform>
            </v-window-item>
            <v-window-item value="register">
              <registerform @close="dialog = !dialog"></registerform>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
      <v-card v-else class="pa-2 text-center">
        <v-card-title>
          Вийти з аккаунту?
        </v-card-title>
        <v-card-actions class="d-flex flex-row justify-center">
          <v-btn color="primary" variant="tonal" @click="dialog = !dialog">Відмінити</v-btn>
          <v-btn color="error" variant="tonal" @click="logout">Вийти</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>
<style scoped>

</style>