<template>
  <div class="topBox">
    <div class="tool-nav-icon" title="展开面板" :class="{'active': panelHide}" @click="panelHide = false" ref="tips"><Icon type="logo-buffer" /></div>
    <div class="tool-nav-list" :class="{'hidden': panelHide}" ref="content" id="toolNav">
      <div class="title" @mousedown.stop="mousedown($event)">
        <div class="icon-content" title="收起面板" @click.stop="panelHide = true"><Icon type="logo-buffer" /></div>
        <p>{{navListTitle}}</p>
      </div>
      <div>
        <el-tree
          class="leftTree"
          :data="treeData"
          show-checkbox
          node-key="id"
          @check-change="checkChange"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "leftTree",
    components: {

    },
    data() {
      return {
        panelHide: false,
        navlistData: [],
        treeData: this.$config.thematicMonitoringTree,
        navListTitle: '图层管理',
      }
    },
    methods: {
      // 拖动
      mousedown(event) {
        let toolNav= document.getElementById('toolNav');

        let distanceX = event.clientX - toolNav.offsetLeft
        let distanceY = event.clientY - toolNav.offsetTop
        document.onmousemove = (e) => {
          var m = e.clientX - distanceX
          var n = e.clientY - distanceY
          if(m<0){
            m=0
          }else if(m>document.documentElement.clientWidth-toolNav.offsetWidth){
            m=document.documentElement.clientWidth-toolNav.offsetWidth
          }

          if(n<0){
            n=0
          }else if(n>document.documentElement.clientHeight-toolNav.offsetHeight-75){
            n=document.documentElement.clientHeight-toolNav.offsetHeight-75
          }
          this.$refs.tips.style.right = document.body.clientWidth - this.$refs.content.offsetWidth - m + 'px';
          this.$refs.tips.style.top = n + 'px';
          toolNav.style.right = document.body.clientWidth - this.$refs.content.offsetWidth - m + 'px';
          toolNav.style.top = n+ 'px';
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
      },

    // 设置河湖监测列表高度
    checkChange(data,selfCheck,childCheck){
      console.log(selfCheck)
      this.$emit("thematicChange",data,selfCheck,childCheck);
    }
  },
  mounted() {
    this.$nextTick(() => {

    })
  }
}
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
    top: 5px;
    right: 20px;
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
    width: 230px;
    position: absolute;
    min-height: 200px;
    top: 5px;
    right: 20px;
    border-radius: 4px;
    box-sizing: content-box;
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
      width: 100%;
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
        font-size: 24px;
        padding-left: 5px;
        pointer-events: none;
        user-select: none;
      }
    }
    .nav-content {
      padding: 0 8px;
      min-height: 115px;
      width: 100%;
      min-height: 160px;
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
    /deep/ .el-tree-node__label{
      font-size: 20px!important;
      padding-left: 5px;
    }
    /deep/ .el-tree-node__content{
      margin-top: 5px;
    }
  }
</style>
