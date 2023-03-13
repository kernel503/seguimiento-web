<template>
  <div>
  </v-alert>
    <v-alert
      outlined
      type="warning"
      prominent
      border="left"
    >
    Seleccione un catálogo del panel lateral    
    </v-alert>
    <v-skeleton-loader class="mx-auto" type="table">
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
