// 删除错误的导入
// import Vue from 'vue'  // 删除这行

// 正确的导入方式
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app') 