<template>
    <v-app id="inspire">
      <v-main>
        <v-container class="fill-height" fluid>
          <v-row  align="center" justify="center">
            <v-col cols="12" sm="10" md="12" lg="11" xl="9">
              <v-card class="elevation-1">
                <v-card-text>
                <v-window v-model="step" class="mb-0 pb-0">
                  <v-window-item :value="1" class="mb-0 pb-0">
                    <v-row>
                      <v-col cols="12" md="6" class="pr-0 my-0 mr-0 align-self-center">
                        <v-card flat style="height: 100;" class="mb-0 pb-0 mx-9"
                        v-if="esInicioSesion">
                            <v-card-title> Iniciar sesión </v-card-title>
                            <v-card-text class="mb-0 pb-0">
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field
                                :rules="[emailRule]"
                                v-model="form.email"
                                outlined
                                required
                                >
                                <template #label>
                                    Correo electrónico
                                    <span class="red--text"><strong>* </strong></span>
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
                            </v-form>
                            </v-card-text>
                            <v-card-actions>
                            <v-container class="mt-0 pt-0">
                                <v-row no-gutters justify="center">
                                <v-col sm="8" md="8" lg="8" align-self="center">
                                    <v-btn @click="login" color="red darken-4" dark block>
                                    Ingresar
                                    </v-btn>
                                </v-col>
                                </v-row>
                                <v-row no-gutters class="mt-6" justify="center">
                                <v-col sm="8" md="8" lg="8" align-self="center">
                                    <v-btn @click="registrarse" outlined block> Registrarse </v-btn>
                                </v-col>
                                </v-row>
                            </v-container>
                            </v-card-actions>
                        </v-card>
                        <RegistroUsuario v-else @cancelar="cancelar"></RegistroUsuario>
                      </v-col>
                      <v-col  class="
                      teal accent-3 ml-0 pl-0 py-0 d-none  d-sm-none d-md-flex d-md-flex"
                      >
                      <v-img
                        style="  height: 100%;"
                        class="bg-white pb-0 mb-0 py-0"
                        :aspect-ratio="1"
                        :src="require('@/assets/portada_login.jpeg')"
                    ></v-img>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item :value="2">
                    <v-row class="fill-height">
                      <v-col cols="12" md="6" class="teal accent-3">
                        <v-card-text class="white--text mt-12">
                          <h2>Aqui imagen</h2>
                        </v-card-text>
                        <div class="text-center">
                          <v-btn rounded outlined dark @click="step--">Sign in</v-btn>
                        </div>
                      </v-col>

                      <v-col cols="12" md="8">
                        <v-card-text class="mt-12">
                          <h2>AQUi</h2>
                        </v-card-text>
                        <div class="text-center mt-n5">
                          <v-btn rounded color="teal accent-3" dark>SIGN UP</v-btn>
                        </div>
                      </v-col>
                    </v-row>
                  </v-window-item>
                </v-window>
              </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
<script>
import RegistroUsuario from '@/components/users/RegistroUsuario.vue';
import { alphaString, string } from '../../http/Validation';

export default {
  name: 'LoginForm',

  components: { RegistroUsuario },

  data: () => ({
    step: 1,
    showPassword: false,
    valid: false,
    esInicioSesion: true,
    form: {
      email: 'developer@gmail.com',
      password: 'password',
    },
  }),
  props: {
    source: String,
  },
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

    registrarse() {
      this.esInicioSesion = false;
    },

    cancelar() {
      this.esInicioSesion = true;
    },
  },
};
</script>
<!-- <script>
export default {
  data: () => ({
    step: 1,
  }),
  props: {
    source: String,
  },
};
</script> -->
