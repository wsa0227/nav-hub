import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 处理添加站点的请求
app.post('/api/add-site', (req, res) => {
  const { categoryId, siteName, newSite } = req.body;
  const dataPath = path.join(__dirname, 'src/data.js');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件错误:', err);
      return res.status(500).json({ success: false, message: '读取数据文件失败' });
    }

    try {
      // 提取JavaScript对象
      const jsContent = data.replace(/export const navigationData = /, '').replace(/;(\s*)$/, '');
      const navigationData = eval(`(${jsContent})`);

      // 查找目标分类和 1站点组 
      const category = navigationData.categories.find(cat => cat.id === categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: '未找到指定分类' });
      }

      // 查找或创建站点组
      let siteGroup = category.sites.find(site => site.name === siteName);
      if (!siteGroup) {
        siteGroup = { name: siteName, items: [] };
        category.sites.push(siteGroup);
      }

      // 添加新站点
      siteGroup.items.push(newSite);

      // 将对象转换回JavaScript代码
      const updatedContent = `export const navigationData = ${JSON.stringify(navigationData, null, 2)};`;

      // 写入文件
      fs.writeFile(dataPath, updatedContent, 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('写入文件错误:', writeErr);
          return res.status(500).json({ success: false, message: '更新数据文件失败' });
        }
        res.json({ success: true, message: '站点添加成功' });
      });
    } catch (error) {
      console.error('处理数据错误:', error);
      res.status(500).json({ success: false, message: '处理数据时出错' });
    }
  });
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
  const dataPath = path.join(__dirname, 'src/data.js');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: '读取数据文件失败' });
    }

    try {
      const jsContent = data.replace(/export const navigationData = /, '').replace(/;(\s*)$/, '');
      const navigationData = eval(`(${jsContent})`);
      
      // 提取分类信息
      const categories = navigationData.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        sites: cat.sites.map(site => site.name)
      }));
      
      res.json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, message: '处理数据时出错' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 