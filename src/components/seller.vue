<template>
  <div class="seller-wrapper" ref="sellerWrapper">
    <div class="seller-content">
      <div class="info">
        <div class="title">
          <div class="text">{{seller.name}}</div>
          <div class="star-wrapper">
            <star :score="seller.score" :size="36"></star>
            <span class="rate-count">({{seller.ratingCount}})</span>
            <span class="sell-count">月售{{seller.sellCount}}单</span>
          </div>
          <div class="collect">
            <span class="icon-favorite" :class="{'active':favorite}" @click="favorite = !favorite"></span>
            <span class="text" v-html="favorite?'已收藏':'收藏'"></span>
          </div>
        </div>
        <div class="remark">
          <div class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="num">{{seller.minPrice}}</span>元
            </div>
          </div>
          <div class="block">
            <h2>商家配送费</h2>
            <div class="content">
              <span class="num">{{seller.deliveryPrice}}</span>元
            </div>
          </div>
          <div class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="num">{{seller.deliveryTime}}</span>分钟
            </div>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="activities">
        <div class="bulletin">
          <h1>公告与活动</h1>
          <div class="content">{{seller.bulletin}}</div>
        </div>
      </div>
      <div class="supports">
        <ul>
          <li v-for="(item, index) in seller.supports" class="item" :key="index">
            <span class="iconMap" :class="icon[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <div class="divider"></div>
      <div class="seller-imgs">
        <h1>商家实景</h1>
        <div class="img-wrapper" ref="imgWrapper">
          <div ref="sellerImg" height="90px">
            <img v-for="(item, index) in seller.pics" :src="item" :key="index" width="120" height="90" alt="">
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="seller-info">
        <h1>商家信息</h1>
        <ul class="info-list">
          <li v-for="(item, index) in seller.infos" class="info" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Scroll from 'better-scroll'
import icon from './mods/icon.js'
import star from './mods/star'
export default {
  props: ['seller'],
  data () {
    return {
      favorite: false,
      icon
    }
  },
  components: {
    star
  },
  mounted () {
    this.$nextTick(() => {
      /* eslint-disable no-new */
      new Scroll(this.$refs.sellerWrapper, {
        click: true
      })
      // 给需要横向滚动的div设置宽度,这样创建的滚动插件才会生效,
      // 因为图片加载速度慢,所以该div一开始不会被图片撑开宽度
      this.$refs.sellerImg.style.width = 120 * this.seller.pics.length + 'px'
      new Scroll(this.$refs.imgWrapper, {
        scrollX: true,
        scrollY: false,
        click: true
      })
    })
  }
}
</script>
