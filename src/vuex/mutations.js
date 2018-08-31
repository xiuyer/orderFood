export default {
  vxAdd (state, val) {
    state.vxfood.push(val)
  },
  vxDecrease (state, val) {
    state.vxfood.forEach((food, index, arr) => {
      if (food.name === val.name) {
        arr.splice(index, 1)
      }
    })
  }
}
