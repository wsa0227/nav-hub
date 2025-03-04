export const navigationData = {
  categories: [
    {
      name: '常用工具',
      icon: 'fas fa-tools',
      sites: [
        {
          name: '搜索引擎',
          items: [
            { name: 'Google', url: 'https://www.google.com', icon: 'fab fa-google' },
            { name: 'Bing', url: 'https://www.bing.com', icon: 'fab fa-microsoft' },
            { name: '百度', url: 'https://www.baidu.com', icon: 'fas fa-paw' }
          ]
        },
        {
          name: '办公套件',
          items: [
            { name: 'Google Docs', url: 'https://docs.google.com', icon: 'fas fa-file-alt' },
            { name: 'Office 365', url: 'https://www.office.com', icon: 'fas fa-file-word' },
            { name: '腾讯文档', url: 'https://docs.qq.com', icon: 'fas fa-file-word' }
          ]
        },
        {
          name: '云存储',
          items: [
            { name: 'Dropbox', url: 'https://www.dropbox.com', icon: 'fab fa-dropbox' },
            { name: 'OneDrive', url: 'https://onedrive.live.com', icon: 'fab fa-microsoft' },
            { name: '百度网盘', url: 'https://pan.baidu.com', icon: 'fas fa-cloud' }
          ]
        },
        {
          name: '设计资源',
          items: [
            { name: 'Canva', url: 'https://www.canva.com', icon: 'fas fa-palette' },
            { name: 'Figma', url: 'https://www.figma.com', icon: 'fab fa-figma' },
            { name: '花瓣网', url: 'https://huaban.com', icon: 'fas fa-image' }
          ]
        },
        {
          name: '效率工具',
          items: [
            { name: 'Notion', url: 'https://www.notion.so', icon: 'fas fa-book' },
            { name: 'Trello', url: 'https://trello.com', icon: 'fab fa-trello' },
            { name: '滴答清单', url: 'https://www.dida365.com', icon: 'fas fa-check-square' }
          ]
        }
      ]
    },
    {
      name: 'AI专区',
      icon: 'fas fa-robot',
      sites: [
        {
          name: '对话模型',
          items: [
            { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'fas fa-comment-dots' },
            { name: 'Claude', url: 'https://claude.ai', icon: 'fas fa-brain' },
            { name: '文心一言', url: 'https://yiyan.baidu.com', icon: 'fas fa-comment' }
          ]
        },
        {
          name: '模型平台',
          items: [
            { name: 'HuggingFace', url: 'https://huggingface.co', icon: 'fas fa-smile' },
            { name: 'Replicate', url: 'https://replicate.com', icon: 'fas fa-cube' }
          ]
        },
        {
          name: 'AI绘画',
          items: [
            { name: 'MidJourney', url: 'https://www.midjourney.com', icon: 'fas fa-paint-brush' },
            { name: 'Stable Diffusion', url: 'https://stability.ai', icon: 'fas fa-palette' },
            { name: 'Leonardo.ai', url: 'https://leonardo.ai', icon: 'fas fa-robot' }
          ]
        }
      ]
    }
    // ... 其他分类
  ],
  stats: {
    totalVisits: 12345,
    dailyVisits: 678,
    lastUpdated: '2024-03-20'
  }
} 