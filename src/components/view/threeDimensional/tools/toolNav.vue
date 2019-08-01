<template>
  <div v-if="navHeight">
    <div
      class="tool-nav-icon"
      title="展开面板"
      :class="{'active': panelHide}"
      @click="panelHide = false"
      ref="tips"
    >
      <i class="el-icon-s-order icon"></i>
    </div>
    <div class="tool-nav-list" :style="{'height': navHeight + 'px'}" :class="{'hidden': panelHide}" ref="content">
      <div class="title" @mousedown.stop="mousedown($event)">
        <div class="icon-content" title="收起面板" @click.stop="panelHide = true">
          <i class="el-icon-s-order icon"></i>
        </div>
        <p>{{navListTitle}}</p>
      </div>
      <div :style="{'height': (navHeight - 30) + 'px'}">
        <happy-scroll resize hide-horizontal color="#2d8cf0">
          <div class="nav-content">
            <div
              class="item"
              v-for="item in navlistData"
              :key="item.id"
              @click="navHandle(item)"
            >{{item.name}}</div>
          </div>
        </happy-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import { HappyScroll } from "vue-happy-scroll";
export default {
  name: "toolNav",
  components: {
    HappyScroll
  },
  props: ['cesiumInstance'],
  data() {
    return {
      navListTitle: '河湖监测对象',
      panelHide: false,
      navHeight: 0,
      navlistData: []
    };
  },
  methods: {
    // 拖动
    mousedown(event) {
      let distanceX = event.clientX - this.$refs.content.offsetLeft
      let distanceY = event.clientY - this.$refs.content.offsetTop
      document.onmousemove = (e) => {
        this.$refs.content.style.left = e.clientX - distanceX + 'px'
        this.$refs.content.style.top = e.clientY - distanceY + 'px'
        this.$refs.tips.style.left = e.clientX - distanceX + 'px'
        this.$refs.tips.style.top = e.clientY - distanceY + 'px'
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    // 设置河湖监测列表高度
    setNavHeight() {
      this.navHeight = 260;
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
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: $background;
  position: absolute;
  left: 20px;
  top: 5px;
  z-index: 29;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  i {
    font-size: 20px;
    color: #fff;
  }
  &.active {
    opacity: 1;
    pointer-events: auto;
    z-index: 31;
  }
}
.tool-nav-list {
  width: 150px;
  position: absolute;
  border-radius: 4px;
  left: 20px;
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
    height: 30px;
    width: 150px;
    display: flex;
    align-items: center;
    background-color: $background;
    color: #fff;
    white-space: nowrap;
    cursor: move;
    .icon-content {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        font-size: 20px;
        color: #fff;
      }
    }
    p {
      font-size: 14px;
      padding-left: 5px;
      pointer-events: none;
      user-select: none;
    }
  }
  .nav-content {
    padding: 0 8px;
    min-height: 115px;
    width: 150px;
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
  .nav-content > .item:nth-last-child(2) {
    border-bottom: none;
  }
}
</style>
