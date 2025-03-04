import { createApp, ref, reactive, computed, onMounted, watch } from "vue"

// 安全地获取localStorage数据
function safeGetItem(key, defaultValue) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : defaultValue
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return defaultValue
  }
}

// 安全地设置localStorage数据
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error("Error writing to localStorage:", error)
    return false
  }
}

// 模拟数据
const initialData = {
  categories: [
    {
      id: "1",
      name: "Web Development",
      sites: [
        { id: "11", name: "Google", url: "https://www.google.com", description: "Search engine", logo: "" },
        {
          id: "12",
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
          description: "Q&A site for programmers",
          logo: "",
        },
      ],
    },
    {
      id: "2",
      name: "Design",
      sites: [
        {
          id: "21",
          name: "Dribbble",
          url: "https://dribbble.com",
          description: "Show and tell for designers",
          logo: "",
        },
        {
          id: "22",
          name: "Behance",
          url: "https://www.behance.net",
          description: "Creative platform for designers",
          logo: "",
        },
      ],
    },
  ],
}

const translations = {
  zh: {
    noDescription: "暂无描述",
    confirmRemove: "确定要删除吗？",
    importSuccess: "导入成功！",
    importError: "导入失败！",
    confirmClearHistory: "确定要清除历史记录吗？",
  },
  en: {
    noDescription: "No description",
    confirmRemove: "Are you sure you want to delete this?",
    importSuccess: "Import successful!",
    importError: "Import failed!",
    confirmClearHistory: "Are you sure you want to clear history?",
  },
}

