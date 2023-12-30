<script setup lang="ts">

import { inject, reactive, ref, watch } from "vue";
import { loginRules, passwordRules } from "./rules.ts";
import { accountKey } from "../../inject-keys";
import HttpClient from "../../helpers/httpClient";
import { saveAuth } from "../../helpers/jwt";

const loginData = reactive<{
  login?: string
  password?: string
}>({})

const { login } = inject(accountKey) as { login: () => void }
const form = ref()

const emits = defineEmits<{
  (e: 'close'): void
}>()
const valid = ref<boolean>(false)

async function validate() {
  const { valid: validated } = await form.value.validate()
  valid.value = validated;
}

watch(loginData, () => {
  validate()
}, { deep: true })

const submit = async () => {
  const { data } = await HttpClient.post('api/auth/login', JSON.stringify(loginData));
  HttpClient.defaults.headers.Authorization = `Bearer ${data.token}`
  saveAuth(data.token)
  login()
  emits('close')
}
</script>

<template>
    <v-form ref="form" @submit.prevent class="text-center">
      <v-text-field
          label="Логін"
          variant="solo-filled"
          :rules="loginRules"
          v-model="loginData.login"
      ></v-text-field>
      <v-text-field
          label="Пароль"
          variant="solo-filled"
          :rules="passwordRules"
          v-model="loginData.password"
      ></v-text-field>
      <v-btn class="bg-primary mb-2" :disabled="!valid" @click="submit">
        Увійти
      </v-btn>
    </v-form>
</template>

<style scoped>

</style>