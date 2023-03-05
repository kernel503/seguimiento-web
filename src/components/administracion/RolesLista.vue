 <template>
  <v-expansion-panels class="pa-2">
    <v-expansion-panel v-for="seccion in secciones" :key="seccion.id" class="mt-3">
      <v-expansion-panel-header class="m-0 p-0 font-weight-bold">
       {{ seccion.name }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="4"
            v-for="permiso in seccion.permissions"
            :key="permiso.id"
          >
            {{ permiso.name }}
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: 'RolesLista',
  created() {
    this.cargarRoles();
  },
  data() {
    return {
      secciones: [],
    };
  },
  methods: {
    async cargarRoles() {
      try {
        const {
          data: { data },
        } = await this.axios.get('/roles', {
          params: { include: 'permissions' },
        });

        this.secciones = data;
      } catch (error) {
        if (error.response.status === 422) {
          this.$toast.error(error?.response?.data?.message);
          return;
        }
        this.$toast.error('Error al realizar la petición.');
      }
    },
  },
};
</script>
