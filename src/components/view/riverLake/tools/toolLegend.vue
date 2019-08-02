<template>
  <div>
      <div class="toolLegend-icon" title="展开面板" v-show="panel" @click="panelClick"><i class="el-icon-s-order icon"></i></div>
      <transition name="fade">
        <div class="toollegend-list" id="toollegend-list" ref="content" v-if="panelHideBox">
        <div class="title" @mousedown.stop="mousedown($event)">
          <div class="icon-content" title="收起面板" @click="panelHideBox11"><i class="el-icon-s-order icon"></i></div>
          <p>{{title}}</p>
        </div>
        <div class="toollegend-content">
          <div class="conDiv" v-for="(item, index) in toolLegendList" :key="index" >
            <span class="line" :style="{'backgroundColor':item.color}"></span>
            <span class="lineName">{{item.name}}</span>
          </div>
        </div>
      </div>
      </transition>
  </div>
</template>

<script>
export default {
  name: "toolLegend",
  data() {
    return {
      title:'图例',
      toolLegendList:[],
      panel: false,
      panelHideBox:true
    }
  },
  methods: {
    panelClick(){
        this.panel=false
        this.panelHideBox=true

    },
    panelHideBox11(){
        this.panelHideBox=false
        this.panel=true
    },
    // 拖动
    mousedown(event) {
      let toollegendList= document.getElementById('toollegend-list');

      let distanceX = event.clientX - toollegendList.offsetLeft
      let distanceY = event.clientY - toollegendList.offsetTop
      document.onmousemove = (e) => {
        let m = e.clientX - distanceX
        let n = e.clientY - distanceY
        if(m<0){
          m=0
        }else if(m>document.documentElement.clientWidth-toollegendList.offsetWidth){
          m=document.documentElement.clientWidth-toollegendList.offsetWidth
        }
        if(n<0){
          n=0
        }else if(n>document.documentElement.clientHeight-toollegendList.offsetHeight-75){
          n=document.documentElement.clientHeight-toollegendList.offsetHeight-75
        }
        toollegendList.style.left =  m+ 'px' ;
        toollegendList.style.top =  n+ 'px';
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
  },
  mounted() {
    this.toolLegendList=this.$config.toolLegend
    setTimeout(()=>{
      this.panel=true
      this.panelHideBox=false
    },2000)
  }
}
</script>
<style lang="scss" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .toolLegend-icon{
    width: 30px;
    height: 30px;
    background:$background;
    position: absolute;
    right: 5px;
    color: #fff;
    font-size: 22px;
    padding: 0px 4px;
    bottom: 90px;
    z-index: 55;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .toollegend-list{
    border-radius:4px;
    box-sizing: content-box;
    width: 150px;
    position: absolute;
    right: 5px;
    top:139px;
    z-index: 30;
    border: 1px solid $background;
    background-color:$workspacebag;
    overflow: hidden;
    transition: width 0.3s ease, height 0.3s ease;
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
    .toollegend-content{
      padding: 0 8px;
      width: 150px;
      >.conDiv{
        padding: 3px 0;
        width: 100%;
        >.line{
          width:25px;
          height:4px;
          border-radius: 5px;
          display: inline-block;
        }
        >.lineName{
          font-size: 14px;
          margin-left:20px;
        }
      }
    }
  }
</style>
