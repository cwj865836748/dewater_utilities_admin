import Vue from 'vue'
// 自动加载 Common 目录下的 index.vue 结尾的文件
const componentsContext = require.context('./Common', true, /\index.vue$/)
componentsContext.keys().forEach(component => {
  const componentConfig = componentsContext(component)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  const ctrl = componentConfig.default || componentConfig
  Vue.component(ctrl.name, ctrl)
})
