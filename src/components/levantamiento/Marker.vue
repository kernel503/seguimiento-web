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
      <v-img height="72vh" width="100vw">
        <l-map
          v-if="!false"
          :style="{ position: 'absolute', height: '100%', width: '100%' }"
          :zoom="config.zoom"
          :center="config.center"
          ref="map"
          @ready="ready"
        >
          <l-tile-layer
            :url="config.url"
            :attribution="config.attribution"
          ></l-tile-layer>

          <l-marker
            :key="marcador.id"
            :lat-lng="marcador.markerLatLng"
            v-for="marcador in marcadores"
          ></l-marker>
        </l-map>
      </v-img>
    </v-card-text>
  </v-card>
</template>
<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'LevantamientoMarker',

  components: {
    LMap,
    LTileLayer,
    LMarker,
  },

  data() {
    return {
      leafletProviders: [
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'Stadia.AlidadeSmoothDark',
          visible: false,
          url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        },
      ],

      config: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 10,
        center: [13.794185, -88.89652999999998],
      },
      mapa: null,
      marcadores: [],
    };
  },

  methods: {
    ready(mapa) {
      this.mapa = mapa;
      this.fetchCoordenadas();
    },

    async fetchCoordenadas() {
      try {
        const { codigo } = this.$route.params;

        const {
          data: { data },
        } = await this.axios.post('reporte-marcadores/search', {
          filters: [
            { field: 'levantamiento.codigo', operator: '=', value: codigo },
          ],
        });

        this.marcadores = data.map((marker) => ({
          ...marker,
          markerLatLng: [marker.latitud, marker.longitud],
        }));
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
