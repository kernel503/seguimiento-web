<template>
  <v-form ref="form" v-model="valid">
    <v-card class="mx-auto" max-width="500">
      <v-card-title> Crear una cuenta </v-card-title>
      <v-card-text class="mb-0 pb-0">
        <v-text-field
          v-model="form.email"
          outlined
          required
          :rules="[emailRule]"
        >
          <template #label>
            Correo electrónico
            <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>
        <v-text-field
          v-model="form.nombre_usuario"
          label="Nombre de usuario"
          outlined
        ></v-text-field>
        <v-autocomplete
          v-model="form.rol"
          :rules="[integerRule]"
          item-text="name"
          item-value="id"
          outlined
          :items="roles"
        >
          <template #label>
            Selecciona el rol <span class="red--text"><strong>* </strong></span>
          </template>
        </v-autocomplete>
        <v-text-field
          :rules="[fieldRule]"
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
        <v-btn @click="crearUsuario" color="blue darken-1" dark>
          <v-icon left> mdi-account-plus </v-icon>
          Crear usuario
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { email, string, integer } from '../../http/Validation';

export default {
  name: 'CreateUserFom',
  created() {
    this.obtenerRoles();
  },

  data: () => ({
    valid: true,
    showPassword: false,
    roles: [],
    form: {
      email: '',
      nombre_usuario: '',
      rol: null,
      password: '',
    },
  }),

  methods: {
    emailRule: email('Debe agregar un correo.'),
    fieldRule: string('Debe completar el campo.'),
    integerRule: integer('Debe seleccionar un rol.'),

    async obtenerRoles() {
      const response = await this.axios.get('/roles');
      const {
        data: { data },
      } = response;

      this.roles = data.slice(this.$route.name === 'signup' ? 1 : 0);
    },

    async crearUsuario() {
      if (!this.$refs.form.validate()) return;

      try {
        const path = this.$route.name === 'signup'
          ? '/usuario' : '/usuario/admin';

        const { data } = await this.axios.post(path, { ...this.form });

        this.$refs.form.reset();

        const message = `La cuenta ${data.usuario.email} está ${data.estado_cuenta}`;
        this.$toast.info(message);
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error.response.data.message);
          return;
        }
        this.$toast.error('No se pudo registrar la cuenta, intente de nuevo.');
      }
    },
  },
};
</script>
