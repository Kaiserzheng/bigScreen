<template>
  <div id="mapRiverBox">
    <div id="mapRiver" ref="map">
      <toolTwo :fullScreenDomID="'mapRiver'" @timeSliderToggle="timeSliderToggle" :timeSliderPosition="timeSliderPosition" :layerTSC="layerTimeSlideControl" :map="map" />
      <div ref="tipCt" id="tip" v-show="tipShow" v-bind:style="{left:left,top:top}">{{tipMessage}}</div>
    </div>
    <layerChange v-if="map" :map="map"/>
    <toollegend></toollegend>
    <div class="echarts-toggle" @click="echartsToggle" ref="eachBtncc" :class="{'active': echartsShow}"><i class="el-icon-arrow-down"></i></div>
    <!-- <toolNav></toolNav> -->
  </div>
</template>

<script>
  import ol from "openlayers";
  import "openlayers/css/ol.css";
  import "@supermap/iclient-openlayers";
  import layerChange from "@/components/common/map/tools/layerChange";
  import toolTwo from "@/components/common/map/tools/toolTwo";
  import toollegend from "./toollegend";
  import {setTimeout} from 'timers';

  export default {
    name: "rivateMap",
    props: ["mapName", "mapPosition"],
    data() {
      return {
        map: null,
        timeSliderPosition: '36%',
        riverLakeLys: null,
        left: 0,
        top: 0,
        tipMessage: '',
        tipShow:false,
        echartsShow: false
      };
    },
    components: {
      layerChange,
      toolTwo,
      toollegend

    },
    computed: {
      layerTimeSlideControl: function() {
        let imgLayerConfig = this.$config.riverImageLayers
        return imgLayerConfig
      }
    },
    mounted() {
      setTimeout(() => {
        this.map2DInit();
      }, 100)
    },
    methods: {
      //时间轴显示隐藏
      timeSliderToggle(visiable,value) {
        let layerConfig = this.$config.riverLakeFrontLayers
        let imgLayerConfig = this.$config.riverImageLayers
        if (visiable == false){  //时间轴不可见
          let arr = []
          for (const itme of layerConfig) {
            arr.push({
              id: itme.mapName,
              toggle: true
            })
          }
          for (const itme of imgLayerConfig) {
            arr.push({
              id: itme.mapName,
              toggle: false
            })
          }
          this.layerControl(arr) //全部显示
        }else{
          let arr = []
          for (let i = 0; i < layerConfig.length; i++) {
            const element = layerConfig[i];
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
            if (item.id != 'Section' && item.id == element.get("id")) {
              element.setVisible(item.toggle)
            }
          }
        })
      },
      // echarts 收缩展开
      echartsToggle() {
        if(this.echartsShow){
          this.timeSliderPosition = '36%'
        }else{
          this.timeSliderPosition = '20px'
        }
        this.echartsShow = !this.echartsShow
        this.$emit('toggleEcharts', this.echartsShow)
        if(this.echartsShow===false){
          this.$refs.eachBtncc.style.bottom=-30+'px'
        }else{
          this.$refs.eachBtncc.style.bottom=0+'px'
        }


        setTimeout(() => {
          this.map.updateSize()
        }, 250);
      },

      map2DInit() {
        // 初始化地图信息
        this.map = new ol.Map({
          target: "mapRiver",
          view: new ol.View({
            center: this.$config.mapTwoInit.center,
            zoom: this.$config.mapTwoInit.zoom,
            projection: this.$config.mapTwoInit.projection,
            resolutions: this.$config.mapTwoInit.resolutions
          })
        });
        this.addImgLayers() //添加影像图层
        this.addRiverSectionLayer(); //添加河道横切线
        //缩放控件
        this.map.addControl(new ol.control.Zoom());

        (()=>{
          let riverLakeFrontLayersInfo = this.$config.riverLakeFrontLayers;
          this.riverLakeLys = [];
          let map = this.map;

          function styleFunction() {
            return new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: '#FFFF00',
                lineCap: "butt",
                width: 5
              }),
              image: new ol.style.Circle({
                radius: 5,
                fill: null,
                stroke: new ol.style.Stroke({color: '#FFFF00', width: 1})
              })
            })
          }

          for (const item of riverLakeFrontLayersInfo) {
            let styleURL = item.url;
            var format = new ol.format.MVT({
              featureClass: ol.Feature
            });
            let style = new ol.supermap.MapboxStyles({
              style: styleURL + "/style.json",
              source: item.mapName,
              map: map,
              selectedStyle: styleFunction
            })
            style.on('styleloaded', () =>{
              let vectorLayer = new ol.layer.VectorTile({
                declutter: true,
                source: new ol.source.VectorTileSuperMapRest({
                  style: styleURL + "/style.json",
                  projection: 'EPSG:4326',
                  source: item.mapName,
                  format: format
                }),
                style: style.getStyleFunction(),
                id: item.mapName
              });
              map.addLayer(vectorLayer);
              let that = this;
              map.on('pointermove', (e) => {
                let isUpdate = false;
                map.forEachFeatureAtPixel(e.pixel, (feature) => {
                  isUpdate = true;
                  style.setSelectedId(feature.getProperties().SmID, feature.getProperties().layer);
                  ((e, feature) => {
                    that.left = e.pixel[0] + 10 + "px";
                    that.top = e.pixel[1] + 10 + "px";
                    let prop = feature.getProperties();
                    that.tipMessage = (prop.YEAR ? prop.YEAR : "") + (prop.NAME ? prop.NAME : "");
                    if (that.tipMessage.length > 0) {
                      that.tipShow = true;
                    }
                  })(e, feature);
                }, {hitTolerance: 5});
                if (isUpdate == false) {
                  that.tipShow = false;
                  style.setSelectedId();
                }
                vectorLayer.changed();
              });
            })
          }
        })();

      },
      addImgLayers() {
        for (const item of this.$config.riverImageLayers) {
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
      addRiverSectionLayer() {
        let layer = new ol.layer.Tile({
          source: new ol.source.TileSuperMapRest({
            url: this.$config.riverSection.url,
            wrapX: true
          }),
          id: this.$config.riverSection.mapName,
          visible: false,
          projection: "EPSG:4326"
        });

        this.map.addLayer(layer)
      }

    },
    watch: {
      mapPosition(newVal) {
        let extent = new ol.extent.boundingExtent([
          [newVal[0], newVal[1]],
          [newVal[2], newVal[3]]
        ]);
        this.map.getView().fit(extent, {duration: 1000});
      }
    }
  };
</script>
<style lang="scss" scoped>
  #mapRiverBox {
    height: 100%;
    width: 100%;
    position: relative;
    transition: all 0.2s ease;
    #mapRiver {
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
    .echarts-toggle {
      width: 40px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #ddd;
      position: absolute;
      right: 0.6%;
      background:$background;

      // margin-left: -30px;
      bottom: -30px;
      z-index: 35;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &.active{
        > i {
          transform: rotate(180deg);
          color:#fff;
        }
      }
      > i {
        color:#fff;
        font-size: 24px;
        transition: all 0.2s ease;
      }
    }
  ;
    #tip {
      position: absolute;
      z-index: 34;
      background: #fcffd1;
      font-size: 10px;
      border: 1px solid #0096ff;
      padding: 0.1em 0.3em 0.1em;
      border-radius: 3px;
      box-shadow: 0 0 0.75em #777777;
    }
  }
</style>
