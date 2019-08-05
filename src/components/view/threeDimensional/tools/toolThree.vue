<template>
  <div id="toolThree" ref="toolBar">
    <div class="block" ref="timeSlider" v-show="timeLineShow">
      <el-slider v-model="currentTime" :show-tooltip="false" :step="1" :marks="marks" :min="0" :max="4" show-stops @change="getChangeTime"></el-slider>
    </div>
    <div class="tranBox" ref="tranBox">
      <dl @click="distance()">
        <dt class="distance">
          <span class="iconfont icon-ceju"></span>
        </dt>
        <dd>测距</dd>
      </dl>
      <dl @click="area()">
        <dt class="area">
          <span class="iconfont icon-cemian"></span>
        </dt>
        <dd>测面</dd>
      </dl>
      <dl @click="height()">
        <dt class="height">
          <span class="iconfont icon-cegaodu"></span>
        </dt>
        <dd>测高</dd>
      </dl>
      <dl @click="clearAll()">
        <dt class="clear">
          <span class="iconfont icon-qingchu"></span>
        </dt>
        <dd>清除</dd>
      </dl>
      <dl @click="timeLineShowHandle()">
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
    <div ref="locationTitle" class="locationTitle"></div>
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "toolThree",
  data() {
    return {
      handlerHeight: null,
      handlerDis: null,
      handlerArea: null,
      marks: {
        0: "1988",
        1: "1998",
        2: "2008",
        3: "2018",
        4: "2019"
      },
      currentTime: ['1988'],
      ceshi1: null,
      ceshi2: null,
      ceshi3: null,
      ceshi4: null,
      layers: [],
      toolWidth: null,
      tranWidth: null,
      timeLineShow: false
    };
  },
  props: ["cesiumInstance"],
  components: {},
  mounted() {

    this.$nextTick(() => {
      this.init();
      this.$refs.toolBar.style.width = this.$refs.toolBar.offsetWidth + 'px'
      this.toolWidth = this.$refs.toolBar.offsetWidth
      this.tranWidth = this.$refs.tranBox.offsetWidth
    })
  },
  methods: {
    // 时间拖动获取当前选择时间
    getChangeTime(time) {
      this.currentTime = time
      this.$emit('addImageLayer', time)
    },

    // 时间轴显示隐藏
    timeLineShowHandle() {
      this.timeLineShow = !this.timeLineShow
      if (this.timeLineShow) {  // 添加影像图层
        this.$emit('addImageLayer', this.currentTime)
      } else {                  // 关闭影像图层
        this.$emit('closeImageLayer')
      }
    },

    init() {
      let clampMode = 0; // 空间模式
      let Cesium = this.cesiumInstance.Cesium;
      let viewer = this.cesiumInstance.viewer;
      let scene = viewer.scene;
      //初始化测量距离
      this.handlerDis = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Distance,
        clampMode
      );
      //注册测距功能事件
      this.handlerDis.measureEvt.addEventListener(result => {
        let dis = Number(result.distance);
        let distance =
          dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
        this.handlerDis.disLabel.text = "距离:" + distance;
      });
      this.handlerDis.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });

      //初始化测量面积
      this.handlerArea = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.Area,
        clampMode
      );
      this.handlerArea.measureEvt.addEventListener(result => {
        let mj = Number(result.area);
        let area =
          mj > 1000000
            ? (mj / 1000000).toFixed(2) + "km²"
            : mj.toFixed(2) + "㎡";
        this.handlerArea.areaLabel.text = "面积:" + area;
      });
      this.handlerArea.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });
      //初始化测量高度
      this.handlerHeight = new Cesium.MeasureHandler(
        viewer,
        Cesium.MeasureMode.DVH
      );
      this.handlerHeight.measureEvt.addEventListener(result => {
        let distance =
          result.distance > 1000
            ? (result.distance / 1000).toFixed(2) + "km"
            : result.distance + "m";
        let vHeight =
          result.verticalHeight > 1000
            ? (result.verticalHeight / 1000).toFixed(2) + "km"
            : result.verticalHeight + "m";
        let hDistance =
          result.horizontalDistance > 1000
            ? (result.horizontalDistance / 1000).toFixed(2) + "km"
            : result.horizontalDistance + "m";
        this.handlerHeight.disLabel.text = "空间距离:" + distance;
        this.handlerHeight.vLabel.text = "垂直高度:" + vHeight;
        this.handlerHeight.hLabel.text = "水平距离:" + hDistance;
      });
      this.handlerHeight.activeEvt.addEventListener(function(isActive) {
        if (isActive == true) {
          viewer.enableCursorStyle = false;
          viewer._element.style.cursor = "";
          $("body")
            .removeClass("measureCur")
            .addClass("measureCur");
        } else {
          viewer.enableCursorStyle = true;
          $("body").removeClass("measureCur");
        }
      });

      //实时经纬度
      let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      handler.setInputAction((e) => {
        let position = scene.pickPosition(e.endPosition);
        //将笛卡尔坐标转化为经纬度坐标
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        let height = cartographic.height<0 ? 0 : cartographic.height.toFixed(4);
        this.$refs.locationTitle.innerText = '经度'+ longitude +'， 纬度'+ latitude +'， 高度'+ height + '米'
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    distance() {
      this.deactiveAll();
      this.handlerDis && this.handlerDis.activate();
    },
    area() {
      this.deactiveAll();
      this.handlerArea && this.handlerArea.activate();
    },
    height() {
      this.deactiveAll();
      this.handlerHeight && this.handlerHeight.activate();
    },
    deactiveAll() {
      this.handlerDis && this.handlerDis.deactivate();
      this.handlerArea && this.handlerArea.deactivate();
      this.handlerHeight && this.handlerHeight.deactivate();
    },
    clearAll() {
      this.handlerDis && this.handlerDis.clear();
      this.handlerArea && this.handlerArea.clear();
      this.handlerHeight && this.handlerHeight.clear();
    },
    screen(event) {
      let parentDl = null;
      if (event.target.tagName == "DL") {
        parentDl = event.target;
      } else if(event.target.tagName == "DT"||event.target.tagName == "DD"){
        parentDl = event.target.parentNode;
      }else if(event.target.tagName == "SPAN"){
        parentDl = event.target.parentNode.parentNode;
      }
      if (parentDl.children[1].innerText == "全屏") {
        parentDl.children[1].innerText = "恢复";
        parentDl.children[0].children[0].className = "iconfont icon-tuichuquanping";
        this.fullScreen(document.getElementById("map3dBox"));
      } else {
        parentDl.children[1].innerText = "全屏";
        parentDl.children[0].children[0].className = "iconfont icon-quanping";
        this.exitFullScreen(document.getElementById("map3dBox"));
      }
    },
    flyToHome() {
      let viewer = this.cesiumInstance.viewer;
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(113.6108, 42.7506, 1800000.0)
      });
    },
    getCurrentExtent() {
      //获取三维地图当前范围的方法
      let Cesium = this.cesiumInstance.Cesium;
      let viewer = this.cesiumInstance.viewer;
      let scene = viewer.scene;
      let widget = viewer.cesiumWidget;

      // 范围对象
      let extent = {};
      // 得到当前三维场景
      // 得到当前三维场景的椭球体
      let ellipsoid = scene.globe.ellipsoid;
      let canvas = scene.canvas;
      // canvas左上角
      let car3_lt = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(0, 0),
        ellipsoid
      );
      // canvas右下角
      let car3_rb = viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(canvas.width, canvas.height),
        ellipsoid
      );
      // 当canvas左上角和右下角全部在椭球体上
      if (car3_lt && car3_rb) {
        let carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
        let carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb.latitude);
      } else if (!car3_lt && car3_rb) {
        // 当canvas左上角不在但右下角在椭球体上
        let car3_lt2 = null;
        let yIndex = 0;
        do {
          // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
          yIndex <= canvas.height ? (yIndex += 10) : canvas.height;
          car3_lt2 = viewer.camera.pickEllipsoid(
            new Cesium.Cartesian2(0, yIndex),
            ellipsoid
          );
        } while (!car3_lt2);
        let carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
        let carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
        extent.xmin = Cesium.Math.toDegrees(carto_lt2.longitude);
        extent.ymax = Cesium.Math.toDegrees(carto_lt2.latitude);
        extent.xmax = Cesium.Math.toDegrees(carto_rb2.longitude);
        extent.ymin = Cesium.Math.toDegrees(carto_rb2.latitude);
      }
      // 获取高度
      extent.height = Math.ceil(viewer.camera.positionCartographic.height);
      return extent;
    },
    getLayers() {
      let Cesium = this.cesiumInstance.Cesium;
      let viewer = this.cesiumInstance.viewer;
      let scene = viewer.scene;
      return scene.imageryLayers._layers;
    },
    exitFullScreen(el) {
      var el = document,
        cfs =
          el.cancelFullScreen ||
          el.webkitCancelFullScreen ||
          el.mozCancelFullScreen ||
          el.exitFullScreen,
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
      let rfs =
          el.requestFullScreen ||
          el.webkitRequestFullScreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullScreen,
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
      if(event.target.tagName=='I'){
        parentDiv = event.target.parentNode;
      }else{
        parentDiv = event.target
      }
      if(parentDiv.children[0].className == 'el-icon-caret-right'){
        this.tranWidth = this.$refs.tranBox.offsetWidth
        parentDiv.children[0].className = 'el-icon-caret-left'
        this.$refs.tranBox.style.display = 'none'
        this.$refs.tranBox.style.transform = 'translate('+this.tranWidth+'px)'
        parentDiv.parentNode.style.width = '10px'
      }else{
        parentDiv.children[0].className = 'el-icon-caret-right'
        this.$refs.tranBox.style.transform = 'none'
        var that = this;
        setTimeout(showTranBox, 500);
        parentDiv.parentNode.style.width = this.toolWidth + 'px'
      }
      function showTranBox(){
        that.$refs.tranBox.style.display = 'block';
      }
    }
  },
  watch: {
    // value1(newValue) {
    //   if (newValue == 1988) {
    //     this.ceshi1.alpha = 1;
    //     this.ceshi2.alpha = 0;
    //     this.ceshi3.alpha = 0;
    //     this.ceshi4.alpha = 0;
    //   } else if (newValue == 1998) {
    //     this.ceshi1.alpha = 0;
    //     this.ceshi2.alpha = 1;
    //     this.ceshi3.alpha = 0;
    //     this.ceshi4.alpha = 0;
    //   } else if (newValue == 2008) {
    //     this.ceshi1.alpha = 0;
    //     this.ceshi2.alpha = 0;
    //     this.ceshi3.alpha = 1;
    //     this.ceshi4.alpha = 0;
    //   } else if (newValue == 2018) {
    //     this.ceshi1.alpha = 0;
    //     this.ceshi2.alpha = 0;
    //     this.ceshi3.alpha = 0;
    //     this.ceshi4.alpha = 1;
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
#toolThree {
  height: 24px;
  position: absolute;
  right: -20000px;
  top: 20px;
  z-index: 66;
  //overflow: hidden;
  border-radius: 4px;
  box-shadow:2px 2px 5px #333333;
  transition:width 0.4s linear;
  .block {
    position: fixed;
    bottom: 60px;
    left: 50%;
    z-index: 30;
    padding: 0 50px 24px 50px;
    overflow: hidden;
    width: 400px;
    border-radius: 5px;
    background: #f1f1f1;
    margin-left: -200px;
    display: block;
    /deep/ .el-slider__marks-text{
      font-size: 18px;
      white-space:nowrap;
    }
  }
  .tranBox{
    height: 24px;
    float: left;
    background: #ffffff;
    overflow:hidden;
    margin-right: 10px;
    transition:transform 0.4s linear;
  }
  dl,
  dt,
  dd {
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
    padding: 0 5px;
    font-size: 12px;
    float: left;
  }
  .locationTitle{
    position: fixed;
    bottom: 0;
    left: 20px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    z-index: 21;
    background: rgba(204, 204, 204, 0.3);
    font-size: 16px;
    color: #ffffff;
    border-radius: 5px;
  }
  .toggle{
    width: 10px;
    position: absolute;
    right: 0;
    top: 0;
    border-left: 1px solid #cccccc;
    cursor: pointer;
    background: #ffffff;
    &:hover{
      color: $background;
    }
    i{
      margin:0 -5px;
      line-height: 24px;
      font-size: 18px;
    }
  }
}
</style>
