<template>
  <v-form ref="form" v-model="valid">
    <v-card class="mx-9" flat>
      <v-card-title> Crear cuenta </v-card-title>
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
          :rules="passwordRules"
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
        <v-btn outlined @click="$emit('cancelar')">
          Regresar
        </v-btn>
        <v-btn @click="crearUsuario" color="red darken-1" dark>
          Registrarse
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
<script>
import { email, string, integer } from '../../http/Validation';

export default {
  name: 'RegistroUsuario',

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
    passwordRules: [
      (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/.test(v)
        || 'La contraseña debe tener al entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula.',
    ],
  }),

  methods: {
    emailRule: email('Debe agregar un correo válido.'),
    fieldRule: string('Debe completar el campo.'),
    integerRule: integer('Debe seleccionar un rol.'),

    async obtenerRoles() {
      const response = await this.axios.get('/roles');
      const {
        data: { data },
      } = response;

      this.roles = data.slice(1);
    },

    async crearUsuario() {
      if (!this.$refs.form.validate()) return;

      try {
        const path = '/usuario';

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
