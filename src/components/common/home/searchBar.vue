<template>
  <div ref="searchBar" class="searchBar" :style="{marginLeft:marginLeft}">
    <div class="titleL">区域选择 : </div>
    <div class="inputBox">
      <input type="text" @keyup="lengthChange" v-model="searchKey" placeholder="请输入关键字">
    </div>
    <div class="searchImg">
      <i class="el-icon-search"></i>
    </div>
  </div>
</template>

<script>

export default {
  name: "searchBar",
  data() {
    return {
      searchKey: '',
      marginLeft: '-227.5px'
    };
  },
  props: {

  },
  components: {

  },
  computed: {

  },
  mounted() {

  },
  methods: {
    init() {

    },
    lengthChange(event) {
      event.target.style.width = event.target.value.length*19.5 + 'px'
      this.marginLeft = -this.$refs.searchBar.offsetWidth/2 + 'px'
    }
  },
  watch: {

  },
};
</script>
<style lang="scss" scoped>
  .searchBar{
    height: 64px;
    padding: 0 20px;
    position: absolute;
    z-index: 10;
    top: 20px;
    left: 50%;
    background: rgb(19, 77, 151);
    border-radius: 32px;
    min-width: 300px;
    overflow: hidden;
    color: #ffffff;
    font-size: 22px;
    .titleL{
      height: 64;
      float: left;
      padding: 0 10px;
      line-height: 64px;
    }
    .inputBox{
      height: 40px;
      margin: 10px 0;
      padding-left: 15px;
      float: left;
      background: #162557;
      border-radius: 8px;
      input{
        min-width: 200px;
        outline: 0;
        border: 0;
        height: 40px;
        font-size: 18px;
        background: transparent;
        color: #ffffff;
      }
    }
    .searchImg{
      float: left;
      padding: 0 10px 0 30px;
      i{
        height: 64px;
        width: 30px;
        display: block;
        line-height: 64px;
      }
    }
  }
</style>
