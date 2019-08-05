<template>
  <div>
    <div
      class="tool-nav-icon"
      title="展开面板"
      :class="{'active': panelHide}"
      @click="panelHide = false"
      ref="tips"
    >
      <i class="el-icon-s-order icon"></i>
    </div>
    <div class="tool-nav-list" :class="{'hidden': panelHide}" ref="content">
      <div class="title" @mousedown.stop="mousedown($event)" ref="title">
        <div class="icon-content" title="收起面板" @click.stop="panelHide = true">
          <i class="el-icon-s-order icon"></i>
        </div>
        <p>{{navListTitle}}</p>
      </div>
      <div class="scrollContent">
        <el-scrollbar style="height:100%">
          <div class="nav-content">
            <div
              class="item"
              v-for="item in navlistData"
              :key="item.id"
              @click="navHandle(item)"
            >{{item.name}}</div>
          </div>
        </el-scrollbar>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "toolNav",
  components: {

  },
  props: ['cesiumInstance'],
  data() {
    return {
      navListTitle: '河湖监测对象',
      panelHide: false,
      navlistData: []
    };
  },
  methods: {
    // 拖动
    mousedown(event) {
      let toolNav = this.$refs.content
      let distanceX = event.clientX - toolNav.offsetLeft
      let distanceY = event.clientY - toolNav.offsetTop
      document.onmousemove = (e) => {
        let m = e.clientX - distanceX
        let n = e.clientY - distanceY
        if(m<0){
           m=0
        }else if(m>document.documentElement.clientWidth-toolNav.offsetWidth){
           m=document.documentElement.clientWidth-toolNav.offsetWidth
        }
        if(n<0){
          n=0
        }else if(n>document.documentElement.clientHeight-toolNav.offsetHeight){
          n=document.documentElement.clientHeight-toolNav.offsetHeight
        }
        this.$refs.tips.style.right =  document.body.clientWidth - 200 - m + 'px';
        this.$refs.tips.style.top =  n + 'px';
        toolNav.style.right =  document.body.clientWidth - 200 - m + 'px' ;
        toolNav.style.top =  n+ 'px';
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    // 设置河湖监测列表高度
    setNavHeight() {
      // 高度设置完成后渲染列表数据
      this.navlistData = this.$config.waterObject;
    },
    // 列表点击
    navHandle(item) {
      let viewer = this.cesiumInstance.viewer;
      let boundary = item.bound.split(',')
      viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees((parseFloat(boundary[0])+parseFloat(boundary[2]))/2, (parseFloat(boundary[1])+parseFloat(boundary[3]))/2, 500000.0)
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.setNavHeight();
    });
  }
};
</script>
<style lang="scss" scoped>
.tool-nav-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: $background;
  position: absolute;
  right: 20px;
  top: 5px;
  z-index: 29;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  i {
    font-size: 34px;
    color: #fff;
  }
  &.active {
    opacity: 1;
    pointer-events: auto;
    z-index: 31;
  }
}
.tool-nav-list {
  width: 200px;
  position: absolute;
  border-radius: 4px;
  height: 300px;
  right: 20px;
  top: 5px;
  z-index: 30;
  border: 1px solid $background;
  background-color: #fff;
  overflow: hidden;
  transition: width 0.3s ease, height 0.3s ease;
  &.hidden {
    width: 0 !important;
    height: 0 !important;
    pointer-events: none;
  }
  .title {
    height: 40px;
    width: 200px;
    display: flex;
    align-items: center;
    background-color: $background;
    color: #fff;
    white-space: nowrap;
    cursor: move;
    .icon-content {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 34px;
        color: #fff;
      }
    }
    p {
      font-size: 22px;
      padding-left: 5px;
      pointer-events: none;
      user-select: none;
    }
  }
  .scrollContent{
    height: 260px;
    .nav-content {
      padding: 0 8px;
      min-height: 160px;
      width: 200px;
      padding-bottom: 22px;
      > .item {
        padding: 5px 0;
        width: 100%;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        &:hover {
          color: $background;
        }
      }
    }
  }

  .nav-content > .item:nth-last-child(2) {
    border-bottom: none;
  }
}
</style>
