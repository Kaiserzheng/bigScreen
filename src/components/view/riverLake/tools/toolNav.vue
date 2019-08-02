<template>
  <div v-if="navHeight">
    <div :style="{'left': computedLeft}" class="tool-nav-icon" title="展开面板" :class="{'active': panelHide}" @click="panelHide = false" ref="tips"><i class="el-icon-s-order icon"></i></div>
    <div class="tool-nav-list" :style="{'height': navHeight + 'px','left': computedLeft}" :class="{'hidden': panelHide}" ref="content" id="toolNav">
      <div class="title" @mousedown.stop="mousedown($event)">
        <div class="icon-content" title="收起面板" @click.stop="panelHide = true"><i class="el-icon-s-order icon"></i></div>
        <p>河湖检测对象</p>
      </div>
      <div :style="{'height': (navHeight - 30) + 'px'}" v-loading="loading">
        <el-scrollbar class="scrollbar">
          <div class="item" v-for="item in navlistData"
            :key="item.rlcode"
            @click="navHandle(item)"
            >
              {{item.rlname}}
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { HappyScroll } from 'vue-happy-scroll'
export default {
  name: "toolNav",
  components: { HappyScroll },
  data() {
    return {
      panelHide: false,
      navHeight: 0,
      navlistData: [],
      loading: true,
      computedLeft: ''
    }
  },
  methods: {
    mousedown(event) {
      let toolNav= document.getElementById('toolNav');
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
        this.$refs.tips.style.left =  m + 'px';
        this.$refs.tips.style.top =  n + 'px';
        toolNav.style.left =  m+ 'px' ;
        toolNav.style.top =  n+ 'px';
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },

    // 设置河湖监测列表高度
    setNavHeight() {
      this.navHeight = 260
      this.getNavListData()
    },

    // 获取河湖监测列表数据
    getNavListData() {
      let parame = 'river,lake'
      this.axios.get( this.$config.serverUrl +'rlbinfo/'.concat(parame)).then( (res) => {
        this.navlistData = res.data.data
        this.loading = false
      }).catch( (err) => {
        console.log(err)
      })
    },

    // 列表点击
    navHandle(item) {
      this.$emit('riverLakeHandle', item)
      this.$emit('infoTitleChange', item.rlname + '变化描述')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setNavHeight()
      this.computedLeft = document.body.offsetWidth - 220 + 'px'
    })
  }
}
</script>
<style lang="scss" scoped>
  .tool-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: $background;
    position: absolute;
    top: 80px;
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
    box-sizing: border-box;
    width: 200px;
    border-radius: 4px;
    position: absolute;
    left: 20px;
    top: 80px;
    z-index: 30;
    border: 1px solid $background;
    background-color: #fff;
    overflow: hidden;
    transition: width 0.3s ease, height 0.3s ease;
    &.hidden {
      width: 0 !important;
      height: 0 !important;
      pointer-events: none;
      border-color: transparent;
    }
    .title {
      height: 30px;
      width: 100%;
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
        font-size: 18px;
        padding-left: 5px;
        pointer-events: none;
        user-select: none;
      }
    }
    .scrollbar {
      padding: 0 8px;
      height: 100%;
      width: 100%;
      .item {
        padding: 5px 0;
        width: 100%;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        &:hover {
          color: $background;
        }
      }
    }
    .scrollbar .item:last-child {
      border-bottom: none;
    }
  }
</style>
