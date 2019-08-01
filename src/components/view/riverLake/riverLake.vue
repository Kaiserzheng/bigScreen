<template>
  <div>
    <toolNav @riverLakeHandle="riverLakeHandle" @infoTitleChange="infoTitleChange"></toolNav>
    <infoContent v-if="infoShow" :riverLakeInfo="riverLakeInfo" :infoTitle="infoTitle"></infoContent>
    <riveMap ref="riverMap" :style="{height: mapHeight}" @toggleEcharts="toggleEcharts" :mapPosition="mapPosition"></riveMap>
    <div class="echarts-container">
      <listEcha 
        ref="listEcharts"
        :echartsH="echartsH" 
        @echartsMapPosiotn="echartsMapPosiotn"
        @infoTitleChange="infoTitleChange"
        @riverLakeInfoHandle="riverLakeInfoHandle">
      </listEcha>
      </div>
  </div>

</template>
<script>
import riveMap from "@/components/view/riverMonitor/tools/map";
import listEcha from "@/components/view/riverMonitor/tools/listEcharts";
import toolNav from "@/components/view/riverMonitor/tools/toolNav";
import infoContent from "@/components/view/riverMonitor/tools/infoContent";
export default {
  name: 'riverMonitor',
  components: {
    riveMap,
    listEcha,
    toolNav,
    infoContent
  },
  data () {
    return {
      echartsH: '40%',
      mapHeight: '60%',
      mapName:'黄河',
      infoShow: false,
      mapPosition: [],
      riverLakeInfo: '',
      infoTitle: ''
    }
  },
  methods: {
    // echarts 收缩
    toggleEcharts(flag) {
      if(flag) {
        this.mapHeight = '100%'
      } else {
        this.mapHeight = '60%'
      }
    },

    // 河湖监测列表点击传参
    riverLakeHandle(item) {
      this.infoShow = true;
      this.riverLakeInfo = item.desc;

      // 调用echarts组件里面的nav改变方法
      this.$refs['listEcharts'].setNavDatas(item);

      let bounds = item.extent;
      if (bounds != null){
        bounds = bounds.split(',').map(Number);

        let coords = [];
        let coord = [bounds[0],bounds[1]];
        coords.push(coord);
        coord = [bounds[2],bounds[3]];
        coords.push(coord);
        let extent = new ol.extent.boundingExtent(coords);
        this.$refs.riverMap.map.getView().fit(extent,{duration:1000});
      }
      this.mapName=item.name;
    },

    // 河湖信息传参
    riverLakeInfoHandle(item) {
      // this.riverLakeInfo = item;
      this.riverLakeInfo = '<p>把没有光亮的梦都留给你，把我的日夜思念都留给你，我把对你的思绪 整理了千丝万缕</p><p>叫醒我的却像 晴天霹雳</p><p>我依然在自己的幻想里沉溺，你也不必再问我有多喜欢你， 遥远的梦 遥远的你</p><p>我在开了灯的床头下，想问问自己的心啊，是不是当初也不想</p><p>我在拆散自己的谎话，当初不应该说不爱她，如果我们真的有明天，也不过是相爱相杀</p>'
    },

    // 信息展示面板标题改变
    infoTitleChange(title) {
      this.infoTitle = title
    },

    // 点击echarts 地图联动
    echartsMapPosiotn(obj) {
      this.mapPosition = obj.bound
      this.riverLakeInfo = (obj.desc && obj.desc != null) ? obj.desc : '暂无断面描述'
    }
  },
  mounted () {

  },
  updated () {

  }
}
</script>

<style lang="scss" scoped>
  .echarts-container {
    padding: 0 5px;
  }
</style>
