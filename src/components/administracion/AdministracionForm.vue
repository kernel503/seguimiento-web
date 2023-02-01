<template>
  <v-card class="mx-auto" max-width="500">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title>
        {{ payload ? "Editar registro" : "Crear registro" }}
      </v-card-title>
      <v-card-text class="mb-0 pb-0">
        <v-text-field
          :rules="[nombreRule]"
          v-model="form.nombre"
          outlined
          required
        >
          <template #label>
            {{ title }}
            <span class="red--text"><strong>* </strong></span>
          </template>
        </v-text-field>

        <MdiExplorer :rules="[iconoRule]" v-model="form.icono" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" x-large text>
          Cancelar
        </v-btn>
        <v-btn @click="submit" color="blue darken-1" x-large dark>
          Aceptar
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script>
import MdiExplorer from '../mdiExplorer/MdiExplorer.vue';
import { string, email } from '../../http/Validation';

export default {
  name: 'AdministracionForm',
  props: {
    title: {
      type: String,
      default: '',
    },
    payload: {
      type: Object,
    },
    path: {
      type: String,
    },
  },
  components: { MdiExplorer },

  data: () => ({
    valid: false,
    form: { nombre: '', icono: '' },
  }),

  methods: {
    close() {
      this.$emit('show-form', false);
    },
    async submit() {
      const isValid = this.$refs.form.validate();
      if (!isValid) return;

      if (this.payload) {
        try {
          await this.axios.put(`${this.path}/${this.payload.id}`, this.form);
          this.$emit('reload');
          this.$emit('show-form', false);
        } catch (error) {
          this.$toast.error('Error al actualizar.');
        }
      } else {
        try {
          await this.axios.post(this.path, this.form);
          this.$emit('reload');
          this.$emit('show-form', false);
        } catch (error) {
          this.$toast.error('Error al crear.');
        }
      }
    },
    iconoRule: email('Debe seleccionar un icono.'),
    nombreRule: string('Debe agregar el nombre.'),
  },

  watch: {
    payload(newValue) {
      if (newValue) {
        this.form = { ...newValue };
      }
    },
  },
};
</script>
