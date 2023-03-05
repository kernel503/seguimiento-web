<template>
  <div>
  <!--Data table-->
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="id"
    class="elevation-1"
    >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title class="text-capitalize">
          Usuarios
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      <v-dialog v-model="dialog" width="600px">
        <template v-slot:activator="{ on, attrs }">
              <v-btn color="red darken-2" dark class="mb-2" v-bind="attrs" v-on="on">
                <v-icon class="mr-1"> mdi-plus-box </v-icon>
                Nuevo registro
              </v-btn>
        </template>
        <v-card>
          <v-card-title>
           Crear registro
          </v-card-title>
          <v-divider class="blue accent-2 mx-5 mb-5"></v-divider>

          <v-card-text>
            <v-form ref="form" v-model="valid" >
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
            </v-form>
          </v-card-text>

          <v-card-actions class="py-5">
            <v-spacer></v-spacer>
            <v-btn @click="close()" text> Cancelar </v-btn>
            <v-btn @click="crearUsuario" color="blue darken-1" dark>Aceptar</v-btn>
          <v-spacer></v-spacer>
          </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon
        title="Cambiar estado usuario"
        class="mr-2"
        @click="openDialog(item)" > mdi-account-convert
      </v-icon>
      <v-icon
        title="Cambiar contraseña"
        class="mr-2"
        @click="openDialogChangePass(item)" > mdi-lock-reset
      </v-icon>
    </template>

    <template v-slot:item.solicitud.estado.nombre="{ item }">
      <v-chip
      v-if="item.solicitud.estado.id==1"
      color="green"
      text-color="white">{{ item.solicitud.estado.nombre }}
    </v-chip>
    <v-chip
      v-else
      color="red"
      text-color="white">{{ item.solicitud.estado.nombre }}
    </v-chip>
  </template>
</v-data-table>
<!--Modal cambio de estado-->
<v-dialog v-model="dialogEstado"  max-width="530px" >
  <v-card>
      <v-card-title
      class="text-h5">
      Cambio de estado
      </v-card-title>
      <v-card-text>
        <v-form ref="form_change_state" v-model="valid_state">
        <v-autocomplete
            v-model="estado"
            :rules="[integerRule]"
            item-text="nombre"
            item-value="id"
            outlined
            :items="estados"
          >
            <template #label>
              Selecciona el estado <span class="red--text"><strong>* </strong></span>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>

      <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn class="default"  outlined color=""  @click="dialogEstado = false" >Cancelar</v-btn>
      <v-btn class="red darken-2" @click="changeState()">Aceptar</v-btn>
      <v-spacer></v-spacer>
      </v-card-actions>
  </v-card>
</v-dialog>
<!--Modal cambio de contraseña-->
<v-dialog v-model="dialogCambioPassword"  max-width="530px" >
  <v-card>
      <v-card-title
      class="text-h5">
      Cambiar contraseña
      </v-card-title>
      <v-card-text>
        <v-form ref="form_change_pass">
        <v-text-field
          :rules="[fieldRule]"
          v-model="editedItem.password"
          outlined
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        >
          <template #label>
            Contraseña <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>

        <v-text-field
          :rules="[fieldRule,repeatPasswordRules]"
          v-model="passConfirm"
          outlined
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        >
          <template #label>
            Confirmar Contraseña <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>
      </v-form>
      </v-card-text>
      <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn class="default"  outlined  @click="dialogCambioPassword = false" >Cancelar</v-btn>
      <v-btn class="red darken-2" @click="changePassword()">Aceptar</v-btn>
      <v-spacer></v-spacer>
      </v-card-actions>
  </v-card>
</v-dialog>
 </div>
</template>
<script>
import { email, string, integer } from '../../http/Validation';

export default {
  name: 'CreateUserFom',

  created() {
    this.obtenerRoles();
    this.initialize();
    this.getEstadosCuenta();
  },

  data: () => ({
    valid: true,
    valid_state: true,
    showPassword: false,
    roles: [],
    form: {
      email: '',
      nombre_usuario: '',
      rol: null,
      password: '',
    },
    headers: [
      {
        text: 'Usuario',
        align: 'start',
        value: 'name',
      },
      { text: 'Estado', align: 'center', value: 'solicitud.estado.nombre' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
      },
    ],
    items: [],
    editedItem: {
      password: '',
    },
    passConfirm: '',
    dialog: false,
    dialogEstado: false,
    dialogCambioPassword: false,
    estado: '',
    estados: [],
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
        this.dialog = false;
        this.initialize();
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error.response.data.message);
          return;
        }
        this.$toast.error('No se pudo registrar la cuenta, intente de nuevo.');
      }
    },
    async initialize() {
      const response = await this.axios.get('/usuarios?include=solicitud.estado');
      this.items = response.data.data;
    },
    openDialog(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialogEstado = true;
    },
    openDialogChangePass(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.dialogCambioPassword = true;
      if (this.$refs.form_change_pass) {
        this.$refs.form_change_pass.reset();
      }
    },
    async changeState() {
      const nuevoEstado = this.estado;
      try {
        const validate = this.$refs.form_change_state.validate();
        if (validate) {
          const data = { id_estado_solicitud: nuevoEstado };
          await this.axios.put(`/solicitudes-cuentas/${this.editedItem.id}`, data);
          this.initialize();
          this.$toast.success('Registro actualizado');
          this.dialogEstado = false;
        }
      } catch (error) {
        this.$toast.error('Error al actualizar el estado');
      }
    },
    async changePassword() {
      try {
        const validate = this.$refs.form_change_pass.validate();
        if (validate) {
          const pass = this.editedItem.password;
          const data = { password: pass };
          await this.axios.put(`/usuarios/${this.editedItem.id}`, data);
          this.$toast.success('Constraseña actualizada correctamente');
          this.dialogCambioPassword = false;
        }
      } catch (error) {
        this.$toast.error('Error al actualizar la contraseña');
      }
    },
    async getEstadosCuenta() {
      const response = await this.axios.get('/estados-solicitud');
      this.estados = response.data.data;
      console.log(response.data.data);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },
  },
  computed: {
    repeatPasswordRules() {
      return () => this.editedItem.password === this.passConfirm || 'Contraseñas no coinciden';
    },
  },
};
</script>
