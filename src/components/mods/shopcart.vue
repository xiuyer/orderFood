<template>
  <div class="shopCart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper" @click="onShopcart">
          <div class="logo active">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="badge" v-show="totalPrice>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'active':totalPrice}">￥{{totalPrice}}</div>
        <div class="desc" v-show="totalPrice<100">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="{'enough':totalPrice >= minPrice}">{{payDesc}}</div>
      </div>
    </div>
    <transition name="transHeight">
      <div class="shopcart-list" v-show="showcart">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="shopcartListContent">
          <ul>
            <li class="food" v-for="(item,index) in vxfood" :key="index">
              <span class="name">{{item.name}}</span>
              <div class="price">
                <span>￥{{item.price}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="item"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import cartcontrol from './cartcontrol'
import {mapState} from 'vuex'
import Scroll from 'better-scroll'
export default {
  data () {
    return {
      showcart: false
    }
  },
  props: ['deliveryPrice', 'minPrice'],
  components: {
    cartcontrol
  },
  methods: {
    /**
     * 清空购物车
     */
    empty () {
      this.vxfood.forEach(food => {
        food.count = 0
        food.active = true
      })
      this.vxfood.length = 0
    },
    /**
     * 点击 显示/隐藏 购物车
     */
    onShopcart () {
      if (this.totalPrice > 0) {
        this.showcart = !this.showcart
        if (this.showcart) {
          this.$nextTick(() => {
            /* eslint-disable no-new */
            new Scroll(this.$refs.shopcartListContent, {
              click: true
            })
          })
        }
      }
    }
  },
  watch: {
    totalPrice: function (newval) {
      newval <= 0 && (this.showcart = false)
    }
  },
  computed: {
    ...mapState([
      'vxfood'
    ]),
    totalPrice () {
      let total = 0
      this.vxfood.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.vxfood.forEach(food => {
        count += food.count
      })
      return count
    },
    /**
     * 结算提示
     * @returns {string}
     */
    payDesc () {
      let str = `￥${this.minPrice}起送`
      if (this.totalPrice > 0 && this.totalPrice < this.minPrice) {
        str = `还差￥${this.minPrice - this.totalPrice}起送`
      } else if (this.totalPrice >= this.minPrice) {
        str = '去结算'
      }
      return str
    }
  }
}
</script>
