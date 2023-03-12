<template>
  <v-footer dark class="red darken-4">
    <v-container id="text">
      <v-row>
        <v-col md="1">
          <img
          alt="Vuetify Logo"
          style="z-index: 1; opacity: 40%"
          src="https://www.ues.edu.sv/themes/UES-THEME/assets/images/ues_logo3.svg"
          width="100px"
          />
        </v-col>
        <v-col md="11" class="align-self-center pl-6">
          2023 Universidad de El Salvador. <br>
          Ciudad Universitaria "Dr. Fabio Castillo Figueroa",<br>
          Final Avenida "Mártires Estudiantes del 30 julio", San Salvador,<br>
          El Salvador, América Central. Teléfonos: +(503) 2511-2000<br>
          Todos los derechos reservados.
        </v-col>
      </v-row>
      </v-container>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    name: 'Footer',
  }),
};
</script>

<style>
  #text{
    font-size: 0.875rem;
  }
</style>
