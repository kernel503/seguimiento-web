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

          <l-geo-json :geojson="geojson" :options="geojsonOptions"></l-geo-json>
        </l-map>
      </v-img>
    </v-card-text>
  </v-card>
</template>
<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet';
import { circleMarker } from 'leaflet';

export default {
  name: 'LevantamientoMarker',

  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },

  data() {
    return {
      config: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 10,
        center: [13.794185, -88.89652999999998],
      },
      mapa: null,
      geojson: null,
      geojsonOptions: {
        pointToLayer(feature, latlng) {
          const fillColor = 'rgba(255,26,104,1)';
          return circleMarker(latlng, {
            radius: 8,
            fillColor,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          });
        },

        onEachFeature(feature, layer) {
          const data = feature?.properties?.marcador?.nombre;
          if (data) {
            layer.bindPopup(data);
          }
        },
      },
    };
  },

  created() {},

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
        } = await this.axios.get(`/reporte-marcadores/${codigo}/geojson`);

        this.geojson = data;
      } catch (error) {
        this.$toast.error('Error al mostrar los marcadores.');
        console.log(error);
      }
    },
  },
};
</script>
