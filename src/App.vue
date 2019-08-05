<template>
  <div id="app">
    <homeNav/>
    <router-view class="routerView" />
  </div>
</template>

<script>
import homeNav from '@/components/common/home/nav'
export default {
  name: 'App',
  components: {
    homeNav
  }
}
</script>

<style>
body,html {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  color: #000000;
  font-size: 16px;
}
ul,li,ol,dl,dd,dt,p,h1,h2,h3,h4,h5,h6,form,fieldset,legend,img,input{
  margin:0;
  padding:0;
}
ol,li,ul{
  list-style:none;
}
a{
  text-decoration:none;
}
em,i{
  font-style:normal;
}
img{
  display:block;border:0;
}
.ol-overlaycontainer-stopevent,.cesium-viewer-fullscreenContainer,.cesium-viewer-bottom{
  display: none!important;
}
.routerView{
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.el-scrollbar__wrap{
  overflow-x:hidden;
}
</style>
<style lang="scss" scoped>
  #app {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    border-style: solid;
    border-color: $borderColor;
    border-width: 40px 10px 20px 20px;
  }
</style>
