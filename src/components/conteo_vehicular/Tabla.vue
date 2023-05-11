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
      <v-data-table
        :headers="headers"
        :items="reporte"
        hide-default-header
      >
        <template v-slot:header="{ props: { headers } }">
          <thead class="v-data-table-header">
            <tr>
              <th
                role="columnheader"
                scope="col"
                aria-label="Código"
                class="text-center"
                v-for="header in headers"
                :key="header.length + randomKey()"
              >
                <span>{{ header }}</span>
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:body="{ items }">
          <tbody>
            <tr v-for="(row) in items" :key="row.length + randomKey()">
              <td
                v-for="data in row"
                class="text-center"
                :key="data + randomKey()"
              >
                {{ data }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'ConteoVehicularTabla',
  data() {
    return {
      headers: [],
      reporte: [],
    };
  },

  created() {
    this.fetchCoordenadas();
  },

  methods: {
    async fetchCoordenadas() {
      try {
        const { codigo } = this.$route.params;
        const response = await this.axios.get(
          `reporte-contador/${codigo}/agrupado`,
        );
        this.headers = response.data.data.at(0);
        this.reporte = response.data.data.slice(1);
      } catch (error) {
        console.log(error);
      }
    },
    randomKey() {
      return (
        new Date().getTime() + Math.floor(Math.random() * 100000).toString()
      );
    },
  },
};
</script>
