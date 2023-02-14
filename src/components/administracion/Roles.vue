<template>
  <v-card>
    <v-card-title class="m-0 p-0">
      <v-checkbox class="m-0 p-0" label="Roles" color="primary" hide-details></v-checkbox>
    </v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row class="m-0 p-0">
        <v-col cols="4" sm="2" md="2">
          <v-checkbox
            class="text-truncate"
            label="ewfoijekhguperijakhfureipjhfpwjadHNAPWIOEJFVSEOIBHSNAJ"
            color="primary"
            hide-details
          ></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
        <v-col cols="4" sm="2" md="2">
          <v-checkbox label="Roles" color="primary" hide-details></v-checkbox
        ></v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
// import MdiExplorer from '../mdiExplorer/MdiExplorer.vue';
// import { string } from '../../http/Validation';

export default {
  name: 'AdministracionRoles',
  data() {
    return {
      data: [
        {
          label: 'Componente Web',
          permisos: [{ nombre: 'web:administracion:roles' }],
        },
      ],
    };
  },
};
</script>
