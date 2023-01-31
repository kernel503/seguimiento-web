<template>
  <div>
    <AdministracionForm
      title="incidente"
      path="incidentes"
      :payload="{ id: 4, nombre: 'fract', icono: 'abacus' }"
    />

  </div>
</template>
<script>
import AdministracionForm from './AdministracionForm.vue';

export default {
  name: 'IncidentesForm',
  components: { AdministracionForm },
};
</script>
