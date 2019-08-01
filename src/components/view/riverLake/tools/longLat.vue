<template>

  <div class="locationTitle" id="location"></div>

</template>

<script>

export default {
  name: 'layerChange',
  data() {
    return {

    }
  },

  components: {

  },
  mounted() {

  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>
 .locationTitle{
    position: absolute;
    bottom: 0;
    left: 5px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    background: rgba(204, 204, 204, 0.3);
    font-size: 12px;
    color: #000000;
    z-index: 12;
    border-radius: 5px;
 }
</style>
