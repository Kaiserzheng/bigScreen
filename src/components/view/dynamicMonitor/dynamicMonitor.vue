<template>
  <div id="map2dBox">
    <div id="map2D" ref="map">
      <toolTwo  v-if="map" :fullScreenDomID="'map2D'" @timeSliderToggle="timeSliderToggle" :timeSliderPosition="timeSliderPosition" :layerTSC="layerTimeSlideControl" :map="map" />
      <div ref="tipCt" id="tip" v-show="tipShow" v-bind:style="{left:left,top:top}">{{tipMessage}}</div> <!-- 鼠标移上tip框 -->
      <div id="locationTitle"></div> <!-- 左下角经纬度 -->
      <leftTree @thematicChange="thematicChange" /> <!-- 左上角图层管理 -->
      <layerChange v-if="map" :map="map" /> <!-- 基础底图切换 -->
      <toollegend></toollegend> <!-- 图例 -->
      <!--<information></information> 动态监测统计图表-->
    </div>
    <!-- ol弹窗不能直接使用组件作为父容器，故套一层 -->
    <div id="popup" class="ol-popup">
      <popup @popupClose="popupClose" @panoramaShow="panoramaFlag=true" v-if="popupData" ref="popup" :popupData="popupData" />
    </div>
    <!-- tranform影响fixed定位，只能提到父元素 -->
    <div id="panoramaBoxTop" v-if="panoramaFlag">
      <i @click="panoramaClose" id="panorama-closer" class="el-icon-close"></i>
      <div id="panoramaBox"></div>
      <div class="imgBox">
        <!-- 内层盒子——内容区 -->
        <div class="con">
          <img @click="panoramaUrlChange(item)" v-for="(item, index) of popupData.tabs[1]['data']" :key="index" :src="item" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ol from "openlayers";
  import "@supermap/iclient-openlayers";
  import toolTwo from "@/components/common/map/tools/toolTwo";
  import layerChange from "@/components/common/map/tools/layerChange";
  import toollegend from "./tools/toollegend";
  // import information from "@/components/view/pecialMonitor/tools/information";
  import leftTree from "./tools/leftTree";
  import popup from "./tools/popup";
  import { setTimeout } from "timers";
  export default {
    name: "specialMap",
    data() {
      return {
        map: null,
        layers: {
          ztCeshi: null
        },
        left: 0,
        top: 0,
        tipMessage: '',
        tipShow:false,
        panoramaFlag: false,
        popupData: null,
        timeSliderPosition: '40px',
      };
    },
    components: {
      toolTwo,
      layerChange,
      leftTree,
      popup,
      toollegend,
    },
    computed: {
      layerTimeSlideControl: function() {
        let imgLayerConfig = this.$config.dynamicImageLayers
        return imgLayerConfig
      }
    },
    mounted() {
      setTimeout(() => {
        this.map2DInit();
      }, 100);
    },
    methods: {
      map2DInit() {
        // 初始化地图信息
        let container = document.getElementById("popup");
        let content = document.getElementById("popup-content");
        this.overlay = new ol.Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
            duration: 250
          }
        });

        this.map = new ol.Map({
          target: "map2D",
          view: new ol.View({
            center: this.$config.mapTwoInit.center,
            zoom: this.$config.mapTwoInit.zoom,
            projection: this.$config.mapTwoInit.projection,
            resolutions: this.$config.mapTwoInit.resolutions
          }),
          overlays: [this.overlay]
        });
        //专题图层添加
        //  this.ztLayerAdd();
        //缩放控件
        this.map.addControl(new ol.control.Zoom());
        //实时显示坐标
        let mousePositionControl = new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(4),
          projection: "EPSG:4326",
          className: "custom-mouse-position",
          target: document.getElementById("locationTitle"),
          undefinedHTML: "&nbsp"
        });
        this.map.addControl(mousePositionControl);
        //添加点击事件
        this.mapClick();
        this.addImageHandler();
      },
      addImageHandler() {
        for (const item of this.$config.dynamicImageLayers) {
          let layer = new ol.layer.Tile({
            source: new ol.source.TileSuperMapRest({
              url: item.url,
              wrapX: true
            }),
            id: item.mapName,
            visible: false,
            projection: "EPSG:4326"
          });
          this.map.addLayer(layer)
        }
      },
      thematicChange(data,selfCheck,childCheck) {
        this.ztLayerAdd(data,selfCheck,childCheck);
      },
      ztLayerAdd(data,selfCheck,childCheck) {
        if (selfCheck) {
          if (data.type == "vectortile") {
            let url = data.url + '/style.json';
            let format = new ol.format.MVT({
              featureClass: ol.Feature
            });

            function styleFunction() {
              return new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: '#FFFF00',
                  lineCap: "butt",
                  width: 5
                }),
                image: new ol.style.Circle({
                  radius: 5,
                  stroke: new ol.style.Stroke({
                    color: '#FFFF00',
                    width: 3
                  }),
                  fill: new ol.style.Fill({
                    color: '#FFFF00'
                  })
                })
              })
            }

            let style = new ol.supermap.MapboxStyles({
              style: url,
              source: data.mapName,
              map: this.map,
              selectedStyle: styleFunction
            })
            style.on('styleloaded', () => {
              let vectorLayer = new ol.layer.VectorTile({
                declutter: true,
                source: new ol.source.VectorTileSuperMapRest({
                  style: url,
                  projection: 'EPSG:4326',
                  source: data.mapName,
                  format: format
                }),
                id: data.mapName,
                style: style.getStyleFunction()
              });
              this.map.addLayer(vectorLayer);

              let that = this;
              this.map.on('pointermove', (e) => {
                let isUpdate = false;
                that.map.forEachFeatureAtPixel(e.pixel, (feature) => {
                  isUpdate = true;
                  style.setSelectedId(feature.getProperties().SmID, feature.getProperties().layer);
                  ((e, feature) => {
                    that.tipShow = true;
                    that.left = e.pixel[0] + 10 + "px";
                    that.top = e.pixel[1] + 10 + "px";
                    let prop = feature.getProperties();
                    that.tipMessage = prop.NAME;
                  })(e, feature);
                }, {hitTolerance: 5});
                if (isUpdate == false) {
                  that.tipShow = false;
                  style.setSelectedId();
                }
                vectorLayer.changed();
              });
            })
          } else if (data.type == "tile"){
            let tileLayer = new ol.layer.Tile({
              source: new ol.source.TileSuperMapRest({
                url: data.url,
                wrapX: false
              }),
              id: data.mapName,
              projection: "EPSG:4326"
            });
            this.map.addLayer(tileLayer);
          }
        } else {
          let layers = this.map.getLayers();
          layers.forEach(function(element,index,array){
            if (element.get("id") === data.mapName){
              layers.remove(element);
              return;
            }
          })
        }
      },
      mapClick() {
        let that = this;
        this.map.on('click', (evt) => {
            // let pixel = this.map.getEventPixel(evt.originalEvent);
            that.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
              var jsonUrl = './static/polyinfo.json';
              var prop = feature.getProperties();
              if (prop.layer.indexOf("排污口") != -1){
                jsonUrl = './static/polyinfoPaiWuKou.json';
              }
              this.axios.get(jsonUrl).then((res) => {
                that.popupData = res.data;
                that.popupData.title = prop.NAME;
                that.overlay.setPosition(evt.coordinate);
              }).catch((err) => {
              })
            }, {hitTolerance: 5})
          }
          )
      },
      popupClose() {
        this.overlay.setPosition(undefined);
      },
      panoramaClose() {
        this.panoramaFlag = false
      },
      panoramaUrlChange(url) {
        this.$refs.popup.panoramaUrl = url
      },
      //时间轴显示隐藏
      timeSliderToggle(visiable,value) {
        let imgLayerConfig = this.$config.dynamicImageLayers
        if (visiable == false){  //时间轴不可见
          let arr = []
          for (const itme of imgLayerConfig) {
            arr.push({
              id: itme.mapName,
              toggle: false
            })
          }
          this.layerControl(arr) //全部显示
        }else{
          let arr = []
          for (let i = 0; i < imgLayerConfig.length; i++) {
            const element = imgLayerConfig[i];
            if (element.label == value) { //label值对应时间轴时间
              arr.push({
                id: element.mapName,
                toggle: true
              })
            } else {
              arr.push({
                id: element.mapName,
                toggle: false
              })
            }
          }
          this.layerControl(arr)  //显示上次时间轴选定的
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
      },
    }
  };
