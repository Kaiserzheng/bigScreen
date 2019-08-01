<template>
  <div id="mapType-wrapper">
    <div
      v-for="(item, index) of layerList"
      @click="layerChange(item.mapName)"
      :class="{ active : active==item.mapName}"
      class="mapTypeCard"
      :key="index">
      <span>{{item.label}}</span>
    </div>
  </div>
</template>

<script>
import ol from "openlayers";
import "openlayers/css/ol.css";
import '@supermap/iclient-openlayers';
export default {
  name: 'layerChange',
  data() {
    return {
      active: this.$config.baseLayers[0].mapName,
      layerList: this.$config.baseLayers,
      baseLayers: {

      },
    }
  },
  props: [
    'map'
  ],
  components: {

  },
  mounted() {
    //添加图层列表
    for (const item of this.layerList) {
      this.baseLayers[item.mapName] = new ol.layer.Tile({
        source: new ol.source.TileSuperMapRest({
          url: item.url,
          wrapX: false
        }),
        id: item.mapName,
        visible: false,
        projection: "EPSG:4326"
      });
      let layers = this.map.getLayers();
      layers.insertAt(0,this.baseLayers[item.mapName])
    }
    this.baseLayers[this.layerList[0].mapName].setVisible(true)


  },
  methods: {
    layerChange(mapName){
      for (const key in this.baseLayers) {
        if (this.baseLayers.hasOwnProperty(key)) {
          const element = this.baseLayers[key];
          element.setVisible(false)
        }
      }
      this.baseLayers[mapName].setVisible(true);
      this.active = mapName;
    }
  },
}
</script>
<style lang="scss" scoped>
  #mapType-wrapper{
    width: 78px;
    height: 73px;
    position: absolute;
    right: 10px;
    bottom: 20px;
    z-index: 20;
    .mapTypeCard{
      width: 68px;
      height: 63px;
      position: absolute;
      border-color: transparent;
      border-style: solid;
      border-width: 5px 5px;
      transition:all 0.5s ease;
      background: url('../../../../assets/map/layerChange.png') no-repeat center;
      overflow: hidden;
      background-clip: content-box;
      cursor: pointer;
      box-sizing: content-box;
      span{
        height: 20px;
        width: 100%;
        background-color: rgba(0,0,0,0.5);
        display:block;
        text-align: center;
        padding: 0 3px;
        line-height: 20px;
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 12px;
        color: #ffffff;
      }
      &.active span{
        color: #eec722;
      }
    }
    .mapTypeCard{
      &:nth-child(1){
        z-index: 20;
        background-position: 0 0px;
        left: 8px;
      }
      &:nth-child(2){
        z-index: 19;
        background-position: 0 -63px;
        left: 4px;
      }
      &:nth-child(3){
        z-index: 18;
        background-position: 0 -126px;
      }
    }
  }
  #mapType-wrapper:hover{
    .mapTypeCard{
      &:nth-child(1){
        border-color: #ffffff;
      }
      &:nth-child(2){
        transform: translateX(-68px);
        border-color: #ffffff;
      }
      &:nth-child(3){
        transform: translateX(-136px);
        border-color: #ffffff;
      }
    }
  }
</style>
