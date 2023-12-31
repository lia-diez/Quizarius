<script setup lang="ts">

import { inject, reactive, ref, watch } from "vue";
import HttpClient from "../../helpers/httpClient.ts";
import { saveAuth } from "../../helpers/jwt.ts";
import { accountKey } from "../../inject-keys";
import { loginRules, passwordRules } from "./rules.ts";

const { login } = inject(accountKey) as { login: () => void }
const form = ref()
const loginData = reactive<{
  login?: string
  password?: string
  role: string
}>({ role: "student" })

const emits = defineEmits<{
  (e: 'close'): void
}>()
const password = ref<string | null>()
const valid = ref<boolean>(false)

async function validate() {
  const { valid: validated } = await form.value.validate()
  const passEq = loginData.password === password.value
  valid.value = validated && passEq;
}

watch(loginData, () => {
  validate()
}, { deep: true })

const submit = async () => {
  const { data } = await HttpClient.post('api/auth/signup', JSON.stringify(loginData));
  HttpClient.defaults.headers.Authorization = `Bearer ${data.token}`
  saveAuth(data.token)
  login()
  emits('close')
}
</script>

<template>
  <v-form ref="form" @submit.prevent class="d-flex flex-column align-center text-center">
    <v-text-field variant="solo-filled" label="Логін" class="w-100" :rules="loginRules"
      v-model="loginData.login"></v-text-field>
    <v-text-field variant="solo-filled" label="Пароль" class="w-100" type="password"
      v-model="loginData.password" :rules="passwordRules"></v-text-field>
    <v-text-field variant="solo-filled" :rules="passwordRules" label="Повторіть пароль" class="w-100" hide-details type="password"
      v-model="password"></v-text-field>
    <v-btn-toggle mandatory rounded="xl" v-model="loginData.role" color="primary" elevation="2" class=" mt-5 mb-5">
      <v-btn value="student">Я учень</v-btn>
      <v-btn value="teacher">Я вчитель</v-btn>
    </v-btn-toggle>
    <v-btn class="bg-secondary mb-2" :disabled="!valid" @click="submit">
      Зареєструватись
    </v-btn>
  </v-form>
</template>

<style scoped></style>