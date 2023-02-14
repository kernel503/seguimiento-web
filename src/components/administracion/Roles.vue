<template>
  <div>
    <div>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          :rules="[nombreRol]"
          v-model="nombre_rol"
          outlined
          required
          label="Nombre del rol"
        >
        </v-text-field>
      </v-form>
      <v-spacer></v-spacer>
      <v-btn @click="create" color="blue darken-1" dark>
        <v-icon left> mdi-pencil </v-icon>
        Crear
      </v-btn>
    </div>
    <v-card v-for="seccion in secciones" :key="seccion.etiqueta" class="mt-3">
      <v-card-title class="m-0 p-0">
        <v-checkbox
          class="m-0 p-0"
          :label="seccion.etiqueta"
          @change="cambiarEstado($event, seccion.etiqueta)"
          color="primary"
          hide-details
        ></v-checkbox>
      </v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <v-row>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="3"
            v-for="permiso in seccion.permisos"
            :key="permiso.id"
          >
            <v-checkbox
              dense
              class="text-truncate"
              :label="permiso.name"
              v-model="permiso.seleccionado"
              color="primary"
              hide-details
            ></v-checkbox
          ></v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { string } from '../../http/Validation';

const filtros = {
  web: {
    filters: [{ field: 'name', operator: 'like', value: 'web%' }],
  },
  api: {
    filters: [{ field: 'name', operator: 'like', value: 'api%' }],
  },
  otro: {
    filters: [
      { field: 'name', operator: 'not like', value: 'api%' },
      { field: 'name', operator: 'not like', value: 'web%' },
    ],
  },
};

export default {
  name: 'AdministracionRoles',
  async created() {
    await this.cargarRoles(filtros.web, 'Componente web');
    await this.cargarRoles(filtros.api, 'Servicios API REST');
    await this.cargarRoles(filtros.otro, 'Otros permisos');
  },
  data() {
    return {
      secciones: [],
      valid: false,
      nombre_rol: '',
    };
  },
  methods: {
    nombreRol: string('El campo nombre rol es requerido.'),
    async cargarRoles(filters, etiqueta) {
      try {
        const {
          data: { data },
        } = await this.axios.post('/permisos/search', {
          ...filters,
        });

        this.secciones.push({
          etiqueta,
          seleccionado: false,
          permisos: data.map((permiso) => ({
            ...permiso,
            seleccionado: false,
          })),
        });
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error?.response?.data?.message);
          return;
        }
        this.$toast.error('Error al realizar la petición.');
      }
    },

    cambiarEstado(nuevoEstado, etiqueta) {
      this.secciones.forEach((seccion, index) => {
        if (seccion.etiqueta === etiqueta) {
          const permisos = seccion.permisos.map((permiso) => ({
            ...permiso,
            seleccionado: nuevoEstado,
          }));

          this.secciones.splice(index, 1, {
            etiqueta,
            seleccionado: nuevoEstado,
            permisos,
          });
        }
      });
    },

    async create() {
      const isValid = this.$refs.form.validate();

      if (!isValid) {
        return;
      }

      const roles = this.obtenerRoles();
      try {
        const {
          data: {
            data: { name },
          },
        } = await this.axios.post('/roles', {
          nombre_rol: this.nombre_rol,
          permisos: roles,
        });
        this.$toast.success(`Rol ${name} creado`);
        this.$refs.form.reset();
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error?.response?.data?.message);
          return;
        }
        this.$toast.error('Error al realizar la petición.');
      }
    },

    obtenerRoles() {
      return this.secciones
        .map((seccion) => seccion.permisos.filter((permiso) => permiso.seleccionado))
        .flat()
        .map((permiso) => permiso.name);
    },
  },
};
</script>
