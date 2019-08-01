<template>
  <div id="toolTwo" ref="toolBar">
    <div class="tranBox" ref="tranBox">
      <dl @click="measureDistance()">
        <dt class="distance">
          <span class="iconfont icon-ceju"></span>
        </dt>
        <dd>测距</dd>
      </dl>
      <dl @click="measureArea()">
        <dt class="area">
          <span class="iconfont icon-cemian"></span>
        </dt>
        <dd>测面</dd>
      </dl>
      <dl @click="clearAll()">
        <dt class="clear">
          <span class="iconfont icon-qingchu"></span>
        </dt>
        <dd>清除</dd>
      </dl>
      <dl v-if="layerTSC" @click="timeSliderToggle()">
        <dt class="timeSlider">
          <span class="iconfont icon-shijianzhou"></span>
        </dt>
        <dd>时间轴</dd>
      </dl>
      <dl @click="flyToHome()">
        <dt class="flyToHome">
          <span class="iconfont icon-diqiu"></span>
        </dt>
        <dd>全幅</dd>
      </dl>
      <dl @click.stop="screen($event)">
        <dt class="screen full">
          <span class="iconfont icon-quanping"></span>
        </dt>
        <dd>全屏</dd>
      </dl>
    </div>
    <div class="toggle" @click="toggle($event)">
      <i class="el-icon-caret-right"></i>
    </div>
    <div class="block" :style="timeSliderBottom" ref="timeSlider">
      <el-slider v-model="defaultValue"
                 :step="1"
                 :marks="timeSliderOption.marks"
                 :min="0"
                 :max="timeSliderOption.max"
                 show-stops
                 :show-tooltip="false"
      ></el-slider>
    </div>
  </div>
</template>

