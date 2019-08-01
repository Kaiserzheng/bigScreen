<template>
  <div id="map3dBox">
    <toolThree ref="tool" v-if="cesiumInstance" :cesiumInstance="cesiumInstance" @addImageLayer="addImageLayer"
               @closeImageLayer="closeImageLayer"/>
    <sm-viewer id="map3D" @ready="ready" navigation fullscreenButton></sm-viewer>
    <toolNav v-if="cesiumInstance" :cesiumInstance="cesiumInstance" />

    <!-- 底图切换 -->
    <div class="basic-map-tips" title="底图切换" :class="{'active': basicTipsShow}" @click="basicTipsShow = !basicTipsShow">
      <img :src="basicMapTips" alt=""></div>
    <div class="basic-map-content" :class="{'active': basicTipsShow}">
      <div class="item-content">
        <p class="title">底图选择</p>
        <div class="main">
          <div class="item"
               v-for="(item, index) in basicMapData" :key="index"
               :class="{'active': index == basicMapDefalut}"
               @click="basicMapChange(item, index)">
            <div class="poster"><img :src="item.imgUrl" alt=""></div>
            <p class="name">{{item.cnName}}</p>
          </div>
        </div>
      </div>
      <div class="scence-check">
        <p>地形展示</p>
        <el-checkbox label="开启" v-model="scenceShow" @change="scenceShowChange"></el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import mapBasicLayer from '@/api/staticData/mapBasicLayer.json';
