<template>
  <v-card class="mx-auto" max-width="600">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title>
        {{ value.length === 3 ? 'Editar registro' : 'Crear registro' }}
      </v-card-title>
      <v-card-text class="mb-0 pb-0">
        <v-text-field :rules="[nombreRule]" v-model="nombre" outlined required>
          <template #label>
            {{ title }}
            <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>

        <MdiExplorer :rules="[iconoRule]" v-model="icono" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')" text> Cancelar </v-btn>
        <v-btn @click="submit" color="blue darken-1" dark> Aceptar </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import { string } from '@/http/Validation';
import MdiExplorer from '../mdiExplorer/MdiExplorer.vue';

export default {
  name: 'MdiPicker',

  components: {
    MdiExplorer,
  },

  props: {
    title: {
      type: String,
      default: 'Campo',
    },
    cardTitle: {
      type: String,
      default: 'Title',
    },
    value: {
      type: Array,
      default: () => ['', ''],
    },
  },

  data() {
    return {
      valid: false,
      nombre: '',
      icono: '',
    };
  },

  mounted() {
    this.nombre = this.value.at(0) || '';
    this.icono = this.value.at(1) || '';
  },

  methods: {
    iconoRule: string('Debe seleccionar un icono.'),
    nombreRule: string('Debe agregar el nombre.'),
    submit() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;
      this.$emit('submit');
    },
  },

  watch: {
    nombre(newValue) {
      this.value[0] = newValue;
    },
    icono(newValue) {
      this.value[1] = newValue;
    },
  },
};
</script>
