<template>
  <v-card>
    <v-card-title>
      <v-btn
        text
        class="mb-1 pb-1 pt-0 mt-0"
        color="red darken-2"
        @click="$router.go(-1)"
      >
        Regresar
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-img height="72vh" width="100vw">
todo
      </v-img>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'ConteoVehicularTabla',
  data() {
    return {
      marcadores: [],
    };
  },

  created() {
  },

  methods: {
    ready(mapa) {
      this.mapa = mapa;
      this.fetchCoordenadas();
    },

    async fetchCoordenadas() {
      try {
        const { codigo } = this.$route.params;
        console.log(codigo);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
