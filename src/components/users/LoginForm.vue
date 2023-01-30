<template >
  <v-card class="mx-auto" max-width="500">
    <v-card-title> Ingresar ✨ </v-card-title>
    <v-card-text class="mb-0 pb-0">
      <v-text-field v-model="form.email" outlined required>
        <template #label>
          Correo electrónico <span class="red--text"><strong>* </strong></span>
        </template>
      </v-text-field>
      <v-text-field
        v-model="form.password"
        outlined
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @click:append="showPassword = !showPassword"
      >
        <template #label>
          Contraseña <span class="red--text"><strong>* </strong></span>
        </template>
      </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="login" color="blue darken-1" x-large dark >
        <v-icon left> mdi-login-variant </v-icon>
        Ingresar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'LoginForm',

  data: () => ({
    showPassword: false,
    form: { email: 'developer@gmail.com', password: 'password' },
  }),
  methods: {
    async login() {
      const response = await this.axios.post('/sanctum/token', {
        ...this.form,
      });
      const {
        data: { token },
      } = response;
      localStorage.setItem('token', token);
    },
  },
};
</script>
