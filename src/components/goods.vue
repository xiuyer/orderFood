<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item" :class="{'menu-item-selected':item.menuActive}" v-for="(item,index) in goods"
            @click="menuClick(item,index)" :key="index" ref="menuItem">
          <span class="text">
            <span class="iconMap" v-show="item.type>=0" :class="icon[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list foods-list-hook" v-for="(item,index) in goods" :key="index">
          <h1 class="title" ref="goodTitle">{{item.name}}</h1>
          <ul>
            <li class="food-item" v-for="(food,idx) in item.foods" :key="idx" @click="showDetailInfo(food)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="sell-info">
                  <span class="sellCount">月售{{food.sellCount}}</span>
                  <span class="rating">好评率{{food.rating}}</span>
                  <div class="price">
                    <span class="newPrice">￥{{food.price}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    <foodDetail ref="foodDetail" :foodData="foodData"></foodDetail>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import icon from './mods/icon.js'
import Scroll from 'better-scroll'
import shopcart from './mods/shopcart'
import cartcontrol from './mods/cartcontrol'
import foodDetail from './mods/foodDetail'
export default {
  props: ['seller'],
  data () {
    return {
      goods: [],
      icon,
      foodData: {},
      lastMenu: 0
    }
  },
  mounted () {
    axios.get('/static/data.json').then(res => {
      this.goods = res.data.goods
    })
    this.$nextTick(() => {
      // 商品滚动
      this.goodsSc = new Scroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 1
      })
      // 左侧菜单滚动
      this.menuSc = new Scroll(this.$refs.menuWrapper, {
        click: true
      })
    })
    // -------------------------------------- START -----------------------------------------------
    // *******************滚动插件文档中提示会派发滚动时触发的事件,实际上并没有派发****************
    // *******************本打算用这个事件做滚动商品时,左侧菜单焦点也跟随变化**********************
    // this.goodsSc.scroll = (x, y) => {
    //   console.log(111)
    //   let minDis = 10000
    //   let index = 0
    //   this.$refs.goodTitle.forEach((goods, idx) => {
    //     let temp = Math.abs(goods.offsetY - y)
    //     if (temp < minDis) {
    //       minDis = temp
    //       index = idx
    //     }
    //   })
    //   this.menuSc.scrollToElement(this.$refs.menuItem[index], 500, true, true)
    //   this.menuAct(this.goods[index], index)
    // }
    // -------------------------------------- END ------------------------------------------------
  },
  components: {
    shopcart,
    cartcontrol,
    foodDetail
  },
  methods: {
    /**
     * 显示商品详情
     * @param 要显示的商品
     */
    showDetailInfo (value) {
      this.$refs.foodDetail.showDetail = true
      this.foodData = value
      this.$refs.foodDetail.compuCount()
    },
    /**
     * 左侧菜单焦点设置
     * @param item 当前菜单项
     * @param index 当前菜单索引
     */
    menuAct (item, index) {
      if (item.menuActive === undefined) Vue.set(item, 'menuActive', false)
      item.menuActive = true
      this.goods[this.lastMenu].menuActive = false
      this.lastMenu = index
    },
    /**
     * 点击左侧菜单项,使右侧商品随之滚动到该菜单项对应的位置
     * @param item 当前菜单项
     * @param index 当前菜单索引
     */
    menuClick (item, index) {
      // scrollToElement(el,time,offsetX,offsetY) 滚动插件提供的方法 滚动到指定元素,
      // 参数(指定元素,滚动时间,滚动的相对X值,相对Y值) offsetX,offsetY 设为true时 滚动元素中心位置
      this.goodsSc.scrollToElement(this.$refs.goodTitle[index], 500, true, this.$refs.goodTitle[index].offsetY)
      this.menuSc.scrollToElement(this.$refs.menuItem[index], 500, true, true)
      this.menuAct(item, index)
    }
  }
}
</script>
