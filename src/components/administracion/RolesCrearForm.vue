<template>
  <div>
    <v-row>
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="create"
        >
          <v-text-field
            class="mb-0 pb-0 mt-2"
            :rules="[nombreRol]"
            v-model="nombre_rol"
            outlined
            required
            label="Nombre del rol"
            append-icon="mdi-account-plus-outline"
            @click:append="create"
          >
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-card v-for="seccion in secciones" :key="seccion.etiqueta" class="mt-3">
      <v-card-title class="m-0 p-0">
        <v-checkbox
          class="m-0 p-0"
          :label="seccion.etiqueta"
          @change="cambiarEstado($event, seccion.etiqueta)"
          color="red darken-2"
          hide-details
          v-model="seccion.seleccionado"
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
              color="red darken-2"
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
  name: 'RolesCrearForm',
  created() {
    this.loadCards();
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

    loadCards() {
      this.cargarRoles(filtros.web, 'Componente web');
      this.cargarRoles(filtros.api, 'Servicios API REST');
      this.cargarRoles(filtros.otro, 'Otros permisos');
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
        this.limpiarSeleccion();
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error?.response?.data?.message);
          return;
        }
        this.$toast.error('Error al realizar la petición.');
      }
    },

    limpiarSeleccion() {
      this.secciones = this.secciones.map((seccion) => {
        const permisos = seccion.permisos.map((permiso) => ({ ...permiso, seleccionado: false }));
        return { ...seccion, permisos, seleccionado: false };
      });
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
