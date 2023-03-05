<template>
  <div>
    <v-btn text class="my-2" color="red darken-2" @click="$router.go(-1)">
      Regresar
    </v-btn>
    <l-map
      :style="{ height: '100vh', position: 'fixed !important' }"
      :zoom="zoom"
      :center="center"
    >
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <!-- <l-polyline :lat-lngs="polyline.latlngs" :color="polyline.color">
      </l-polyline> -->

      <l-polyline
        v-for="segmento in segmentosDesplazamiento"
        :weight="+4"
        :lat-lngs="segmento.multilinea"
        :color="segmento.color"
        :key="segmento.id"
      ></l-polyline>
    </l-map>
  </div>
</template>
<script>
import { LMap, LTileLayer, LPolyline } from 'vue2-leaflet';

export default {
  components: {
    LMap,
    LTileLayer,
    LPolyline,
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [13.71171, -89.22236],
      geojson: null,
      polyline: {
        latlngs: [],
        color: 'green',
      },
      segmentosDesplazamiento: [],
    };
  },
  async created() {
    const { uuid } = this.$route.params;

    const {
      data: { segmentos },
    } = await this.axios.get(`desplazamiento/${uuid}`, {
      params: { group: 'yes' },
    });

    this.segmentosDesplazamiento = segmentos;
  },
};
</script>
