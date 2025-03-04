<template>
  <div :class="['min-h-screen transition-colors duration-300', isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800']">
    <div class="container mx-auto px-4 py-8">
      <!-- 头部区域 -->
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          WebNav - 现代化网址导航站
        </h1>
        <button @click="toggleDarkMode" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <i :class="['fas', isDarkMode ? 'fa-sun' : 'fa-moon']"></i>
        </button>
      </header>

      <!-- 搜索框 -->
      <div class="mb-8">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索网站..."
            :class="['w-full p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800']"
          >
          <i class="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- 访问统计 -->
      <div :class="['mb-8 p-4 rounded-lg', isDarkMode ? 'bg-gray-800' : 'bg-white']">
        <div class="flex justify-around text-center">
          <div>
            <div class="text-2xl font-bold text-blue-500">{{ stats.totalVisits.toLocaleString() }}</div>
            <div class="text-sm text-gray-500">总访问量</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-500">{{ stats.dailyVisits.toLocaleString() }}</div>
            <div class="text-sm text-gray-500">今日访问</div>
          </div>
          <div>
            <div class="text-sm text-gray-500">最后更新：{{ stats.lastUpdated }}</div>
          </div>
        </div>
      </div>

      <!-- 导航分类 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(category, index) in filteredCategories" 
          :key="index" 
          :class="['p-6 rounded-lg shadow-lg transform hover:scale-102 transition-all duration-300',
            isDarkMode ? 'bg-gray-800' : 'bg-white']"
        >
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <i :class="[category.icon, 'mr-2 text-blue-500']"></i>
            {{ category.name }}
          </h2>
          <div class="space-y-4">
            <div v-for="(section, sectionIndex) in category.sites" :key="sectionIndex">
              <h3 class="text-lg font-medium mb-2 text-purple-500">{{ section.name }}</h3>
              <div class="grid grid-cols-2 gap-2">
                <a 
                  v-for="(item, itemIndex) in section.items" 
                  :key="itemIndex"
                  :href="item.url"
                  target="_blank"
                  :class="['flex items-center p-2 rounded transition-colors',
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100']"
                >
                  <i :class="[item.icon, 'mr-2 text-gray-500']"></i>
                  <span>{{ item.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigationData } from './data.js'

export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      navData: navigationData,
      isDarkMode: false,
      stats: navigationData.stats
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.navData.categories;
      
      const query = this.searchQuery.toLowerCase();
      return this.navData.categories.map(category => ({
        ...category,
        sites: category.sites.map(section => ({
          ...section,
          items: section.items.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.url.toLowerCase().includes(query)
          )
        })).filter(section => section.items.length > 0)
      })).filter(category => category.sites.some(section => section.items.length > 0));
    }
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle('dark');
    }
  },
  mounted() {
    // 检查系统主题偏好
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }
  }
}
</script>

<style>
.hover\:scale-102:hover {
  transform: scale(1.02);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.grid > div {
  animation: fadeIn 0.3s ease-out forwards;
}
</style> 