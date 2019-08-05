<template>
  <div id="toolTwo" ref="toolBar">
      <dl v-if="layerTSC" @click="timeSliderToggle()">
        <dt class="timeSlider">
          <span class="iconfont icon-shijianzhou"></span>
        </dt>
        <dd>时间轴</dd>
      </dl>
    <div class="block" :style="timeSliderBottom" ref="timeSlider">
      <el-slider v-model="defaultValue"
        :step="1"
        :marks="timeSliderOption.marks"
        :min="0"
        :max="timeSliderOption.max"
        show-stops
        :show-tooltip="false"
      ></el-slider>
    </div>
  </div>
</template>

<script>
  import ol from "openlayers";
  import "@supermap/iclient-openlayers";
  import {setTimeout} from 'timers';

  export default {
    name: "toolTwo",
    data() {
      return {
        defaultValue: 0,

      };
    },
    props: {
      map: {
        required: true
      },
      layerTSC: {
        type: Array,
      },
      timeSliderPosition: {
        default: function () {
          return '40px'
        }
      },
    },
    components: {

    },
    computed: {
      timeSliderOption: function () {
        if (!this.layerTSC) {
          return false
        }
        let max = this.layerTSC.length - 1
        let marks = {}
        for (let i = 0; i < this.layerTSC.length; i++) {
          const element = this.layerTSC[i];
          marks[i] = element.label
        }
        return {
          marks: marks,
          max: max,
        }
      },
      timeSliderBottom: function () {
        return {
          bottom: this.timeSliderPosition
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.init();
        this.timeSliderToggle()
      }, 400);
    },
    methods: {
      init() {

      },
      timeSliderToggle() {
        if (this.$refs.timeSlider.style.display == "block") {
          this.$refs.timeSlider.style.display = "none";
          this.$emit('timeSliderToggle',false,this.timeSliderOption.marks[this.defaultValue]);
        } else {
          this.$refs.timeSlider.style.display = "block";
          this.$emit('timeSliderToggle',true,this.timeSliderOption.marks[this.defaultValue]);
        }
      },
      layerControl(option) {
        let layers = this.map.getLayers()
        layers.forEach(function (element, index, array) {
          for (const item of option) {
            if (item.id == element.get("id")) {
              element.setVisible(item.toggle)
            }
          }
        })
      }
    },
    watch: {
      defaultValue: function (newValue) {
        this.$emit('timeSliderToggle',true,this.timeSliderOption.marks[newValue]);
      }
    },
  };
</script>
<style lang="scss" scoped>
  #toolTwo {
    min-height: 20px;
    position: absolute;
    right: -2000px;
    top: 10px;
    z-index: 66;
    border-radius: 4px;
    border: 1px solid #cccccc;
    box-shadow: 2px 2px 5px #333333;
    transition: width 0.4s linear;
    .block {
      position: fixed;
      left: 50%;
      z-index: 30;
      padding: 0 50px 24px 50px;
      overflow: hidden;
      width: 400px;
      border-radius: 5px;
      background: #f1f1f1;
      margin-left: -200px;
      display: none;
      /deep/ .el-slider__marks-text{
        font-size: 18px;
        white-space:nowrap;
      }
    }

  }
</style>
