// import PageTools from './PageTools/index.vue'
import * as filters from '@/filters'

// const components = [PageTools]

// 实现组建的自动注册
// require.context()
const fn = require.context('./', true, /\.vue$/)
console.log(fn.keys()) // 路径
console.log(fn('./PageTools/index.vue')) // 根据路径查找模块
// 一次性导入所有模块
// fn.keys() ==> 返回所有模块 ['./PageTools/index.vue']
// 引入要注册的组件
// 把组件用数组收集起来
// Vue.use

const components = fn.keys().map(ele => {
  return fn(ele)
})

export default {
  install: function(Vue) {
    components.forEach(ele => {
      console.log(ele)
      Vue.component(ele.default.name, ele.default)
    })
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
  }
}
