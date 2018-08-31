<template>
  <transition name="move">
    <div class="detailWrapper" v-show="showDetail" ref="detailWrapper">
      <div class="foodDetail">
        <div class="back" @click="back">
          <i class="icon-arrow_lift"></i>
        </div>
        <img :src="foodData.image" alt="" width="100%" height="425">
        <div class="info">
          <div class="title">{{foodData.name}}</div>
          <div class="desc">
            <span>月售{{foodData.sellCount}}</span>
            <span>好评率{{foodData.rating}}</span>
          </div>
          <div class="price">￥{{foodData.price}}</div>
          <transition name="fade">
            <div class="shopCart"  v-show="!foodData.count">
              <div class="text" @click="addCart">加入购物车</div>
            </div>
          </transition>
          <cartcontrol ref="cartcontrol" :food="foodData"></cartcontrol>
        </div>
        <div class="divider"></div>
        <div class="desc">
          <div class="title">商品介绍</div>
          <div class="content">{{foodData.info}}</div>
        </div>
        <div class="divider"></div>
        <div class="evaluation">
          <div class="title">商品评价</div>
          <div class="classify">
            <span v-for="(item,index) in classify" class="item"
                  :class='{"active":item.active, "bad": index===2, "badActive": index===2 && item.active}' :key="index" @click="toggleClassify(index)">
              {{item.name}}{{item.count}}</span>
          </div>
          <div class="switch"  @click="isShowText=!isShowText">
            <span class="icon-check_circle" :class="{'on':isShowText}"></span>
            <span class="text">只看有内容的评价</span>
          </div>
          <div class="evel-list">
            <ul>
              <li class="evel" v-for="(item,index) in comRating" :key="index">
                <div class="userInfo">
                  <div class="time">{{new Date(item.rateTime).toLocaleDateString()}}</div>
                  <div class="user">
                    <span>{{item.username}}</span>
                    <span class="avatar">
                      <img :src="item.avatar" alt="" width="12" height="12">
                    </span>
                  </div>
                </div>
                <div class="content">
                  <span class="icon" :class="item.rateType?'icon-thumb_down':'icon-thumb_up'"></span>
                  <span>{{item.text}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import cartcontrol from './cartcontrol'
import Scroll from 'better-scroll'
export default {
  props: [
    'foodData'
  ],
  data () {
    return {
      showDetail: false,
      isShowText: false,
      classify: [
        {name: '全部', count: 0, active: true},
        {name: '推荐', count: 0, active: false},
        {name: '吐槽', count: 0, active: false}
      ],
      lastClassify: 0
    }
  },
  components: {
    cartcontrol
  },
  methods: {
    addCart () {
      this.$refs.cartcontrol.add()
    },
    /**
     * 切换显示评论的类别
     * @param index 评论类别的编号,即该类别在数据classify数组中的索引号
     */
    toggleClassify (index) {
      this.classify[this.lastClassify].active = false
      this.classify[index].active = true
      this.lastClassify = index
    },
    /**
     * 返回到商品列表
     */
    back () {
      this.showDetail = false
      this.toggleClassify(0)
    },
    /**
     * 计算每种评论类别下评论的个数
     */
    compuCount () {
      this.classify.forEach(classifyItem => {
        classifyItem.count = 0
      })
      this.isShowText = false
      this.$nextTick(function () {
        this.foodData.ratings.forEach(rating => {
          if (rating.rateType) {
            this.classify[2].count++
          } else {
            this.classify[1].count++
          }
        })
        this.classify[0].count = this.foodData.ratings.length
      })
    }
  },
  computed: {
    /**
     * 根据评论类别的变化,实时获取显示的评论列表
     * @returns 一个包含当前该显示的评论的数组
     */
    comRating () {
      let arr = []
      switch (this.lastClassify) {
        case 0:
          arr = this.foodData.ratings
          break
        case 1:
          arr = this.foodData.ratings.filter(rating => {
            return rating.rateType === 0
          })
          break
        case 2:
          arr = this.foodData.ratings.filter(rating => {
            return rating.rateType === 1
          })
          break
      }
      if (this.isShowText) {
        return arr.filter(rating => {
          return rating.text !== ''
        })
      }
      return arr
    }
  },
  mounted () {
    /* eslint-disable no-new */
    new Scroll(this.$refs.detailWrapper, {
      click: true
    })
  }
}
</script>