import toolThree from "./tools/toolThree";
import toolNav from "./tools/toolNav";
import { setTimeout, setInterval } from "timers";
export default {
  name: "mapThree",
  data() {
    return {
      handlerHeight: null,
      handlerDis: null,
      handlerArea: null,
      cesiumInstance: null,
      basicTipsShow: false,
      basicContentHeight: 0,
      basicMapData: [],
      basicMapDefalut: 0,
      basicMapTips: '',
      basicMapLayerArr: [],
      viewer: null,
      currentImageLayer: null,
      scenceShow: false
    };
  },
  components: {
    toolThree,
    toolNav
  },
  computed: {},
  mounted() {
    this.$nextTick(function(){

    })
  },
  methods: {
    // 地形添加与否
    scenceShowChange() {
      let viewer = this.viewerObj
      if(this.scenceShow) {
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          url: this.$config.terrain3DLayer,
          isSct: true
        })
        // viewer.terrainProvider = new Cesium.createWorldTerrain({
        //   requestWaterMask: false,
        //   requestVertexNormals: true
        // });
        viewer.scene.globe.showWaterEffect = !isShow;
      } else {
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider({});
      }
    },

    // 添加影像图层
    addImageLayer(time) {
      let imageryLayers = this.viewerObj.imageryLayers

      this.currentTime = time
      this.currentImageLayer && imageryLayers.remove(this.currentImageLayer)

        // 测试

        if (this.$config.threeDimensionalImageLayers != null) {
          var layerInfo = this.$config.threeDimensionalImageLayers[time];
          var layer = new Cesium.SuperMapImageryProvider({
            url: layerInfo.url
          })
          this.currentImageLayer = imageryLayers.addImageryProvider(layer);
        }
      },

      // 关闭影像图层
      closeImageLayer() {
        let imageryLayers = this.viewerObj.imageryLayers
        imageryLayers.remove(this.currentImageLayer)
        this.currentImageLayer = null
      },

      // 获取底图数据
      getBasicMapData() {
        let that = this
        let data = mapBasicLayer.data
        data.map((item, index) => {
          item.imgUrl = require('./../../../assets/map/' + item.poster)
          if (index == 0) {
            that.setBasicImgTips(item.poster)
          }

          let provider = null
          if (item.type == 'WebMap') {
            provider = new Cesium.WebMapTileServiceImageryProvider({
              url: item.resource + '&tk=' + item.key,
              layer: "tdtBasicLayer",
              style: "default",
              format: "image/jpeg",
              tileMatrixSetID: "GoogleMapsCompatible",
              show: true
            })
          } else if (item.type == 'UrlTemplate') {
            provider = new Cesium.UrlTemplateImageryProvider({
              url: item.resource
            })
          } else if (item.type == 'BingMaps') {
            provider = new Cesium.BingMapsImageryProvider({
              key: item.key,
              url: item.resource
            })
          }
          let listData = {
            name: item.enName,
            data: provider
          }
          that.basicMapLayerArr.push(listData)
        })
        that.basicMapData = data
        that.basicMapChange(this.basicMapData[0], 0)
      },

      // 底图标识图
      setBasicImgTips(src) {
        this.basicMapTips = require('./../../../assets/map/' + src)
      },

      // 底图切换设置
      basicMapChange(item, index) {
        let enName = item.enName
        let basicMapLayerArr = this.basicMapLayerArr
        let imageryLayers = this.viewerObj.imageryLayers
        imageryLayers.removeAll()

        for (let i = 0; i < basicMapLayerArr.length; i++) {
          if (basicMapLayerArr[i].name == enName) {
            imageryLayers.addImageryProvider(basicMapLayerArr[i].data)
            this.setBasicImgTips(item.poster)
          }
        }

        if (this.currentImageLayer && this.currentImageLayer != null) {
          this.addImageLayer(this.currentTime)
        }
        this.basicMapDefalut = index
      },

      ready(cesiumInstance) {
        this.cesiumInstance = cesiumInstance;
        let Cesium = cesiumInstance.Cesium;
        this.viewerObj = cesiumInstance.viewer;
        let viewer = this.viewerObj;
        let scene = viewer.scene;
        let widget = viewer.cesiumWidget;

        // 设置底图
        this.getBasicMapData()

        scene.globe.depthTestAgainstTerrain = false //关闭贴地模式
        //飞行动画
        setTimeout(() => {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(113.6108, 42.7506, 1800000.0)
          });
        }, 1000)

        //边界中心点全部加载
        //全国国界
        this.boundaryEntitiesCreate(Cesium, viewer, './static/mapJson/boundaryCountry.json', 'country');
        this.labelEntitiesCreate(Cesium, viewer, './static/mapJson/centerCountry.json', 'country');
        //内蒙市界
        this.boundaryEntitiesCreate(Cesium, viewer, './static/mapJson/boundaryProv.json', 'prov');
        this.labelEntitiesCreate(Cesium, viewer, './static/mapJson/centerProv.json', 'prov');
        // this.boundaryEntitiesCreate(Cesium, viewer, './static/mapJson/boundaryCity.json','city');
        //内蒙县驻地
        this.labelEntitiesCreate(Cesium, viewer, './static/mapJson/centerCity.json', 'city');

        let level = null;
        viewer.camera.moveEnd.addEventListener((moveEndPosition) => {
          let height = parseFloat(this.$refs.tool.getCurrentExtent().height);
          switch (true) {
            case height >= 4000000:
              if (level != 'country') {
                level = 'country'
                for (const item of viewer.entities.values) {
                  if (item.name == 'prov') {
                    item.show = false
                  }
                }
              }
              break;
            case height >= 800000:
              if (level != 'prov') {
                level = 'prov'
                for (const item of viewer.entities.values) {
                  if (item.name == 'prov') {
                    item.show = true
                  } else if (item.name == 'city') {
                    item.show = false
                  }
                }
              }
              break;
            case height < 800000:
              if (level != 'city') {
                level = 'city'
                for (const item of viewer.entities.values) {
                  if (item.name == 'city') {
                    item.show = true
                  }
                }
              }
              break;
          }
        })
      },
      boundaryEntitiesCreate(Cesium, viewer, jsonUrl, level) {
        Cesium.GeoJsonDataSource.load(
          jsonUrl, {
            stroke: new Cesium.Color(1, 1, 1, 0.6),
            fill: new Cesium.Color(255, 255, 255, 0),
            strokeWidth: 1,
          }
        ).then((dataSource) => {
          let entities = dataSource.entities.values;
          for (const item of entities) {
            item.polyline.material = new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.WHITE,
              dashLength: 8,
              dashPattern: 255,
            })
            if (level != 'country') {
              item.show = false
            }
            item.name = level
            viewer.entities.add(item)
          }
        }).otherwise(function (error) {
        });
      },
      labelEntitiesCreate(Cesium, viewer, jsonUrl, level) {

      this.axios.get(jsonUrl).then( (res) => {
        let flag = null
        if(level!='country'){
          flag = false
        }else{
          flag = true
        }
        let dataArr = res.data.features
        for (const item of dataArr) {
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1]),
            id: item.properties.adcode,
            point: new Cesium.PointGraphics({
              pixelSize: 5
            }),
            name: level,
            show: flag,
            label : {
              text : item.properties.NAME,
              font : '16px Microsoft YaHei',
              fillColor : Cesium.Color.WHITE,
              outlineColor : Cesium.Color.BLACK,
              outlineWidth : 2,
              // showBackground : true,
              disableDepthTestDistance : 100.0,
              style : Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset : new Cesium.Cartesian2(0, -14),
            }
          });
        }
      }).catch( (err) => {
      })
    },
  }
};
</script>
<style lang="scss" scoped>
  #map3dBox {
    width: 100%;
    height: 100%;
    position: relative;
    #map3D {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      background: #ffffff;
    }
    .ceshi {
      height: 60px;
      width: 80px;
    }
    .basic-map-tips {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      border: 1px solid #fff;
      position: fixed;
      right: 49px;
      bottom: 20px;
      z-index: 20;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.25s ease;
      &.active {
        bottom: 295px;
        border-color: #3E8FD0;
      }
      &:hover {
        box-shadow: 0 0 15px rgba(62, 143, 208, .8);
      }
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .basic-map-content {
      width: 200px;
      height: 255px;
      border-radius: 4px;
      background-color: #fff;
      position: fixed;
      right: 49px;
      bottom: -300px;
      z-index: 20;
      transition: all 0.25s ease;
      &.active {
        pointer-events: auto;
        opacity: 1;
        bottom: 20px;
      }
      > .scence-check {
        padding: 0 10px;
        padding-top: 10px;
        border-top: 1px solid #ddd;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > p {
          font-size: 15px;
        }
      }
      > .item-content {
        padding: 10px;
        > .title {
          font-size: 15px;
          padding-bottom: 5px;
        }
        > .main {
          overflow: hidden;
          > .item {
            width: 50px;
            float: left;
            margin-right: 15px;
            margin-top: 10px;
            cursor: pointer;
            > .poster {
              width: 50px;
              height: 50px;
              border-radius: 4px;
              overflow: hidden;
              border: 1px solid #ddd;
              > img {
                width: 100%;
                height: 100%;;
              }
            }
            > .name {
              text-align: center;
              font-size: 10px;
              color: #666;
              padding-top: 4px;
            }
            &.active {
              > .poster {
                border-color: #3E8FD0;
              }
              > .name {
                color: #3E8FD0;
              }
            }
          }
        }
        > .main > .item:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
</style>
