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
          <l-geo-json
            v-if="geojson"
            :geojson="geojson"
            :options="geojsonOptions"
          >
          </l-geo-json>
          <l-geo-json
            v-if="geojsonLimite"
            :geojson="geojsonLimite"
            :options="geojsonLimiteOptions"
          >
          </l-geo-json>
        </l-map>
      </v-img>
    </v-card-text>
  </v-card>
</template>
<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet';
import { circleMarker } from 'leaflet';

const color = {
  1: 'rgba(255, 99, 132)',
  2: 'rgba(255, 159, 64)',
  3: 'rgba(255, 205, 86)',
  4: 'rgba(75, 192, 192)',
  5: 'rgba(54, 162, 235)',
  6: 'rgba(153, 102, 255)',
  7: 'rgb(92, 70, 156)',
  8: 'rgb(176, 71, 89)',
};

export default {
  name: 'GeoJson',

  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },

  data() {
    return {
      geojson: null,
      geojsonLimite: null,
      geojsonLimiteOptions: {
        pointToLayer(feature, latlng) {
          const fillColor = feature?.properties?.inicio_recorrido ? '#03C988' : 'rgba(255,26,104,1)';
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
          const data = feature?.properties?.fecha_registro;
          if (data) {
            layer.bindPopup(data.replace('T', ' '));
          }
        },
      },
      geojsonOptions: {
        style(feature) {
          return {
            color:
              color[feature?.properties?.medios_desplazamiento?.id]
              || 'rgba(255,26,104,1)',
            weight: 6,
          };
        },
        onEachFeature(feature, layer) {
          const data = feature?.properties?.medios_desplazamiento?.nombre;
          if (data) {
            layer.bindPopup(data);
          }
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
      try {
        const { uuid } = this.$route.params;

        const {
          data: { coleccion, limite },
        } = await this.axios.get(`desplazamiento/${uuid}`);

        this.geojson = coleccion;
        this.geojsonLimite = limite;
      } catch (error) {
        this.$toast.error('Error al cargar los datos.');
        console.log(error);
      }
    },
  },
};
</script>
