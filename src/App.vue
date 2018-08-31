<template>
  <div id="app">
    <myHeader></myHeader>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import myHeader from './components/mods/header.vue'
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      seller: {}
    }
  },
  created () {
    axios.get('../static/data.json').then(res => {
      this.seller = res.data.seller
    })
  },
  components: {
    myHeader
  }
}
</script>
<style>
  .router-link-exact-active{
    color:red !important;
  }
</style>