<script>
  import ol from "openlayers";
  import "@supermap/iclient-openlayers";
  import {setTimeout} from 'timers';

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
        feature: null,
        toolWidth: null,
        tranWidth: null,
        defaultValue: 0,

      };
    },
    props: {
      map: {
        required: true
      },
      layerTSC: {
        type: Array,
      },
      timeSliderPosition: {
        default: function () {
          return '20px'
        }
      },
      fullScreenDomID: {
        default: function () {
          return 'map3dBox'
        }
      }
    },
    components: {},
    computed: {
      timeSliderOption: function () {
        if (!this.layerTSC) {
          return false
        }
        let max = this.layerTSC.length - 1
        let marks = {}
        for (let i = 0; i < this.layerTSC.length; i++) {
          const element = this.layerTSC[i];
          marks[i] = element.label
        }
        return {
          marks: marks,
          max: max,
        }
      },
      timeSliderBottom: function () {
        return {
          bottom: this.timeSliderPosition
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.toolBar.style.width = this.$refs.toolBar.offsetWidth + 'px'
        this.toolWidth = this.$refs.toolBar.offsetWidth
        this.tranWidth = this.$refs.tranBox.offsetWidth
      })
      setTimeout(() => {
        this.init();
      }, 2000);
    },
    methods: {
      init() {
        this.source = new ol.source.Vector({wrapX: false});
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
          this.interaction.on("drawstart", function (evt) {
            this.feature = evt.feature;
          });
          this.interaction.on("drawend", function () {
            // eslint-disable-next-line no-undef
            let distanceMeasureParam = new SuperMap.MeasureParameters(
              this.feature.getGeometry()
            );
            new ol.supermap.MeasureService(this.$config.measureService, {measureMode: ""}
            ).measureDistance(distanceMeasureParam, function (serviceResult) {
              _this.$message({
                message: serviceResult.result.distance + "米",
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
          this.interaction.on("drawstart", function (evt) {
            this.feature = evt.feature;
          });
          this.interaction.on("drawend", function () {
            // eslint-disable-next-line no-undef
            let areaMeasureParam = new SuperMap.MeasureParameters(
              this.feature.getGeometry()
            );
            new ol.supermap.MeasureService(this.$config.measureService).measureArea(areaMeasureParam, function (serviceResult) {
              _this.$message({
                message: serviceResult.result.area + "平方米",
                type: "success"
              });
              _this.clearInteraction();
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
      },
      flyToHome() {
        var extentInfos = this.$config.fullExtent.split(",");
        let extent = new ol.extent.boundingExtent([
          [extentInfos[0], extentInfos[1]],
          [extentInfos[2], extentInfos[3]]
        ]);
        this.map.getView().fit(extent, {duration: 1000});

      },
      timeSliderToggle() {
        if (this.$refs.timeSlider.style.display == "block") {
          this.$refs.timeSlider.style.display = "none";
          this.$emit('timeSliderToggle',false,this.timeSliderOption.marks[this.defaultValue]);
        } else {
          this.$refs.timeSlider.style.display = "block";
          this.$emit('timeSliderToggle',true,this.timeSliderOption.marks[this.defaultValue]);
        }
      },
      screen(event) {
        let parentDl = null;
        if (event.target.tagName == "DL") {
          parentDl = event.target;
        } else if (event.target.tagName == "DT" || event.target.tagName == "DD") {
          parentDl = event.target.parentNode;
        } else if (event.target.tagName == "SPAN") {
          parentDl = event.target.parentNode.parentNode;
        }
        if (parentDl.children[1].innerText == "全屏") {
          parentDl.children[1].innerText = "恢复";
          parentDl.children[0].children[0].className = "iconfont icon-tuichuquanping";
          this.fullScreen(document.getElementById(this.fullScreenDomID));
        } else {
          parentDl.children[1].innerText = "全屏";
          parentDl.children[0].children[0].className = "iconfont icon-quanping";
          this.exitFullScreen(document.getElementById(this.fullScreenDomID));
        }
      },
      exitFullScreen(el) {
        var el = document,
          cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
          wscript;

        if (typeof cfs != "undefined" && cfs) {
          cfs.call(el);
          return;
        }

        if (typeof window.ActiveXObject != "undefined") {
          wscript = new ActiveXObject("WScript.Shell");
          if (wscript != null) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      fullScreen(el) {
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
          wscript;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
          return;
        }
        if (typeof window.ActiveXObject != "undefined") {
          wscript = new ActiveXObject("WScript.Shell");
          if (wscript) {
            wscript.SendKeys("{F11}");
          }
        }
      },
      toggle(event) {
        let parentDiv = null;
        if (event.target.tagName == 'I') {
          parentDiv = event.target.parentNode;
        } else {
          parentDiv = event.target
        }
        if (parentDiv.children[0].className == 'el-icon-caret-right') {
          this.tranWidth = this.$refs.tranBox.offsetWidth
          parentDiv.children[0].className = 'el-icon-caret-left'
          this.$refs.tranBox.style.transform = 'translate(' + this.tranWidth + 'px)'
          this.$refs.tranBox.style.display = 'none'
          parentDiv.parentNode.style.width = '10px'
        } else {
          parentDiv.children[0].className = 'el-icon-caret-right';
          var that = this;
          setTimeout(showTranBox, 500);
          this.$refs.tranBox.style.transform = 'none'
          parentDiv.parentNode.style.width = this.toolWidth + 'px';

        }
        function showTranBox(){
          that.$refs.tranBox.style.display = 'block';
        }
      },
      layerControl(option) {
        let layers = this.map.getLayers()
        layers.forEach(function (element, index, array) {
          for (const item of option) {
            if (item.id == element.get("id")) {
              element.setVisible(item.toggle)
            }
          }
        })
      }
    },
    watch: {
      defaultValue: function (newValue) {
        this.$emit('timeSliderToggle',true,this.timeSliderOption.marks[newValue]);
      }
    },
  };
</script>
<style lang="scss" scoped>
  #toolTwo {
    min-height: 20px;
    position: absolute;
    right: 0.8em;
    top: 10px;
    z-index: 66;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid #cccccc;
    box-shadow: 2px 2px 5px #333333;
    transition: width 0.4s linear;
    .block {
      position: fixed;
      left: 50%;
      z-index: 30;
      padding: 0 36px 12px 30px;
      overflow: hidden;
      width: 300px;
      border-radius: 5px;
      background: #f1f1f1;
      margin-left: -150px;
      display: none;
    }
    .tranBox {
      height: 24px;
      float: left;
      background: #ffffff;
      overflow: hidden;
      margin-right: 10px;
      transition: transform 0.4s linear;
    }
    dl, dt, dd {
      margin: 0;
      padding: 0;
      line-height: 14px;
    }
    dl {
      height: 24px;
      padding: 5px 3px;
      float: left;
      cursor: pointer;
      &:hover {
        color: $background;
      }
    }
    dt {
      height: 14px;
      width: 14px;
      float: left;
    }
    dd {
      height: 14px;
      line-height: 14px;
      padding: 0 5px;
      font-size: 12px;
      float: left;
    }
    .toggle {
      width: 10px;
      position: absolute;
      right: 0;
      top: 0;
      border-left: 1px solid #cccccc;
      cursor: pointer;
      background: #ffffff;
      &:hover {
        color: $background;
      }
      i {
        margin: 0 -5px;
        line-height: 24px;
        font-size: 18px;
      }
    }
  }
</style>