const app = createApp({
  setup() {
    // 状态管理
    const language = ref(localStorage.getItem("language") || "zh")
    const darkMode = ref(localStorage.getItem("darkMode") === "true")
    const searchQuery = ref("")
    const showModal = ref(false)
    const showHistory = ref(false)
    const currentCategoryId = ref("")
    const categories = reactive(safeGetItem("categories", initialData.categories))
    const history = reactive(safeGetItem("history", []))
    const searchInput = ref(null)
    const fileInput = ref(null)

    // 模拟数据
    const stats = reactive({
      totalVisits: Math.floor(Math.random() * 100000) + 50000,
      todayVisits: Math.floor(Math.random() * 1000) + 500,
    })

    // 模拟天气数据
    const weather = reactive({
      temperature: Math.floor(Math.random() * 15) + 15,
      condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
      location: "Beijing, China",
    })

    // 搜索引擎配置
    const searchEngines = [
      { name: "Google", url: "https://www.google.com/search?q=", icon: "fab fa-google" },
      { name: "Bing", url: "https://www.bing.com/search?q=", icon: "fab fa-microsoft" },
      { name: "百度", url: "https://www.baidu.com/s?wd=", icon: "fas fa-paw" },
    ]

    const currentSearchEngine = ref(searchEngines[0])

    // 新网站表单
    const newSite = reactive({
      name: "",
      url: "",
      description: "",
      logo: "",
    })

    // 计算属性
    const t = computed(() => {
      return (key) => translations[language.value][key] || key
    })

    // 方法
    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value
      safeSetItem("darkMode", darkMode.value)
    }

    const toggleLanguage = () => {
      language.value = language.value === "zh" ? "en" : "zh"
      safeSetItem("language", language.value)
    }

    const search = () => {
      if (!searchQuery.value.trim()) return

      const url = currentSearchEngine.value.url + encodeURIComponent(searchQuery.value)
      window.open(url, "_blank")
    }

    const visitSite = (site) => {
      window.open(site.url, "_blank")

      // 添加到历史记录
      const existingIndex = history.findIndex((item) => item.url === site.url)
      if (existingIndex !== -1) {
        history.splice(existingIndex, 1)
      }

      history.unshift({
        name: site.name,
        url: site.url,
        time: new Date().toISOString(),
      })

      // 限制历史记录数量
      if (history.length > 50) {
        history.pop()
      }

      safeSetItem("history", history)
    }

    const showAddSiteModal = (categoryId) => {
      currentCategoryId.value = categoryId
      resetNewSiteForm()
      showModal.value = true
    }

    const resetNewSiteForm = () => {
      newSite.name = ""
      newSite.url = ""
      newSite.description = ""
      newSite.logo = ""
    }

    const addSite = () => {
      // 验证表单
      if (!newSite.name.trim() || !newSite.url.trim()) {
        alert("网站名称和地址不能为空")
        return
      }

      // 确保URL格式正确
      if (!newSite.url.startsWith("http://") && !newSite.url.startsWith("https://")) {
        newSite.url = "https://" + newSite.url
      }

      // 添加新网站
      const category = categories.find((c) => c.id === currentCategoryId.value)
      if (category) {
        const newId = Date.now().toString()
        category.sites.unshift({
          id: newId,
          name: newSite.name,
          url: newSite.url,
          description: newSite.description || t("noDescription"),
          logo: newSite.logo,
        })

        // 保存到本地存储
        safeSetItem("categories", categories)

        // 关闭模态框
        showModal.value = false
      }
    }

    const removeSite = (categoryId, siteId) => {
      const category = categories.find((c) => c.id === categoryId)
      if (category) {
        const siteIndex = category.sites.findIndex((s) => s.id === siteId)
        if (siteIndex !== -1) {
          if (confirm(t("confirmRemove"))) {
            category.sites.splice(siteIndex, 1)
            safeSetItem("categories", categories)
          }
        }
      }
    }

    const clearHistory = () => {
      if (confirm(t("confirmClearHistory"))) {
        history.splice(0, history.length)
        safeSetItem("history", history)
      }
    }

    const exportConfig = () => {
      const config = {
        categories: categories,
        language: language.value,
        darkMode: darkMode.value,
      }

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "webnav-config.json"
      a.click()

      URL.revokeObjectURL(url)
    }

    const importConfig = () => {
      fileInput.value.click()
    }

    const handleFileImport = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result)

          if (config.categories) {
            Object.assign(categories, config.categories)
            safeSetItem("categories", categories)
          }

          if (config.language) {
            language.value = config.language
            safeSetItem("language", language.value)
          }

          if (config.darkMode !== undefined) {
            darkMode.value = config.darkMode
            safeSetItem("darkMode", darkMode.value)
          }

          alert(t("importSuccess"))
        } catch (error) {
          alert(t("importError"))
          console.error(error)
        }
      }

      reader.readAsText(file)
      event.target.value = null
    }

    const formatNumber = (num) => {
      return num.toLocaleString()
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString()
    }

    const getTotalSitesCount = () => {
      return categories.reduce((total, category) => total + category.sites.length, 0)
    }

    const getWeatherIcon = (condition) => {
      switch (condition.toLowerCase()) {
        case "sunny":
          return "fas fa-sun"
        case "cloudy":
          return "fas fa-cloud"
        case "rainy":
          return "fas fa-cloud-rain"
        case "partly cloudy":
          return "fas fa-cloud-sun"
        default:
          return "fas fa-sun"
      }
    }

    // 生命周期钩子
    onMounted(() => {
      // 注册快捷键
      document.addEventListener("keydown", (e) => {
        // Alt+S 聚焦搜索框
        if (e.altKey && e.key === "s") {
          e.preventDefault()
          searchInput.value.focus()
        }
      })

      // 增加访问量
      stats.totalVisits++
      stats.todayVisits++
    })

    // 监听暗黑模式变化
    watch(
      darkMode,
      (newVal) => {
        if (newVal) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
      { immediate: true },
    )

    return {
      language,
      darkMode,
      searchQuery,
      showModal,
      showHistory,
      currentCategoryId,
      categories,
      history,
      stats,
      weather,
      searchEngines,
      currentSearchEngine,
      newSite,
      searchInput,
      fileInput,
      t,
      toggleDarkMode,
      toggleLanguage,
      search,
      visitSite,
      showAddSiteModal,
      addSite,
      removeSite,
      clearHistory,
      exportConfig,
      importConfig,
      handleFileImport,
      formatNumber,
      formatDate,
      getTotalSitesCount,
      getWeatherIcon,
    }
  },
})

app.mount("#app")

