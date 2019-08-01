<template>
  <div id="map2dBox">
    <!-- <toolTwo v-if="map" :map="map" /> -->
    <div id="map2D"></div>
    <layerChange v-if="map" :map="map" />
    <searchBar/>
    <mapTools v-if="map" :map="map" />
  </div>
</template>

<script>
import ol from "openlayers";
import "openlayers/css/ol.css";
import "@supermap/iclient-openlayers";
import toolTwo from "@/common/tools/toolTwo";
import layerChange from "@/common/tools/layerChange";
import searchBar from "../searchBar/searchBar";
import mapTools from "../mapTools/mapTools";
import { setTimeout } from 'timers';
export default {
  name: "home",
  data() {
    return {
      map: null,
    };
  },
  components: {
    toolTwo,
    layerChange,
    searchBar,
    mapTools
  },
  computed: {},
  mounted() {
    setTimeout( () => {
      this.map2DInit();
    },100)
  },
  methods: {
    map2DInit() {
      // 初始化地图信息
      this.map = new ol.Map({
        target: "map2D",
        view: new ol.View({
          center: this.$config.mapTwoInit.center,
          zoom: this.$config.mapTwoInit.zoom,
          projection: this.$config.mapTwoInit.projection,
          resolutions: this.$config.mapTwoInit.resolutions
        })
      });
      // 添加图层在图层切换组件中

    }
  }
};
</script>
<style lang="scss" scoped>
#map2dBox {
  height: 100%;
  width: 100%;
  position: relative;
  #map2D {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: #ffffff;
  }
  #locationTitle{
    position: absolute;
    bottom: 0;
    left: 30px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    background: rgba(204, 204, 204, 0.3);
    font-size: 12px;
    color: #000000;
    z-index: 12;
    border-radius: 5px;
  }
}
</style>
