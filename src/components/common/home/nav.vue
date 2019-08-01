<template>
  <ul class="navBar">
    <li :class="{active: activeIndex==index}" @click="navClick(item.path, index)" v-for="(item, index) of navList" :key="index">
      <p class="title">{{item.name}}</p>
      <span class="icon iconfont" :class="item.iconClass"></span>
    </li>
  </ul>
</template>

<script>

export default {
  name: "homeNav",
  data() {
    return {
      navList: this.$config.homeNavList,
      activeIndex: 0
    };
  },
  props: {

  },
  components: {},
  computed: {

  },
  mounted() {
    this.$nextTick(()=>{
      this.init();
    })
  },
  methods: {
    init() {

    },
    navClick(path, index) {
      console.log(path)
      if(index==0||index==1){
        window.open(path,'_self')
      }else{
        this.$router.push(path)
      }
      this.activeIndex = index
    }
  },
  watch: {

  },
};
</script>
<style lang="scss" scoped>
  ul.navBar{
    min-height: 200px;
    width: 288px;
    position: absolute;
    top: 108px;
    left: 20px;
    z-index: 20;
    li{
      width: 288px;
      height: 76px;
      border-radius: 0 38px 38px 0;
      background: rgb(28, 45, 98);
      color: #ffffff;
      position: absolute;
      cursor: pointer;
      p.title{
        font-size: 25px;
        padding: 0 32px;
        height: 76px;
        line-height: 76px;
        float: left;
      }
      span{
        float: right;
        font-size: 32px;
        height: 76px;
        line-height: 76px;
        padding: 0 20px;
      }
      &:nth-child(1){
        top: 7px;
      }
      &:nth-child(2){
        top: 151px;
      }
      &:nth-child(3){
        top: 295px;
      }
      &:nth-child(4){
        top: 439px;
      }
      &:nth-child(5){
        top: 583px;
      }
    }
    li.active{
      color: #3ce2f5;
      background: rgb(19, 77, 151);
    }
  }
</style>
