# WebNav - 现代化网址导航站

这是一个功能齐全的现代化网址导航站，具有响应式布局、多语言支持、暗黑模式和其他高级功能。

## 功能特点

- 响应式布局，适配手机/PC
- 顶部固定搜索栏（支持Google/Bing/百度搜索切换）
- 卡片式分类导航，每类展示多个精选网站
- 鼠标悬停动态效果
- 支持暗黑模式切换
- 多语言支持开关（中/英）
- 用户自定义添加/删除书签
- 最近访问历史记录
- 天气预报模块
- 快捷键支持（Alt+S聚焦搜索框）
- 导出/导入配置文件功能
- PWA支持，可安装为本地应用

## 部署说明

1. 将所有文件上传到您的Web服务器
2. 确保服务器支持静态文件服务
3. 访问您的域名即可使用

## 本地开发

1. 克隆仓库到本地
2. 使用任何HTTP服务器提供静态文件服务，例如：
   - 使用Python: `python -m http.server 8000`
   - 使用Node.js: `npx serve`
3. 在浏览器中访问 `http://localhost:8000`

## 技术栈

- HTML5/CSS3
- Vue 3 (通过CDN引入)
- 本地存储 (LocalStorage)
- Service Worker (PWA支持)
- Font Awesome 6 图标

## 自定义

您可以通过编辑 `data.js` 文件来自定义网站分类和链接。

## 加载速度优化建议

1. 使用CDN加速静态资源
2. 启用HTTP/2以提高并行加载性能
3. 启用Gzip/Brotli压缩
4. 使用图片CDN服务优化图片加载
5. 考虑使用Cloudflare等CDN服务提供全球加速

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 移动浏览器 (iOS Safari, Android Chrome)

## 许可证

MIT

