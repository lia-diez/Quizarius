<script setup lang="ts">

import { reactive, ref, watch } from "vue";
import { loginRules, passwordRules } from "./rules.ts";

const loginData = reactive<{
  login?: string
  password?: string
}>({})

const form = ref()
const valid = ref<boolean>(false)

async function validate() {
  const { valid: validated } = await form.value.validate()
  valid.value = validated;
}

watch(loginData, () => {
  validate()
}, { deep: true })

const submit = () => {
  //HttpClient.post('api/auth/token', JSON.stringify(loginData))
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