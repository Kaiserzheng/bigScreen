<template>
  <div class="popupBox">
    <i @click="popupClose" id="popup-closer" class="el-icon-close"></i>
    <p class="title">
      {{popupData.title}}
    </p>
    <el-tabs class="tabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(value, index) in popupData.tabs" :key='index' :label="value.label" :name="String(index)">
        <template v-if="index==0">
          <div ref="imgBox" class="imgBox">
            <div v-for="(item, index) of value.data" :key="index">
              <p class="imgTitle" >{{item.imgDes}}</p>
              <img
                @click="imgMaxShow"
                :src="item.imgUrl" alt="垃圾场" width="" height="">
            </div>
          </div>
          <el-table
            size="mini"
            :data="value.data"
            border
            style="width: 100%">
            <el-table-column
              prop="year"
              label="时期"
              align="center">
            </el-table-column>
            <el-table-column
              prop="area"
              label="面积(km²)"
              align="center">
            </el-table-column>
            <el-table-column
              prop="change"
              label="变化"
              align="center">
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <div id="panoramaConianer">
            <div class="panoramaImgBox" v-for="(item, index) of value.data" :key="index+'i'">
              <img @click="panoramaShow(item)" :src="item" alt="垃圾场" width="" height="" />
            </div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { setTimeout } from 'timers';
  import { log } from 'util';
  let { tpanorama,tpanoramaSetting} = require('tpanorama');
  export default {
    name: 'popup',
    data() {
      return {
        activeName: '0',
        clientHeight: 0,
        clientWidth: 0,
        panoramaUrl: '',
        panoramaObj: null,
      }
    },
    props: [
      'popupData'
    ],
    components: {

    },
    mounted() {
      this.clientHeight = document.body.clientHeight
    },
    updated() {

    },
    watch: {
      panoramaUrl: function (newValue) {
        this.$nextTick(() => {
          this.tpanoramaInit(newValue)
        })
      }
    },
    methods: {
      popupClose() {
        // this.overlay.setPosition(undefined);
        this.$emit('popupClose')
      },
      handleClick() {

      },
      tpanoramaInit(url) {
        let opt = {
          container: 'panoramaBox',//容器
          url: url,
          // lables: [
          //   { position: { lon: -162.72, lat: 3.60}, logoUrl: '', text: '界碑' },
          //   { position: { lon: -44.28, lat: -3.60 }, logoUrl: '', text: '排污口' },
          //   { position: { lon: 100.08, lat: -5.04 }, logoUrl: '', text: '桥梁'}
          // ],
          widthSegments: 100,//水平切段数
          heightSegments: 80,//垂直切段数（值小粗糙速度快，值大精细速度慢）
          pRadius: 1000,//全景球的半径，推荐使用默认值
          minFocalLength: 6,//镜头最小拉近距离
          maxFocalLength: 100,//镜头最大拉近距离
        }
        if(!this.panoramaObj){
          this.panoramaObj = new tpanorama(opt);
        }else{
          this.panoramaObj.render(opt)
        }
      },
      panoramaShow(url) {
        this.$emit('panoramaShow')
        this.panoramaUrl = url
      },
      imgMaxShow() {
        let imgUrlArr = this.popupData.tabs[0].data.map((currentValue, index,arr) => {
          return currentValue.imgUrl
        })
        let dom = this.$refs.imgBox[0].cloneNode(true)
        dom.setAttribute('id','imgMax_popup')
        let closeButton = document.createElement('i')
        closeButton.className = 'el-icon-close'
        closeButton.onclick = function () {
          document.body.removeChild(this.parentNode)
        }
        dom.appendChild(closeButton)
        document.body.appendChild(dom)
      }
    },
  }
</script>
<style lang="scss" scoped>
  .popupBox{
    position: relative;
    #popup-closer{
      position: absolute;
      top: 12px;
      right: 5px;
      display: block;
      cursor: pointer;
      font-size: 16px;
    }
    p.title{
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #cccccc;
      font-size: 18px;
    }
    .imgBox{
      min-height: 20px;
      width: 100%;
      float: left;
      box-sizing: border-box;
      margin-bottom: 10px;
      &>div{
        position: relative;
        float: left;
        width: 25%;
        height: 100%;
        box-sizing: border-box;
        padding-right: 3px;
        .imgTitle{
          position: absolute;
          bottom: 0;
          height: 20px;
          line-height: 20px;
          background: rgba(255,255,255,0.8);
          text-align: center;
          width: 100%;
        }
        img{
          width: 100%;
          display: block;
        }
      }
    }
    /deep/ .tabs{
      .el-tabs__header{
        margin: 0 0 5px;
      }
      .el-tabs__item{
        font-size: 13px;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  // 全景
  #panoramaConianer{
    height: 247px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    .panoramaImgBox{
      width: 49%;
      height: 50%;
      margin-left: 1%;
      float: left;
      margin-bottom: 0;
      padding-bottom: 10px;
      box-sizing: border-box;
      img{
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
  }
</style>
<style>
  #imgMax_popup{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 40;
    background-color: white;
  }
  #imgMax_popup>div{
    height: 50%;
    width: 50%;
    float: left;
    position: relative;
    padding: 5px;
  }
  #imgMax_popup>div img{
    width: 100%;
    height: 100%;
  }
  #imgMax_popup>div p.imgTitle{
    height: 30px;
    line-height: 30px;
    text-align: center;
    text-align: center;
    background: rgba(255,255,255,0.8);
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  #imgMax_popup .el-icon-close{
    position: absolute;
    right: 10px;
    top: 10px;
    display: block;
    height: 24px;
    width: 24px;
    font-size: 24px;
    line-height: 20px;
    cursor: pointer;
    z-index: 10;
  }
</style>
