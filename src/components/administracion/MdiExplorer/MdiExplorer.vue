<template>
  <v-autocomplete
    v-model="iconSelected"
    :items="icons"
    outlined
    clearable
    label="Seleccionar icono"
    :rules="rules"
    :prepend-inner-icon="'mdi-' + iconSelected"
  >
    <template #label>
      Seleccionar icono
      <span class="red--text"><strong>*</strong></span>
    </template>
    <template v-slot:selection="data"> mdi-{{ data.item }} </template>
    <template v-slot:item="data">
      <v-icon v-text="'mdi-' + data.item" />
      <span v-text="data.item" class="px-2" />
    </template>
  </v-autocomplete>
</template>
<script>
import icons from './meta.json';

export default {
  name: 'MdiExplorer',

  props: {
    rules: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
    },
  },

  data: () => ({
    iconSelected: null,
    icons,
  }),

  mounted() {
    setTimeout(() => {
      if (this.value) {
        this.iconSelected = this.value;
      }
    }, 500);
  },

  watch: {
    iconSelected(current) {
      this.$emit('input', current);
    },
  },
};
</script>
