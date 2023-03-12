<template>
  <div>
    <v-btn
      text
      class="mb-1 pb-1 pt-0 mt-0"
      color="red darken-2"
      @click="gotToDashboard"
    >
      Ir a inicio
    </v-btn>
    <v-skeleton-loader class="mx-auto" max-width="300" type="card">
    </v-skeleton-loader>
  </div>
</template>
<script>
export default {
  name: 'NotFound',
  methods: {
    gotToDashboard() {
      this.$router.push({ name: 'web:dashboard' }, (error) => {
        console.log(error);
      });
    },
  },
};
</script>
