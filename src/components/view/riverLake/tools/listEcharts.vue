<template>
  <div class="content">
    <div class="echarts-content" :style="{'height': echartsHeight + 'px'}">
      <div class="tab-nav">
        <div class="btn prev-btn" :class="{'active': btnShow}" @click="tabNavPrev(true)">
          <i class="ivu-icon ivu-icon-ios-arrow-back"></i>
        </div>
        <div class="btn next-btn" :class="{'active': btnShow}" @click="tabNavNext(true)">
          <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
        </div>
        <div class="tab-nav-scroll" ref="tabScroll">
          <div
            class="tab-main"
            ref="tabMain"
            :style="{'transform': 'translateX(' + scrollNum + 'px)'}"
          >
            <div
              class="item"
              v-for="(item, index) in navDatas"
              :key="item.rlcode"
              :class="{'active': item.rlcode == navTypeDefault}"
              @click.stop="changeTab(item)"
            >
              {{item.rlname}}
              <Icon type="md-close" v-if="index != 0" @click.stop="removeTab(item)" />
            </div>
          </div>
        </div>
      </div>
      <div class="tab-content" v-loading="echartsLoading">
        <div class="type-main-scroll" ref="typeScroll">
          <div class="btn prev-btn" :class="{'active': typeShow}" @click="tabNavPrev(false)">
            <i class="ivu-icon ivu-icon-ios-arrow-back"></i>
          </div>
          <div class="btn next-btn" :class="{'active': typeShow}" @click="tabNavNext(false)">
            <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
          </div>
          <div class="type-main" ref="typeMain" :style="{'transform': 'translateX(' + typeScrollNum + 'px)'}">
            <div
              class="item"
              v-for="(item, index) in dataTypeNav"
              :class="{'active': item.tcode == dataTypeDefault}"
              :key="index"
              @click="typeChange(item, index)"
            >{{item.tname}}</div>
          </div>
        </div>
        <div v-if="echartsShow">
          <div v-show="lineBarShow" id="linebarEcharts" :style="{'height': (echartsHeight - 72) + 'px'}"></div>
          <div v-show="doubleShow" id="doubleLineEcharts" :style="{'height': (echartsHeight - 72) + 'px'}"></div>
          <div v-show="manyLineShow" id="manyLineEcharts" :style="{'height': (echartsHeight - 72) + 'px'}"></div>
          <div v-show="manyLineBarShow" id="manyLineBarEcharts" :style="{'height': (echartsHeight - 72) + 'px'}"></div>
        </div>
        <div v-else class="no-data" :style="{'height': (echartsHeight - 72) + 'px'}">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { setTimeout } from "timers";
