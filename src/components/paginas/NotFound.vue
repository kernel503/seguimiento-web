<template>
  <div>
    <v-btn @click="gotToDashboard" dark outlined large color="red darken-2" >
    Ir a inicio
    </v-btn>
    <!-- <v-skeleton-loader class="mx-auto" type="table"> </v-skeleton-loader> -->
    <v-img
      height="80vh"
      contain
      @click="gotToDashboard"
      class="bg-white pb-0 mb-0 py-0"
      :src="require('@/assets/NotFound.jpg')"
    ></v-img>
  </div>
</template>
<script>
export default {
  name: 'NotFound',
  methods: {
    gotToDashboard() {
      this.$router.push({ name: 'web:desplazamiento:movil' }, (error) => {
        console.log(error);
      });
    },
  },
};
</script>
