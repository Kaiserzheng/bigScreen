<template>
  <div id="toolTwo">
    <div :class="{ active: toolState.distace }" @click="measureDistance()" class="toolChild">距</div>
    <div :class="{ active: toolState.area }" @click="measureArea()" class="toolChild">面</div>
    <div @click="clearAll()" class="toolChild">清</div>
  </div>
</template>

<script>
import ol from "openlayers";
import "@supermap/iclient-openlayers";
export default {
  name: "toolTwo",
  data() {
    return {
      toolState: {
        distace: false,
        area: false
      },
      source: null,
      draw: null,
      interaction: null,
      feature: null
    };
  },
  props: ["map"],
  components: {},
  mounted() {
    setTimeout(() => {
      this.init();
    }, 2000);
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
    measureDistance() {
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
              message: serviceResult.result.distance + "米",
              type: "success"
            });
          });
        });
        this.map.addInteraction(this.interaction);
      } else {
        this.toolState.distace = false;
      }
    },
    measureArea() {
      this.clearInteraction();
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
              message: serviceResult.result.area + "平方米",
              type: "success"
            });
          });
        });
        this.map.addInteraction(this.interaction);
      } else {
        this.toolState.area = false;
      }
    },
    clearInteraction() {
      if (this.interaction) {
        this.map.removeInteraction(this.interaction);
      }
    },
    clearAll() {
      this.clearInteraction();
      this.source.clear();
      this.toolState.area = false;
      this.toolState.distace = false;
    }
  }
};
</script>
<style lang="scss" scoped>
#toolTwo {
  height: 24px;
  line-height: 24px;
  min-width: 24px;
  border-radius: 4px;
  overflow: hidden;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 20;
  background: #ffffff;
  .toolChild {
    height: 22px;
    width: 22px;
    border: 1px steelblue solid;
    float: left;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: #a35858;
    }
    &.active {
      background: #000000;
      color: #ffffff;
    }
  }
}
</style>
