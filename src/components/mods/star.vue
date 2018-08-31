<template>
  <!-- 评分组件 -->
  <div class="star" :class="'star-'+size">
    <span v-for="(item,index) in computeStar" class="star-item" :class="item" :key="index"></span>
  </div>
</template>
<script>
export default {
  props: ['score', 'size'],
  computed: {
    computeStar () {
      let arr = []
      let integer = ~~this.score
      let decimal = (this.score - integer) >= 0.5
      for (let i = 0; i < integer; i++) {
        arr.push('on')
      }
      decimal && arr.push('half')
      while (arr.length < 5) arr.push('off')
      return arr
    }
  }
}
</script>
