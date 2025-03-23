// 删除错误的导入
// import Vue from 'vue'  // 删除这行

// 正确的导入方式
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 导入 Font Awesome 核心样式
import '@fortawesome/fontawesome-free/css/fontawesome.css'
// 导入 Font Awesome 实体图标样式
import '@fortawesome/fontawesome-free/css/solid.css'
// 导入 Font Awesome 品牌图标样式
import '@fortawesome/fontawesome-free/css/brands.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// 使用 apiBaseUrl 进行 API 请求
fetch(`${apiBaseUrl}/api/categories`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

createApp(App).mount('#app') 