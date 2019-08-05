<template>
  <div>
    <div class="toolLegend-icon" title="展开面板" v-show="panel" @click="panelClick"><Icon type="ios-list" /></div>
    <transition name="fade">
      <div class="toollegend-list" id="toollegend-list" ref="content" v-if="panelHideBox">
        <div class="title" @mousedown.stop="mousedown($event)">
          <div class="icon-content" title="收起面板" @click="panelHideBox11"><Icon type="ios-list" /></div>
          <p>{{title}}</p>
        </div>
        <div class="toollegend-content">
          <div class="left">
            <dl v-for="(value, name, index) of leftList" :key="index">
              <dt :class="value.type">
                <div class="feature" :style="{backgroundColor:'rgb('+value.color+')'}"></div>
              </dt>
              <dd>{{name}}</dd>
            </dl>
          </div>
          <div class="right">
            <dl>叶绿素浓度 (mg/L)</dl>
            <dl v-for="(value, name, index) of rightList" :key="index">
              <dt :style="{backgroundColor:'rgb('+value+')'}"></dt>
              <dd>{{name}}</dd>
            </dl>
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
        panel: false,
        panelHideBox:true,
        leftList: {
          '采沙堆': {
            type: 'line',
            color: '247, 150, 70'
          },
          '建筑物': {
            type: 'line',
            color: '0, 32, 96'
          },
          '垃圾堆': {
            type: 'line',
            color: '192, 0, 0'
          },
          '进出水口': {
            type: 'line',
            color: '105, 77, 87'
          },
          '排污口': {
            type: 'round',
            color: '255, 0, 0'
          }
        },
        rightList: {
          '0-10': '35, 70, 238',
          '10-20': '91, 158, 221',
          '20-30': '169, 241, 239',
          '30-40': '254, 239, 150',
          '40-50': '250, 211, 51',
          '50-60': '251, 154, 41',
          '60-70': '255, 85, 1'
        },
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
          var m = e.clientX - distanceX
          var n = e.clientY - distanceY
          if(m<0){
            m=0
          }else if(m>document.body.clientWidth-toollegendList.offsetWidth){
            m=document.body.clientWidth-toollegendList.offsetWidth
          }
          if(n<0){
            n=0
          }else if(n>document.body.clientHeight-toollegendList.offsetHeight-75){
            n=document.body.clientHeight-toollegendList.offsetHeight-75
          }
          toollegendList.style.left =  m + 'px' ;
          toollegendList.style.bottom = document.body.clientHeight - this.$refs.content.offsetHeight - n + 'px';
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
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .toolLegend-icon{
    width: 40px;
    height: 40px;
    background:$background;
    position: absolute;
    left: 5px;
    color: #fff;
    font-size: 24px;
    padding: 0px 4px;
    bottom: 20px;
    z-index: 55;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 34px;
      color: #fff;
    }
  }

  .toollegend-list{
    border-radius:4px;
    box-sizing: content-box;
    width: 400px;
    position: absolute;
    left: 5px;
    z-index: 30;
    bottom: 20px;
    border: 1px solid $background;
    background-color:$workspacebag;
    overflow: hidden;
    transition: width 0.3s ease, height 0.3s ease;
    .title {
      height: 40px;
      width: 400px;
      display: flex;
      align-items: center;
      background-color: $background;
      color: #fff;
      white-space: nowrap;
      cursor: move;
      .icon-content {
        width: 30px;
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
    .toollegend-content{
      padding: 0 8px;
      width: 400px;
      padding-bottom: 5px;
      overflow: hidden;
      .left,.right{
        min-height: 100px;
        float: left;
        width: 50%;
        >dl{
          height: 24px;
          line-height: 24px;
          margin-top: 5px;
          text-align: center;
          dt{
            width: 40%;
            height: 24px;
            line-height: 24px;
            float: left;
            &.line{
              >div{
                height: 4px;
                width: 70%;
                margin: 10px 15%;
              }
            }
            &.round{
              >div{
                height: 10px;
                width: 10px;
                border-radius: 5px;
                display: block;
                margin: 6px auto;
              }
            }
          }
          dd{
            width: 60%;
            height: 24px;
            line-height: 24px;
            float: left;
            text-align: center;
          }
        }
      }
      .left{
        >dl{
          margin-top: 21px;
        }
      }
    }
  }

</style>
