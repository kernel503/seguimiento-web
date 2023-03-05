<template>
  <v-card class="mx-auto" max-width="600">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title>
        {{ value.length === 3 ? 'Editar registro' : 'Crear registro' }}
      </v-card-title>
      <v-divider class="blue accent-2 mx-5 mb-4"></v-divider>
      <v-card-text class="mb-0 pb-0">
        <v-text-field
          :rules="[nombreRule]"
          v-model="nombre"
          outlined
          required
          @keyup.enter="submit"
        >
          <template #label>
            {{ title }}
            <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>
        <v-switch
          label="Permitir acceso al software"
          v-model="permitirAcceso"
        ></v-switch>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('close')" text> Cancelar </v-btn>
        <v-btn @click="submit" color="red darken-1" dark> Aceptar </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import { string } from '@/http/Validation';

export default {
  name: 'EstadoCuentaForm',

  props: {
    title: {
      type: String,
      default: 'Nombre',
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
      permitirAcceso: '',
    };
  },

  mounted() {
    this.nombre = this.value.at(0) || '';
    this.permitirAcceso = this.value.at(1) || false;
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
    permitirAcceso(newValue) {
      this.value[1] = newValue;
    },
  },
};
</script>
