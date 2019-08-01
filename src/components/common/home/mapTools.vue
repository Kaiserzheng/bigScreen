<template>
  <ul class="mapTools">
    <li @click="large" class="large">
      <i class="el-icon-zoom-in"></i>
    </li>
    <li @click="small" class="small">
      <i class="el-icon-zoom-out"></i>
    </li>
    <li @click="flyToHome" class="eyes">
      <i class="el-icon-view"></i>
    </li>
    <li @click="measureDis" class="measureDis">
      <i class="el-icon-edit"></i>
    </li>
    <li @click="measureArea" class="measureArea">
      <i class="el-icon-crop"></i>
    </li>
    <li @click="clearAll" class="clear">
      <i class="el-icon-delete"></i>
    </li>
  </ul>
</template>

<script>
import ol from 'openlayers'
export default {
  name: "mapTools",
  data() {
    return {
      toolState: {
        distace: false,
        area: false
      },
      source: null,
      draw: null,
      interaction: null,
      feature: null,
    };
  },
  props: ['map'],
  components: {

  },
  computed: {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.source = new ol.source.Vector({ wrapX: false });
      let vector = new ol.layer.Vector({
        source: this.source,
        id: "drawLayer"
      });
      this.map.addLayer(vector);
    },
    large() {
      let view = this.map.getView();
      view.animate({
        zoom: view.getZoom() + 1,
        duration: 400
      })
    },
    small() {
      let view = this.map.getView();
      view.animate({
        zoom: view.getZoom() - 1,
        duration: 400
      })
    },
    measureDis() {
      this.clearInteraction();
      let _this = this;
      this.toolState.area = false;
      if (!this.toolState.distace) {
        this.toolState.distace = true;
        this.interaction = new ol.interaction.Draw({
          source: this.source,
          type: "LineString"
        });
        this.interaction.on("drawstart", function(evt) {
          this.feature = evt.feature;
        });
        this.interaction.on("drawend", function() {
          // eslint-disable-next-line no-undef
          let distanceMeasureParam = new SuperMap.MeasureParameters(
            this.feature.getGeometry()
          );
          new ol.supermap.MeasureService(
            "http://support.supermap.com.cn:8090/iserver/services/map-world/rest/maps/World",
            { measureMode: "" }
          ).measureDistance(distanceMeasureParam, function(serviceResult) {
            _this.$message({
              message: parseInt(serviceResult.result.distance) + "米",
              type: "success"
            });
            _this.clearInteraction();
          });
        });
        this.map.addInteraction(this.interaction);
      } else {
        this.toolState.distace = false;
      }
    },
    measureArea() {
      let _this = this;
      this.toolState.distace = false;
      if (!this.toolState.area) {
        this.toolState.area = true;
        this.interaction = new ol.interaction.Draw({
          source: this.source,
          type: "Polygon"
        });
        this.interaction.on("drawstart", function(evt) {
          this.feature = evt.feature;
        });
        this.interaction.on("drawend", function() {
          // eslint-disable-next-line no-undef
          let areaMeasureParam = new SuperMap.MeasureParameters(
            this.feature.getGeometry()
          );
          new ol.supermap.MeasureService(
            "http://support.supermap.com.cn:8090/iserver/services/map-world/rest/maps/World"
          ).measureArea(areaMeasureParam, function(serviceResult) {
            _this.$message({
              message: parseInt(serviceResult.result.area) + "平方米",
              type: "success"
            });
            _this.clearInteraction();
          });
        });
        this.map.addInteraction(this.interaction);
      } else {
        this.toolState.area = false;
      }
    },clearInteraction() {
      if (this.interaction) {
        this.map.removeInteraction(this.interaction);
      }
    },
    clearAll() {
      this.clearInteraction();
      this.source.clear();
      this.toolState.area = false;
      this.toolState.distace = false;
    },
    flyToHome() {
      let extent = new ol.extent.boundingExtent([
        [99.6831,37.6330],
        [129.5730,52.3074]
      ]);
      this.map.getView().fit(extent,{duration:1000});

    }
  },
  watch: {

  },
};
</script>
<style lang="scss" scoped>
  .mapTools{
    box-sizing: content-box;
    height: 534px;
    width: 64px;
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -267px;
    z-index: 10;
    li{
      float: left;
      height: 64px;
      width: 64px;
      border-radius: 32px;
      background: #134d97;
      color: #ffffff;
      margin-bottom: 30px;
      cursor: pointer;
      &:hover{
        background: #3ce2f5;
        color: #134d97;
      }
      &.active{
        background: #3ce2f5;
        color: #134d97;
      }
      i{
        height: 30px;
        width: 30px;
        margin: 16px;
        line-height: 30px;
        font-size: 26px;
        text-align: center;
      }
    }
  }
</style>
