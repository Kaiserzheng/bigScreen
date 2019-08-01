<template>
  <div>
    <div class="information-icon" title="动态监对象数量测统计" v-show="panel" @click="panelClick"><Icon class="el-icon-document" /></div>
    <transition name="fade">
      <div class="toollegend-list" id="informationBox" ref="content" v-if="panelHideBox">
        <div class="title" @mousedown.stop="mousedown($event)">
          <div class="icon-content" title="动态监测对象数量统计" @click="panelHideBox11"><Icon class="el-icon-document" /></div>
          <p>{{title}}</p>
        </div>
        <div class="informationBox-content">
          <el-table
            :data="tableData"
            height="371"
            :span-method="objectSpanMethod" class="infromTable"
            style="width: 100%">
            <el-table-column>
              <el-table-column
                fixed
                prop="adress"
                label="研究区"
                width="120">
              </el-table-column>
              <el-table-column
                prop="name"
                label="解译对象"
                width="120">
              </el-table-column>
              <el-table-column label="距河道距离">
                <el-table-column
                  prop="one"
                  label="100米"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="two"
                  label="200米"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="three"
                  label="300米"
                  width="120">
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table>

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
        title:'动态监测对象数量统计',
        panel: false,
        panelHideBox:true,
        tableData:null

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
        let informationBox= document.getElementById('informationBox');
        let distanceX = event.clientX - informationBox.offsetLeft
        let distanceY = event.clientY - informationBox.offsetTop
        document.onmousemove = (e) => {
          var m = e.clientX - distanceX
          var n = e.clientY - distanceY
          if(m<0){
            m=0
          }else if(m>document.body.clientWidth-informationBox.offsetWidth){
            m=document.body.clientWidth-informationBox.offsetWidth
          }
          if(n<0){
            n=0
          }else if(n>document.body.clientHeight-informationBox.offsetHeight-75){
            n=document.body.clientHeight-informationBox.offsetHeight-75
          }
          informationBox.style.left =  m+ 'px' ;
          informationBox.style.top =  n+ 'px';
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex %3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      infomaShow(){
        this.inforBox=!this.inforBox
      }
    },
    mounted() {
      this.axios.get('./static/informin.json').then((res) => {
        this.tableData=res.data.tableData

      })
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
  .information-icon{
    width: 30px;
    height: 30px;
    background:$background;
    position: absolute;
    right: 5px;
    color: #fff;
    font-size: 22px;
    padding: 0px 4px;
    top: 90px;
    z-index: 55;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .toollegend-list{
    border-radius:4px;
    box-sizing: content-box;
    width: 480px;
    position: absolute;
    right: 60px;
    top: 45px;
    z-index: 56;
    border: 1px solid $background;
    background-color:$workspacebag;
    overflow: hidden;
    transition: width 0.3s ease, height 0.3s ease;
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
        font-size: 14px;
        padding-left: 5px;
        pointer-events: none;
        user-select: none;
      }
    }
  }

</style>
