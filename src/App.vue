<template>
  <div class="nav-hub">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo-container">
        <span class="logo-text">🧭</span>
        <h1 class="site-title">AI导航站</h1>
      </div>
      
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索你需要的资源..." 
          class="search-input"
        >
        <button class="search-button">
          <i class="search-icon"></i>
        </button>
      </div>
      
      <div class="header-actions">
        <button class="add-site-button" @click="openSiteForm">
          <i class="fas fa-plus"></i> 添加站点
        </button>
        <button class="theme-toggle" @click="toggleTheme">
          <i class="theme-icon"></i>
        </button>
        <a href="https://github.com/yourusername/ai-nav" target="_blank" class="github-link">
          <button class="github-button">
            GitHub
          </button>
        </a>
      </div>
    </header>
    
    <!-- 主要内容区 -->
    <main class="main-content">
      <!-- 侧边栏分类导航 -->
      <aside class="sidebar">
        <nav class="category-nav">
          <div class="nav-group">
            <h3 class="nav-group-title">常用导航</h3>
            <ul class="nav-list">
              <li v-for="category in sortedCategories" :key="category.id" class="nav-item">
                <a :href="`#${category.id}`" class="nav-link">
                  <i :class="['category-icon', category.icon]"></i>
                  <span>{{ category.name }}</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      
      <!-- 内容区域 -->
      <div class="content">
        <!-- 热门推荐区域 -->
        <section class="section hot-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-fire"></i> 热门推荐
            </h2>
          </div>
          
          <div class="site-grid">
            <div 
              v-for="site in hotSites" 
              :key="site.name" 
              class="site-card"
            >
              <div class="site-card-header">
                <img v-if="site.icon && site.icon.startsWith('/')" :src="site.icon" :alt="site.name" class="site-icon">
                <i v-else-if="site.icon" :class="[site.icon, 'site-icon-fa']"></i>
                <span v-else class="site-icon-placeholder">{{ site.name[0] }}</span>
                
                <div class="site-info">
                  <h3 class="site-name">
                    {{ site.name }}
                    <span v-if="site.isHot" class="hot-badge">热门</span>
                  </h3>
                  <div v-if="site.tags" class="site-tags">
                    <span v-for="(tag, index) in site.tags" :key="index" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              
              <p v-if="site.description" class="site-description">{{ site.description }}</p>
              
              <div class="site-card-footer">
                <a :href="site.url" target="_blank" class="visit-button">访问站点</a>
                <button class="favorite-button">
                  <i class="fas fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <!-- 分类内容区域 -->
        <section 
          v-for="category in filteredCategories" 
          :key="category.id" 
          :id="category.id" 
          class="section category-section"
        >
          <div class="section-header">
            <h2 class="section-title">
              <i :class="category.icon"></i> {{ category.name }}
            </h2>
          </div>
          
          <div class="site-grid">
            <div 
              v-for="group in category.sites" 
              :key="group.name" 
              class="site-group"
            >
              <h3 class="group-title">{{ group.name }}</h3>
              <div class="group-items">
                <a 
                  v-for="item in group.items" 
                  :key="item.name" 
                  :href="item.url" 
                  target="_blank" 
                  class="group-item"
                >
                  <i v-if="item.icon && item.icon.startsWith('fa')" :class="item.icon"></i>
                  <img v-else-if="item.icon" :src="item.icon" :alt="item.name" class="group-item-icon">
                  <span v-else class="group-item-icon-placeholder">{{ item.name[0] }}</span>
                  <span class="group-item-name">{{ item.name }}</span>
                  <div v-if="item.tags" class="group-item-tags">
                    <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                  <span v-if="item.isHot" class="hot-badge">热门</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 AI导航站 - 收集优质AI工具和资源</p>
        <div class="footer-links">
          <a href="/about">关于我们</a>
          <a href="/contact">联系方式</a>
          <a href="/submit">提交网站</a>
        </div>
      </div>
    </footer>
    
    <!-- 站点添加表单 -->
    <SiteForm 
      :isOpen="isSiteFormOpen" 
      @close="closeSiteForm"
      @site-added="handleSiteAdded"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { navigationData } from './data.js'
import SiteForm from './components/SiteForm.vue'

