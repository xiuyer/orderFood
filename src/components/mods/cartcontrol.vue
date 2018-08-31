<template>
  <!--添加/删除 商品到购物车的组件-->
  <div class="cartcontrol">
    <transition name="fadeRotate">
      <div class="cart-decrease" @click.stop="decrease" v-show="food.count>0">
        <span class="icon-remove_circle_outline inner"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" id="add" @click.stop="add">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import {mapMutations} from 'vuex'
export default {
  props: ['food'],
  methods: {
    ...mapMutations([
      'vxAdd',
      'vxDecrease'
    ]),
    add () {
      if (this.food.count === undefined) {
        Vue.set(this.food, 'count', 0)
        // 可添加至购物车选项active设为true
        Vue.set(this.food, 'active', true)
      }
      this.food.count++
      // 添加至购物车
      if (this.food.active) {
        this.vxAdd(this.food)
        this.food.active = false
      }
    },
    decrease () {
      this.food.count--
      // 数量为0时删除购物车中的该商品
      if (this.food.count <= 0) {
        this.vxDecrease(this.food)
        this.food.active = true
        // 防止在减号消失之前多点而使count为负数
        this.food.count = 0
      }
    }
  }
}
</script>
