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
      Agregar filtro de fechas
    </v-card-title>
    <v-card-subtitle>
      Cantidad de registros: {{ features ? features : '0' }}
    </v-card-subtitle>
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
          <l-control-layers position="topright"></l-control-layers>
          <l-tile-layer
            v-for="tileProvider in tileProviders"
            :key="tileProvider.name"
            :name="tileProvider.name"
            :visible="tileProvider.visible"
            :url="tileProvider.url"
            :attribution="tileProvider.attribution"
            layer-type="base"
          />
          <l-geo-json
            v-if="geojson"
            :geojson="geojson"
            :options="geojsonOptions"
          >
          </l-geo-json>
        </l-map>
      </v-img>
    </v-card-text>
  </v-card>
</template>
<script>
import {
  LMap, LTileLayer, LGeoJson, LControlLayers,
} from 'vue2-leaflet';

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
  name: 'GeoJsonFiltro',

  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    LControlLayers,
  },

  data() {
    return {
      features: null,
      geojsonOptions: {
        style(feature) {
          return {
            color:
              color[feature?.properties?.medios_desplazamiento?.id]
              || 'rgb(92, 70, 156)',
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
      tileProviders: [
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
        {
          name: 'CartoDB',
          visible: false,
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
        },
      ],

      config: {
        // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        // attribution:
        //   '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
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
        const {
          data: { coleccion },
        } = await this.axios.get('recorrido/geojson/filtro', {
          params: { fecha_inicio: undefined, fecha_fin: undefined },
        });

        this.geojson = coleccion;
        this.features = coleccion?.features?.length;
      } catch (error) {
        this.$toast.error('Error al cargar los datos.');
        console.log(error);
      }
    },
  },
};
</script>

<style></style>