export default {
  name: 'App',
  components: {
    SiteForm
  },
  setup() {
    const searchQuery = ref('')
    const categories = navigationData.categories
    const isDarkMode = ref(false)
    const isSiteFormOpen = ref(false)
    
    // 对分类进行排序
    const sortedCategories = computed(() => {
      return categories.slice().sort((a, b) => a.order - b.order)
    })
    
    // 获取所有热门站点
    const hotSites = computed(() => {
      const sites = []
      categories.forEach(category => {
        category.sites.forEach(site => {
          site.items.forEach(item => {
            if (item.isHot) {
              sites.push(item)
            }
          })
        })
      })
      return sites
    })
    
    // 搜索功能
    const filteredCategories = computed(() => {
      if (!searchQuery.value) return categories
      
      const query = searchQuery.value.toLowerCase()
      
      return categories.map(category => {
        if (!category.sites) return { ...category, sites: [] }
        
        const filteredSites = category.sites.map(site => {
          // 如果是单个站点
          if (site.name && !site.items) {
            const nameMatch = site.name.toLowerCase().includes(query)
            const descMatch = site.description && site.description.toLowerCase().includes(query)
            const tagMatch = site.tags && site.tags.some(tag => tag.toLowerCase().includes(query))
            
            return (nameMatch || descMatch || tagMatch) ? site : null
          } 
          // 如果是分组
          else if (site.items) {
            const filteredItems = site.items.filter(item => 
              item.name && item.name.toLowerCase().includes(query)
            )
            
            return filteredItems.length > 0 ? { ...site, items: filteredItems } : null
          }
          
          return null
        }).filter(Boolean) // 移除 null 项
        
        return {
          ...category,
          sites: filteredSites
        }
      }).filter(category => category.sites && category.sites.length > 0)
    })
    
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      document.body.classList.toggle('dark-mode', isDarkMode.value)
    }
    
    const openSiteForm = () => {
      isSiteFormOpen.value = true
    }
    
    const closeSiteForm = () => {
      isSiteFormOpen.value = false
    }
    
    const handleSiteAdded = (data) => {
      // 显示成功消息
      showNotification('站点添加成功！', 'success')
      
      // 可以选择刷新页面或动态更新数据
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
    
    const showNotification = (message, type = 'info') => {
      const notification = document.createElement('div')
      notification.className = `notification ${type}`
      notification.innerHTML = message
      document.body.appendChild(notification)
      
      // 动画效果
      setTimeout(() => {
        notification.classList.add('show')
      }, 10)
      
      // 自动关闭
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
    
    return {
      sortedCategories,
      searchQuery,
      hotSites,
      filteredCategories,
      toggleTheme,
      openSiteForm,
      closeSiteForm,
      handleSiteAdded,
      isSiteFormOpen
    }
  }
}
</script>

<style>
/* 全局样式 */
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --accent-color: #e74c3c;
  --text-color: #333;
  --light-text: #666;
  --bg-color: #f9f9f9;
  --card-bg: #fff;
  --border-color: #eaeaea;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  --hover-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.nav-hub {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 头部样式 */
.header {
  background-color: var(--card-bg);
  box-shadow: var(--shadow);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 40px;
  margin-right: 1rem;
}

.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 1px solid var(--border-color);
  border-radius: 50px;
  font-size: 1rem;
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.add-site-button, .theme-toggle, .github-link {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.add-site-button {
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.github-link {
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 主内容区样式 */
.main-content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px;
  background-color: var(--card-bg);
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--border-color);
  height: calc(100vh - 70px);
  position: sticky;
  top: 70px;
  overflow-y: auto;
}

.nav-group-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: var(--light-text);
  margin-bottom: 1rem;
  padding-left: 0.5rem;
}

.nav-list {
  list-style: none;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
}

.nav-link:hover {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
}

.category-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.content {
  flex: 1;
  padding: 2rem;
}

.section {
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.site-card {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.site-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--hover-shadow);
}

.site-card.hot {
  border-left: 3px solid var(--accent-color);
}

.site-card.new {
  border-left: 3px solid var(--secondary-color);
}

.site-card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.site-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 1rem;
  object-fit: cover;
}

.site-info {
  flex: 1;
}

.site-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hot-badge, .new-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-weight: 500;
}

.hot-badge {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--accent-color);
}

.new-badge {
  background-color: rgba(46, 204, 113, 0.1);
  color: var(--secondary-color);
}

.site-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  border-radius: 20px;
}

.site-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 0.9rem;
}

.star.filled {
  color: #f39c12;
}

.site-description {
  margin-bottom: 1.5rem;
  color: var(--light-text);
  font-size: 0.95rem;
  flex: 1;
}

.site-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.visit-button {
  padding: 0.5rem 1.25rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
}

.visit-button:hover {
  background-color: #2980b9;
}

.favorite-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.favorite-button:hover {
  background-color: rgba(231, 76, 60, 0.1);
  border-color: var(--accent-color);
}

.heart-icon {
  color: var(--accent-color);
}

/* 页脚样式 */
.footer {
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--light-text);
  text-decoration: none;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
  }
  
  .nav-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .nav-item {
    margin-bottom: 0;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo-container {
    margin-bottom: 1rem;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
    margin: 0 0 1rem 0;
  }
  
  .site-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* 分组样式 */
.site-group {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.group-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
}

.group-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.group-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
  position: relative;
  border: 1px solid var(--border-color);
}

.group-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
  border-color: var(--primary-color);
}

.group-item i {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--primary-color);
  margin-right: 0.75rem;
}

.group-item-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-right: 0.75rem;
}

.group-item-name {
  font-weight: 500;
  flex: 1;
}

.group-item-tags {
  display: flex;
  gap: 0.25rem;
  margin-left: 0.5rem;
}

.group-item .tag {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  border-radius: 4px;
}

.group-item .hot-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--accent-color);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .group-items {
    grid-template-columns: 1fr;
  }
}

/* 添加新样式 */
.add-site-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-site-button:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

.add-site-button i {
  font-size: 0.9rem;
}

/* 通知样式 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  z-index: 1100;
  transform: translateX(120%);
  transition: transform 0.3s ease;
}

.notification.show {
  transform: translateX(0);
}

.notification.success {
  border-left: 4px solid #2ecc71;
}

.notification.error {
  border-left: 4px solid #e74c3c;
}

.notification.info {
  border-left: 4px solid var(--primary-color);
}
</style> 