export default {
  name: "listEcharts",
  props: ["echartsH"],
  data() {
    return {
      navDatas: [
        {
          rlname: "内蒙古全区概况",
          rlcode: "RL00001"
        }
      ],
      navTypeDefault: "RL00001",
      dataType: [],
      dataTypeNav: [],
      dataTypeDefault: "",
      btnShow: false,
      scrollOffset: 0,
      scrollNum: 0,
      echartsHeight: 150,
      echartsLoading: false,
      echartsUnit: "",
      echartsXlineUnit: "",
      echartsName: "",
      echartsType: '',
      lineBarShow: true,
      doubleShow: false,
      manyLineShow: false,
      manyLineBarShow: false,
      echartsShow: true,
      typeShow: false,
      typeScrollNum: 0,
      typeScrollOffset: 0,
      indexTips: 0,
      mapPostionArr: [],
      isLake: false,
      yellowRiver: false,
      colorList: [
        '#56a1d5', '#62c3e5', '#87dde1', '#aee4bb', '#fadb71',
        '#f2a385', '#ea7a94', '#e0beef', '#807ae3', '#9abaf3'
      ]
    };
  },
  methods: {
    // NavTab内容
    setNavDatas(value) {
      if (!this.isInNav(value, this.navDatas)) {
        this.navDatas.push(value);
      }
      this.changeTab(value);
    },

    // 判断某河湖是否在NavTab中
    isInNav(obj, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].rlname == obj.rlname) {
          return true;
        }
      }
      return false;
    },

    // NavTab切换
    changeTab(item) {
      this.yellowRiver = item.rlcode && item.rlcode == 'RL00005' ? true : false
      this.isLake = item.rltype && item.rltype == 'lake' ? true : false
      let navId = item.rlcode;
      if (this.navTypeDefault == navId) {
        return;
      }

      if (navId != "RL00001") {
        this.dataTypeNav = this.dataType[item.rltype]
        this.$emit('infoTitleChange', item.rlname + '变化描述')
        this.$emit('riverLakeInfoHandle', item.desc)
      } else {
        this.dataTypeNav = this.dataType.whole
      }

      if (this.navTypeDefault == "RL00001" || (this.navTypeDefault != "RL00001" && navId == "RL00001")) {
        this.indexTips = 0
      }

      let echartsIndex = this.dataTypeNav.length < this.indexTips ? 0 : this.indexTips

      this.navTypeDefault = navId;
      this.dataTypeDefault = this.dataTypeNav[echartsIndex].tcode;
      this.echartsUnit = this.dataTypeNav[echartsIndex].unit;
      this.echartsXlineUnit = this.dataTypeNav[echartsIndex].xunit;
      this.echartsName = this.dataTypeNav[echartsIndex].tname;
      this.echartsType = this.dataTypeNav[echartsIndex].etype;

      // 判断数据类别前进、后退是否显示
      this.$nextTick(function() {
        this.typeScrollNum = 0
        this.setBtnVisble("typeScroll", "typeMain", 10, false);
      });

      // 请求数据
      this.getEchartsData();
    },

    // NavTab删除
    removeTab(item) {
      let index = this.navDatas.indexOf(item);
      if (this.navTypeDefault == item.rlcode) {
        this.changeTab(this.navDatas[index - 1]);
      }
      this.navDatas.splice(index, 1);
    },

    // NavTab前滑
    tabNavPrev(isNav) {
      let scrollCurNum = isNav ? Math.abs(this.scrollNum) : Math.abs(this.typeScrollNum)
      if (scrollCurNum < 100) {
        isNav ? this.scrollNum = 0 : this.typeScrollNum = 0;
      } else {
        let tipsNum = isNav ? this.scrollNum + 100 : this.typeScrollNum + 100;
        if (Math.abs(tipsNum) < 0) {
          isNav ? this.scrollNum = 0 : this.typeScrollNum = 0;
        } else {
          isNav ? this.scrollNum = tipsNum : this.typeScrollNum = tipsNum;
        }
      }
    },

    // NavTab后滑
    tabNavNext(isNav) {
      let scrollOffset = isNav ? this.scrollOffset : this.typeScrollOffset;
      if (scrollOffset < 100 && this.scrollNum == 0) {
        isNav ? this.scrollNum = -scrollOffset : this.typeScrollNum = -scrollOffset
      } else {
        let tipsNum = isNav ? this.scrollNum - 100 : this.typeScrollNum - 100;
        if (Math.abs(tipsNum) > scrollOffset) {
          isNav ? this.scrollNum = -scrollOffset : this.typeScrollNum = -scrollOffset;
        } else {
          isNav ? this.scrollNum = tipsNum : this.typeScrollNum = tipsNum;
        }
      }
    },

    // 设置前进、后退按钮显示
    setBtnVisble(fDom, cDom, offset, isNav) {
      let tabWidth = 0;
      let tabDom = this.$refs[cDom];
      let tabItemDom = tabDom.getElementsByTagName("div");

      for (let i = 0; i < tabItemDom.length; i++) {
        tabWidth += tabItemDom[i].offsetWidth + offset;
      }
      let scrollWidth = this.$refs[fDom].offsetWidth;

      if (tabWidth > scrollWidth) {
        isNav ? this.btnShow = true : this.typeShow = true;
      } else {
        isNav ? this.btnShow = false : this.typeShow = false;
      }
      isNav ? this.scrollOffset = tabWidth - scrollWidth : this.typeScrollOffset = tabWidth - scrollWidth;
    },

    // 数据类型切换
    typeChange(item, index) {
      this.dataTypeDefault = item.tcode;
      this.echartsUnit = item.unit;
      this.echartsXlineUnit = item.xunit;
      this.echartsName = item.tname;
      this.echartsType = item.etype;
      this.indexTips = index;

      // 请求数据
      this.getEchartsData();
    },

    // 设置echarts组件高度
    setEchartsHeight(isFirst) {
      let winWidth = window.innerWidth;
      let variableHeight = (winWidth < 1200) ? 18 : 0;
      let winHeight = document.documentElement.clientHeight - 75;
      let height = winHeight * ((this.echartsH.slice(0, this.echartsH.indexOf("%")) - 0) / 100) - variableHeight;
      this.echartsHeight = height;

      // 请求数据类型
      if(isFirst) {
        this.$nextTick(function() {
          this.getDataType()
        })
      }
    },

    // 请求echarts数据
    getEchartsData() {
      if (this.navTypeDefault == 'RL00001') {
        this.$emit('infoTitleChange', '全区统计范围')
        this.$emit('riverLakeInfoHandle', '<p style="font-size: 14px;">湖泊：5个</p><p style="font-size: 14px;">河流：6个</p>')
      } else {
        if (this.dataTypeDefault != 'RWS01') {
          this.navDatas.map(item => {
            if(item.rlcode == this.navTypeDefault) {
              this.$emit('infoTitleChange', item.rlname + '变化描述')
              this.$emit('riverLakeInfoHandle', item.desc)
            }
          })
        }
      }

      this.mapPostionArr = []
      this.echartsLoading = true;

      let serverHref = ''
      if (this.echartsType == 'manyLine') {
        if(this.dataTypeDefault == 'RWS01') {         // 摆幅
          serverHref = this.$config.serverUrl +'rmonitor/sm/'.concat(this.navTypeDefault)
        } else if(this.dataTypeDefault == 'RWS02') {  // 弯曲系数
          serverHref = this.$config.serverUrl +'rmonitor/bc/'.concat(this.navTypeDefault)
        } else if(this.dataTypeDefault == 'RWS03') {  // 岸线长度
          serverHref = this.$config.serverUrl +'rmonitor/rsvl/'.concat(this.navTypeDefault)
        }
      } else {
        if(this.dataTypeDefault == 'RWS04') {   // 水域面积
          serverHref = this.$config.serverUrl +'rmonitor/wav/'.concat(this.navTypeDefault)
        } else {
          if(this.isLake) {   // 湖泊
            serverHref = this.$config.serverUrl +'lmonitor/'.concat(this.navTypeDefault + '/' + this.dataTypeDefault)
          } else {
            serverHref = this.$config.serverUrl +'rlsws/'.concat(this.navTypeDefault + '/' + this.dataTypeDefault)
          }
        }
      }

      this.axios.get(serverHref).then( (res) => {
        let resultData = res.data.data
        // 判断数据需要展示哪种echarts
        if (resultData && resultData != null) {
          this.echartsShow = true
          if (this.echartsType == 'bar' || this.echartsType == 'line') {  //折线图或柱状图
            if(this.yellowRiver && this.dataTypeDefault != 'RWS04') {
              this.manyLineBarShow = true
              this.lineBarShow = false
              this.doubleShow = false
              this.manyLineShow = false
              this.$nextTick(function() {
                this.drawManyLineBar(resultData)
              })
            } else {
              this.lineBarShow = true
              this.doubleShow = false
              this.manyLineShow = false
              this.manyLineBarShow = false
              this.$nextTick(function() {
                this.drawBarLineEcharts(resultData)
              })
            }
            this.echartsLoading = false
          } else if(this.echartsType == 'double') {   // 双Y轴
            this.doubleShow = true
            this.lineBarShow = false
            this.manyLineShow = false
            this.manyLineBarShow = false
            this.echartsLoading = false
          } else {    // 多线图
            this.manyLineShow = true
            this.lineBarShow = false
            this.doubleShow = false
            this.manyLineBarShow = false
            this.echartsLoading = false
            this.$nextTick(function(){
              if (this.dataTypeDefault == 'RWS01') {
                this.mapPostionArr = resultData.secInfoMap
              } else {
                this.mapPostionArr = null
              }

              this.drawManyLine(resultData)
            })
          }
        } else {
          this.echartsShow = false
          this.echartsLoading = false
        }
      }).catch( (err) => {
        console.log(err)
      })
    },

    // 多折线、柱状图
    drawManyLineBar(data) {
      let manyLineBarEcharts = echarts.init(document.getElementById("manyLineBarEcharts"))
      let that = this
      let getDatas = data.segList
      let legendData = []
      let seriesData = []
      let xAxisData = []

      for(let i = 0; i < getDatas.length; i++) {
        legendData.push(getDatas[i].segname)
        seriesData.push({
          name: getDatas[i].segname,
          type: that.echartsType,
          data: getDatas[i].segdata,
          markLine : {
            data : [
              {type : 'average', name: '平均值'}
            ]
          }
        })
      }
      xAxisData = data.yearList
      manyLineBarEcharts.setOption({
        tooltip: {
            trigger: 'axis'
        },
        textStyle:{
          fontSize: 22,
          color: '#ffffff'
        },
        legend: {
          data: legendData,
          top: 10,
          textStyle: {
            color: '#ffffff',
            fontSize: 18
          }
        },
        grid: [
          { x: "4%", y: "18%", width: "90%", height: "68%" },
          { x2: "4%", y: "18%", width: "90%", height: "68%" }
        ],
        toolbox: {
            show : true,
            feature : {
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis: {
            name: that.echartsXlineUnit,
            type: 'category',
            data: xAxisData,
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
        },
        color:that.colorList,
        yAxis: {
            name: "单位：" + that.echartsUnit,
            type: 'value',
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
        },
        series: seriesData
      }, true)
    },

    // 画多线图
    drawManyLine(data) {
      let that = this
      let manyLineEcharts = echarts.init(document.getElementById("manyLineEcharts"))
      let legendData = []
      let seriesData = []
      let xAxisData = []

      if(that.dataTypeDefault == 'RWS01') {        // 摆幅
        for(let item in data.rmsmMap) {
          legendData.push(item)
          seriesData.push({
            name: item,
            type: 'line',
            smooth: true,
            data: data.rmsmMap[item],
          })
        }
        xAxisData = data.secIdList
      } else if(that.dataTypeDefault == 'RWS02') {  // 弯曲系数
        for(let item in data.rmbcMap) {
          legendData.push(item)
          seriesData.push({
            name: item,
            type: 'line',
            smooth: true,
            data: data.rmbcMap[item],
          })
        }
        xAxisData = data.cscode
      } else if(that.dataTypeDefault == 'RWS03') {  // 岸线长度
          if(data.length == 1) {
            legendData.push(data[0].slType)
            seriesData.push({
              name: data[0].slType,
              type: 'line',
              smooth: true,
              data: data[0].sllList,
            })
            xAxisData = data[0].yearList
          } else {
            data.map(item => {
              legendData.push(item.slType)
              seriesData.push({
                name: item.slType,
                type: 'line',
                smooth: true,
                data: item.sllList,
              })
            })
            xAxisData = data[0].yearList
          }
      }

      manyLineEcharts.setOption({
        tooltip: {
            trigger: 'axis'
        },
        textStyle:{
          fontSize: 22,
          color: '#ffffff'
        },
        legend: {
          data:legendData,
          top: 10,
          textStyle: {
            color: '#ffffff',
            fontSize: 18
          }
        },
        grid: [
          { x: "4%", y: "18%", width: "90%", height: "68%" },
          { x2: "4%", y: "18%", width: "90%", height: "68%" }
        ],
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            name: that.echartsXlineUnit,
            type: 'category',
            data: xAxisData,
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
        },
        yAxis: {
            name: "单位：" + that.echartsUnit,
            type: 'value',
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
        },
        color:that.colorList,
        series: seriesData
      }, true)

      manyLineEcharts.on('click', function(param) {
        if (that.mapPostionArr && that.mapPostionArr != null) {
          let riverName = ''
          that.navDatas.map(item => {
            if(item.rlcode == that.navTypeDefault) {
              riverName = item.rlname
            }
          })
          let dataIndex = param.dataIndex - 0 + 1
          that.$emit('echartsMapPosiotn', that.mapPostionArr[dataIndex])
          that.$emit('infoTitleChange', riverName + '断面' + dataIndex + '描述')
        }
      })
    },

    // 画折线图或柱状图
    drawBarLineEcharts(datas) {
      let that = this
      let echartsContent = echarts.init(document.getElementById("linebarEcharts"));
      let seriesData = []
      let xAxisData = []
      if(that.dataTypeDefault == 'RWS04') {   // 水域面积
        seriesData = datas.wavList
        xAxisData = datas.yearList
      } else {
        if(that.isLake) {
          seriesData = datas.dataList
          xAxisData = datas.yearList
        } else {
          seriesData = datas.mdataList
          xAxisData = datas.yearList
        }
      }
      // 如果为折线图时设置最小、大显示值
      let lookArr = []
      seriesData.map(item => {
        item != null && lookArr.push(item)
      })

      let minNumMark = (that.echartsType == 'line') ? Math.floor(Math.min.apply( Math, lookArr)) : 0
      let maxNumMark = Math.ceil(Math.max.apply( Math, lookArr))

      let minNumCeil = minNumMark - Math.ceil(minNumMark / 3)
      let maxNumCeil = maxNumMark + Math.ceil(maxNumMark / 3)

      let minNum = (Math.floor(minNumCeil / 5)) * 5
      let maxNum = (Math.floor(maxNumCeil / 5)) * 5

      echartsContent.setOption({
        grid: [
          { x: "4%", y: "18%", width: "90%", height: "68%" },
          { x2: "4%", y: "18%", width: "90%", height: "68%" }
        ],
        textStyle:{
          fontSize: 22,
          color: '#ffffff'
        },
        tooltip: {
          trigger: "axis",
          formatter: '{b}年</br>{a} : &nbsp;{c} '+ that.echartsUnit +''
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            name: that.echartsXlineUnit,
            axisLine: {
              onZero: false
            },
            data: xAxisData,
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：" + that.echartsUnit,
            min: minNum,
            max: maxNum,
            interval: (maxNum - minNum) / 5,
            splitLine: {
              lineStyle: {
                color: "#e5e5e5"
              }
            },
            axisLabel: {
              fontSize: 20,
              color: '#ffffff'
            }
          }
        ],
        color:that.colorList,
        series: [
          {
            name: that.echartsName,
            type: that.echartsType,
            data: seriesData,
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            },
          }
        ]
      }, true);
    },

    // 请求统计数据类型
    getDataType() {
      // ajax
      this.axios.get(this.$config.serverUrl +'rldtype/WSS/river,lake,whole').then( (res) => {
        let data = res.data.data
        let dataObj = {
          whole: [],
          river: [],
          lake: []
        }
        data.map(item => {
          dataObj[item.rltype].push(item)
        })
        this.dataType = dataObj
        // ajax成功后设置默认类、并请求echarts数据
        this.dataTypeNav = this.dataType.whole
        this.dataTypeDefault = this.dataTypeNav[0].tcode
        this.echartsUnit = this.dataTypeNav[0].unit
        this.echartsXlineUnit = this.dataTypeNav[0].xunit
        this.echartsName = this.dataTypeNav[0].tname
        this.echartsType = this.dataTypeNav[0].etype

        // 判断数据类别前进、后退是否显示
        this.$nextTick(function() {
          this.setBtnVisble("typeScroll", "typeMain", 10, false);
        });

        this.getEchartsData()
      }).catch( (err) => {
        console.log(err)
      })
    },
  },
  mounted() {
    this.$nextTick(function() {
      // 设置echarts高度
      this.setEchartsHeight(true);

      let that = this;
      // 浏览器窗口拖动
      window.onresize = function() {
        if (that.setBtnVisble && that.setBtnVisble != undefined) {
          that.scrollNum = 0;
          that.setBtnVisble("tabScroll", "tabMain", 4, true);
          that.typeScrollOffset = 0;
          that.setBtnVisble("typeScroll", "typeMain", 10, false);
          that.setEchartsHeight(false);
        }
      }
    })
  },
  watch: {
    navDatas(newVal, oldVal) {
      this.$nextTick(function() {
        this.setBtnVisble("tabScroll", "tabMain", 4, true);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.echarts-content {
  width: 100%;
  transition: all 0.3s ease-in-out;
  background-color: $ehartBg;
  .tab-nav {
    width: 100%;
    overflow: hidden;
    position: relative;
    > .btn {
      width: 18px;
      height: 35px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      z-index: 3;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      user-select: none;
      &.active {
        opacity: 1;
        pointer-events: auto;
      }
      &.prev-btn {
        left: 1px;
      }
      &.next-btn {
        right: 1px;
      }
    }
    .tab-nav-scroll {
      width: 100%;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background-color: #dcdee2;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 1;
      }
      > .tab-main {
        float: left;
        display: flex;
        align-items: center;
        transition: transform 0.5s ease-in-out;
        position: relative;
        z-index: 2;
        > .item {
          border-radius: 4px 4px 0 0;
          padding: 8px 16px 4px;
          cursor: pointer;
          position: relative;
          margin-right: 4px;
          border: 1px solid #dcdee2;
          background-color: #f8f8f9;
          z-index: 2;
          user-select: none;
          >>> .ivu-icon {
            width: 0;
            height: 16px;
            font-size: 15px;
            margin-right: 0;
            color: #999;
            text-align: right;
            vertical-align: middle;
            overflow: hidden;
            position: relative;
            top: -1px;
            -webkit-transform-origin: 100% 50%;
            transform-origin: 100% 50%;
            transition: all 0.3s ease-in-out;
            &:hover {
              color: #ed4014;
            }
          }
          &:hover {
            color: #2d8cf0;
          }
          &:hover >>> .ivu-icon,
          &.active >>> .ivu-icon {
            width: 22px;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            margin-right: -6px;
          }
          &.active {
            background-color: #fff;
            color: #2d8cf0;
            border-bottom: 1px solid #fff;
          }
        }

      }
      .sortBox{
        float: right;
        font-size: 19px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .tab-content {
    width: 100%;
    height: auto;
    position: relative;
    border: 1px solid #dcdee2;
    border-top: none;
    padding: 0 15px;
    padding-top: 10px;
    overflow: hidden;
    // background-color: #fff;
    .type-main-scroll {
      width: 100%;
      overflow: hidden;
      > .btn {
        width: 18px;
        height: 30px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 10px;
        z-index: 3;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        user-select: none;
        &.active {
          opacity: 1;
          pointer-events: auto;
        }
        &.prev-btn {
          left: 1px;
        }
        &.next-btn {
          right: 1px;
        }
      }
      .type-main {
        white-space: nowrap;
        display: flex;
        align-items: center;
        transition: transform 0.5s ease-in-out;
        color: #fff;
        > .item {
          float: left;
          padding: 5px 15px;
          margin-right: 10px;
          border: 1px solid #dcdee2;
          cursor: pointer;
          user-select: none;
          &.active {
            color: #fff;
            background-color: #3e8fd0;
            border-color: #3e8fd0;
          }
        }
      }
    }
    .no-data {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
