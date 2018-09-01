<template>
  <div class="ratingsWrapper" ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="info">
        <div class="mark">
          <div class="num">{{seller.score}}</div>
          <div class="text">综合评分</div>
          <div class="contrast">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="stars">
          <div class="serviceScore">
            <span class="text">服务态度</span>
            <star :score="seller.serviceScore" :size="36"></star>
            <span class="num">{{seller.serviceScore}}</span>
          </div>
          <div class="foodScore">
            <span class="text">食物评分</span>
            <star :score="seller.foodScore" :size="36"></star>
            <span class="num">{{seller.foodScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="text">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="divider"></div>
      <div class="evaluation">
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
            <li class="evel" v-for="(item, index) in comRating" :key="index">
              <div class="avatar">
                <img :src="item.avatar" width="28" height="28" alt="">
              </div>
              <div class="content">
                <div class="user">
                  <span class="name">{{item.username}}</span>
                  <span class="rateTime">{{new Date(item.rateTime).toLocaleDateString()}}</span>
                </div>
                <div class="star-wrapper">
                  <star :score="item.score" :size="24"></star>
                  <span class="deleverryTime">{{item.deliveryTime}}分钟送达</span>
                </div>
                <div class="text">{{item.text}}</div>
                <div class="recommend">
                  <span class="icon" :class="item.rateType?'icon-thumb_down':'icon-thumb_up'"></span>
                  <span class="dish" v-for="(dish,idx) in item.recommend" :key="idx">{{dish}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import star from './mods/star'
import Scroll from 'better-scroll'
export default {
  props: ['seller'],
  data () {
    return {
      ratings: [],
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
    star
  },
  methods: {
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
     * 计算每种评论类别下评论的个数
     */
    comClassify () {
      this.classify.forEach(classifyItem => {
        classifyItem.count = 0
      })
      this.ratings.forEach(rating => {
        if (rating.rateType) {
          this.classify[2].count++
        } else {
          this.classify[1].count++
        }
      })
      this.classify[0].count = this.ratings.length
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
          arr = this.ratings
          break
        case 1:
          arr = this.ratings.filter(rating => {
            return rating.rateType === 0
          })
          break
        case 2:
          arr = this.ratings.filter(rating => {
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
  activated () {
    // 当路由处使用了 keep-live 标签时,浏览器会缓存页面, 如果希望
    // 每次页面获取焦点时都执行的代码,就必须放在activated里
    axios.get('/static/data.json').then(res => {
      this.ratings = res.data.ratings
      this.comClassify()
    })
  },
  mounted () {
    /* eslint-disable no-new */
    this.$nextTick(() => {
      new Scroll(this.$refs.ratingsWrapper, {
        click: true
      })
    })
  }
}
</script>
