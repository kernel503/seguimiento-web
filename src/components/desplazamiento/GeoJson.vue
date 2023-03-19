<template>
  <div>
    <v-btn
      text
      class="mb-1 pb-1 pt-0 mt-0"
      color="red darken-2"
      @click="$router.go(-1)"
    >
      Regresar
    </v-btn>
    <v-container fluid ma-0 pa-0 fill-height>
      <v-layout row>
        <v-flex xs4>
          <l-map
            v-if="!false"
            :style="{ height: '80vh', position: 'fixed' }"
            :zoom="config.zoom"
            :center="config.center"
            ref="map"
            @ready="ready"
          >
            <l-tile-layer
              :url="config.url"
              :attribution="config.attribution"
            ></l-tile-layer>
            <l-geo-json
              v-if="geojson"
              :geojson="geojson"
              :options="geojsonOptions"
            ></l-geo-json>
          </l-map>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet';

export default {
  name: 'GeoJson',

  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },

  data() {
    // 3bfc0a52-2e00-4225-86e7-92fd2cbfc376
    // 1,5,2,1
    return {
      geojson: null,
      geojsonOptions: {
        style(feature) {
          return {
            color: feature.properties.color || 'red',
            weight: 7,
          };
        },
        onEachFeature(feature, layer) {
          console.log(layer);
          console.log(feature);
          layer.bindPopup('Hi There!');
          setTimeout(() => {
            // eslint-disable-next-line no-param-reassign
            layer.options.weight = 15;
          }, 1000);
        },
      },
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
      segmentosDesplazamiento: [],
    };
  },

  methods: {
    ready(mapa) {
      this.mapa = mapa;
      this.fetchCoordenadas();
    },

    async fetchCoordenadas() {
      const { uuid } = this.$route.params;

      const {
        data: { coleccion, limite },
      } = await this.axios.get(`desplazamiento/${uuid}`, {
        params: { tipo: 'geojson' },
      });

      this.geojson = coleccion;
      this.mapa.flyToBounds(limite);
    },
  },
};
</script>
