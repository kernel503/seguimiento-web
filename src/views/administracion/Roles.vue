<template>
  <div>
    <v-tabs color="red" v-model="tab">
      <v-tab>Listado roles</v-tab>
      <v-tab>Crear rol</v-tab>
      <!--<v-tab>Editar rol</v-tab>-->
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <roles-lista ref="lista" />
      </v-tab-item>

      <v-tab-item>
        <roles-crear-form ref="crear" />
      </v-tab-item>

      <v-tab-item>
        <v-card flat>
          <v-card-text>TODO</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import RolesCrearForm from '@/components/administracion/RolesCrearForm.vue';
import RolesLista from '@/components/administracion/RolesLista.vue';

export default {
  name: 'Roles',
  components: {
    RolesCrearForm,
    RolesLista,
  },
  data() {
    return {
      tab: null,
    };
  },

  watch: {
    tab(newValue) {
      if (newValue === 0 && this.$refs.lista) {
        this.$refs.lista.cargarRoles();
      }

      if (newValue === 1 && this.$refs.crear) {
        this.$refs.crear.$refs.form.reset();
        this.$refs.crear.limpiarSeleccion();
      }
    },
  },
};
</script>
