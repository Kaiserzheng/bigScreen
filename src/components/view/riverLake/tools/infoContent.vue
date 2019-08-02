<template>
  <div id="infoContent" class="main-content" :style="{left: computedLedft}" :class="{'hidden': panelHide, 'move': moving}">
    <div class="title" @mousedown.stop="mousedown($event)">
      <div class="tool-nav-icon" title="展开面板" :class="{'active': panelHide}" @click.stop="openContent" ref="tips"><i class="el-icon-s-order icon"></i></div>
      <div class="icon-content" title="收起面板" @click.stop="closeContent"><i class="el-icon-s-order icon"></i></div>
      <p>{{infoTitle}}</p>
    </div>
    <div class="content" id="txtContent">
      <div class="resize" @mousedown.stop="contentResize($event)"></div>
      <el-scrollbar class="scrollbar">
        <div v-html="riverLakeInfo"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'infoContent',
  props: ['riverLakeInfo', 'infoTitle'],
  data() {
    return {
      panelHide: false,
      moving: false,
      cWidth: 0,
      cHeight: 0,
      computedLedft: ''
    }
  },
  methods: {
    mousedown(event) {
      let that = this;
      let infoContent = document.getElementById('infoContent');
      let distanceX = event.clientX - infoContent.offsetLeft
      let distanceY = event.clientY - infoContent.offsetTop
      document.onmousemove = (e) => {
        that.moving = true;
        var m = e.clientX - distanceX
        var n = e.clientY - distanceY
        if(m<0){
           m=0
        }else if(m>document.documentElement.clientWidth-infoContent.offsetWidth){
           m=document.documentElement.clientWidth-infoContent.offsetWidth
        }

        if(n<0){
          n=0
        }else if(n>document.documentElement.clientHeight-infoContent.offsetHeight){
          n=document.documentElement.clientHeight-infoContent.offsetHeight
        }
          infoContent.style.left =  m+ 'px' ;
          infoContent.style.top =  n+ 'px';
      }
      document.onmouseup = () => {
        that.moving = false;
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    // 窗口大小改变
    contentResize(event) {
      let that = this;
      let infoContent = document.getElementById('infoContent');
      let txtContent = document.getElementById('txtContent');
      document.onmousemove = (e) => {
        that.moving = true;
        let distanceX = e.clientX - infoContent.offsetLeft;
        let distanceY = e.clientY - infoContent.offsetTop;

        that.cWidth = distanceX < 250 ? 250 : distanceX
        that.cHeight = distanceY < 130 ? 130 : distanceY

        infoContent.style.width =  that.cWidth + 'px';
        infoContent.style.height =  that.cHeight + 'px';
        txtContent.style.height = that.cHeight - 30 + 'px';
      }
      document.onmouseup = () => {
        that.moving = false;
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    // 面板隐藏
    closeContent() {
      this.panelHide = true;
      let infoContent = document.getElementById('infoContent');
      infoContent.style.width = '30px';
      infoContent.style.height = '30px';
    },

    // 面板展开
    openContent() {
      this.panelHide = false;
      let infoContent = document.getElementById('infoContent');
      let width = this.cWidth ? this.cWidth : 250;
      let height = this.cHeight ? this.cHeight : 130;
      infoContent.style.width = width + 'px';
      infoContent.style.height = height + 'px';
    }
  },
  mounted() {
    this.computedLedft = document.body.offsetWidth - 490 + 'px'
  }
}
</script>

<style lang="scss" scoped>
  .main-content {
    width: 250px;
    height: 130px;
    background-color: #fff;
    position: absolute;
    z-index: 30;
    top: 80px;
    border: 1px solid $background;
    overflow: hidden;
    border-radius: 4px;
    transition: all 0.3s ease;
    &.hidden {
      height: 30px;
      width: 30px;
    }
    &.move {
      transition: none;
    }
    .title {
      height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
      background-color: $background;
      color: #fff;
      white-space: nowrap;
      position: relative;
      user-select: none;
      cursor: move;
      > .tool-nav-icon,
      > .icon-content {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        i {
          font-size: 20px;
          color: #fff;
        }
      }
      > .tool-nav-icon {
        pointer-events: none;
        opacity: 0;
        position: absolute;
        background-color: $background;
        top: 0;
        left: 0;
        &.active {
          pointer-events: auto;
          opacity: 1;
        }
      }
    }
    .content {
      width: 100%;
      height: 98px;
      padding: 8px;
      position: relative;
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .scrollbar {
        width: 100%;
        height: 100%;
      }
      .resize {
        width: 10px;
        height: 10px;
        position: absolute;
        right: 0;
        bottom: 0;
        cursor: se-resize;
      }
    }
  }
</style>
