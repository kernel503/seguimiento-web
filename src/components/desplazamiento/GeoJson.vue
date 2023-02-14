<template>
  <l-map style="height: 100vh" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-polyline
      :lat-lngs="polyline.latlngs"
      :color="polyline.color"
      weight="5"
    ></l-polyline>
  </l-map>
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
    };
  },
  async created() {
    const { uuid } = this.$route.params;

    const { data: { desplazamiento } } = await this.axios.get(`desplazamiento/${uuid}`);
    this.polyline.latlngs = desplazamiento.map((point) => [point.latitud, point.longitud]);
  },
};
</script>
