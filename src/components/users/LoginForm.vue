<template>
  <v-card class="mx-auto" max-width="500">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title> Iniciar sesión ✨ </v-card-title>
      <v-card-text class="mb-0 pb-0">
        <v-text-field :rules="[emailRule]" v-model="form.email" outlined required>
          <template #label>
            Correo electrónico <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>
        <v-text-field
          v-model="form.password"
          :rules="[passwordRule]"
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
        <v-btn @click="login" color="blue darken-1" dark>
          <v-icon left> mdi-login-variant </v-icon>
          Ingresar
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import { alphaString, string } from '../../http/Validation';

export default {
  name: 'LoginForm',

  data: () => ({
    showPassword: false,
    valid: false,
    form: { email: 'developer@gmail.com', password: 'password' },
  }),

  methods: {
    passwordRule: alphaString('El campo contraseña es requerido.'),
    emailRule: string('El campo correo electrónico es requerido.'),

    async login() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        try {
          const response = await this.axios.post('/sanctum/token', {
            ...this.form,
          });
          const {
            data: { token },
          } = response;
          localStorage.setItem('token', token);
          this.$router.push('dashboard');
          window.location.reload();
        } catch (error) {
          this.$toast.error('Error al iniciar sesión.');
        }
      }
    },
  },
};
</script>
