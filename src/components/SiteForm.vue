<template>
  <div class="site-form-overlay" v-if="isOpen" @click="closeForm">
    <div class="site-form-container" @click.stop>
      <div class="site-form-header">
        <h2>添加新站点</h2>
        <button class="close-button" @click="closeForm">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <form @submit.prevent="submitForm" class="site-form">
        <div class="form-group">
          <label for="category">分类</label>
          <select id="category" v-model="formData.categoryId" required @change="updateSiteGroups">
            <option value="" disabled>选择分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="siteGroup">站点组</label>
          <div class="input-with-option">
            <select id="siteGroup" v-model="formData.siteName" required>
              <option value="" disabled>选择站点组</option>
              <option v-for="site in selectedCategorySites" :key="site" :value="site">
                {{ site }}
              </option>
              <option value="__new__">+ 创建新站点组</option>
            </select>
          </div>
        </div>
        
        <div class="form-group" v-if="formData.siteName === '__new__'">
          <label for="newSiteGroup">新站点组名称</label>
          <input id="newSiteGroup" v-model="formData.newSiteName" placeholder="输入新站点组名称" required />
        </div>
        
        <div class="form-group">
          <label for="name">站点名称</label>
          <input id="name" v-model="formData.newSite.name" placeholder="例如: ChatGPT" required />
        </div>
        
        <div class="form-group">
          <label for="url">站点URL</label>
          <input id="url" v-model="formData.newSite.url" placeholder="例如: https://chat.openai.com" required />
        </div>
        
        <div class="form-group">
          <label for="icon">图标URL</label>
          <input id="icon" v-model="formData.newSite.icon" placeholder="例如: https://example.com/icon.png" />
          <div class="icon-preview" v-if="formData.newSite.icon">
            <img :src="formData.newSite.icon" alt="图标预览" />
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">描述</label>
          <textarea id="description" v-model="formData.newSite.description" placeholder="简短描述这个站点..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="tags">标签 (用逗号分隔)</label>
          <input id="tags" v-model="tagsInput" placeholder="例如: AI对话, 热门" />
          <div class="tags-preview">
            <span class="tag" v-for="(tag, index) in parsedTags" :key="index">{{ tag }}</span>
          </div>
        </div>
        
        <div class="form-group checkbox-group">
          <input type="checkbox" id="isHot" v-model="formData.newSite.isHot" />
          <label for="isHot">标记为热门</label>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="closeForm">取消</button>
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <span v-if="isSubmitting">
              <i class="fas fa-spinner fa-spin"></i> 提交中...
            </span>
            <span v-else>添加站点</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categories: [],
      formData: {
        categoryId: '',
        siteName: '',
        newSiteName: '',
        newSite: {
          name: '',
          url: '',
          icon: '',
          description: '',
          isHot: false
        }
      },
      tagsInput: '',
      isSubmitting: false
    };
  },
  computed: {
    selectedCategory() {
      return this.categories.find(cat => cat.id === this.formData.categoryId) || { sites: [] };
    },
    selectedCategorySites() {
      return this.selectedCategory.sites || [];
    },
    parsedTags() {
      return this.tagsInput.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
    }
  },
  methods: {
    fetchCategories() {
      fetch('http://localhost:3001/api/categories')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.categories = data.categories;
          } else {
            console.error('获取分类失败:', data.message);
          }
        })
        .catch(error => {
          console.error('获取分类错误:', error);
        });
    },
    updateSiteGroups() {
      this.formData.siteName = '';
    },
    submitForm() {
      // 准备提交数据
      const submitData = {
        categoryId: this.formData.categoryId,
        siteName: this.formData.siteName === '__new__' ? this.formData.newSiteName : this.formData.siteName,
        newSite: {
          ...this.formData.newSite,
          tags: this.parsedTags
        }
      };
      
      this.isSubmitting = true;
      
      // 发送到服务器
      fetch('http://localhost:3001/api/add-site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })
      .then(response => response.json())
      .then(data => {
        this.isSubmitting = false;
        if (data.success) {
          this.$emit('site-added', data);
          this.resetForm();
          this.closeForm();
        } else {
          alert(`添加失败: ${data.message}`);
        }
      })
      .catch(error => {
        this.isSubmitting = false;
        console.error('提交错误:', error);
        alert('提交过程中发生错误，请检查控制台');
      });
    },
    resetForm() {
      this.formData = {
        categoryId: '',
        siteName: '',
        newSiteName: '',
        newSite: {
          name: '',
          url: '',
          icon: '',
          description: '',
          isHot: false
        }
      };
      this.tagsInput = '';
    },
    closeForm() {
      this.$emit('close');
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.fetchCategories();
      }
    }
  }
};
</script>

<style scoped>
.site-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.site-form-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.site-form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.site-form-header h2 {
  margin: 0;
  color: var(--primary-color);
}

.close-button {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--primary-color);
}

.site-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input {
  width: auto;
  margin-right: 0.5rem;
}

.checkbox-group label {
  margin-bottom: 0;
}

.icon-preview {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

.icon-preview img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 4px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  padding: 2px;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--primary-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.cancel-button:hover {
  background-color: var(--border-color);
}

.submit-button {
  background-color: var(--primary-color);
  border: none;
  color: white;
}

.submit-button:hover {
  background-color: var(--accent-color);
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: var(--border-color);
  cursor: not-allowed;
  transform: none;
}

.input-with-option {
  position: relative;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 