</script>
<style lang="scss" scoped>
  #map2dBox {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    #map2D {
      height: 100%;
      flex: 1;
      background: #ffffff;
      position: relative;
      transition: width 0.5s linear;
      #tip {
        position: absolute;
        z-index: 33;
        background: #fcffd1;
        font-size: 10px;
        border: 1px solid #0096ff;
        padding: 0.1em 0.3em 0.1em;
        border-radius: 3px;
        box-shadow: 0 0 0.75em #777777;
      }
      .telescopic{
        position: absolute;
        left: 0;
        height: 20px;
        width: 6px;
        border-radius: 0 3px 3px 0;
        background: $mainbag;
        top: 50%;
        margin-top: -10px;
        i{
          font-size: 16px;
        }
      }
    }
    #locationTitle {
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
  .ol-popup {
    position: absolute;
    background-color: white;
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding:  0 15px 15px 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 580px;
  }
  .ol-popup:after,
  .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  #panoramaBoxTop{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    #panoramaBox{
      height: 100%;
      width: 100%;
    }
    .imgBox{
      width: 100%;
      height: 100px;
      background: rgba(204, 204, 204, 0.3);
      position: absolute;
      bottom: 0;
      left: 0;
      overflow-x: auto;
      overflow-y: hidden;
      .con{
        height: 100%;
        min-width: 500px;
        white-space:nowrap;
        img{
          height: 100%;
          cursor: pointer;
          margin-left: 10px;
          display:inline-block;
        }
      }

    }
    #panorama-closer{
      position: absolute;
      right: 10px;
      top: 10px;
      display: block;
      height: 24px;
      width: 24px;
      font-size: 24px;
      line-height: 20px;
      cursor: pointer;
    }
  }
</style>
