const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [posts] = await pool.execute(`
      SELECT p.*, u.username as author_name 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `);
    
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [posts] = await pool.execute(`
      SELECT p.*, u.username as author_name, p.author_id 
      FROM posts p 
      JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `, [id]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    console.log('DEBUG: Post data returned:', posts[0]); // Debug
    res.json(posts[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  console.log('POST /api/posts - Body:', req.body); // Debug
  try {
    const { title, content, excerpt, slug, status = 'draft', image_url } = req.body;
    const author_id = req.user.userId || req.user.id; // Lấy author_id từ token
    
    // Đảm bảo không có giá trị undefined
    const safeTitle = title || '';
    const safeContent = content || '';
    const safeExcerpt = excerpt || null;
    const safeImageUrl = image_url || null;
    
    // Tạo slug unique nếu có trùng lặp
    let finalSlug = slug || null;
    if (slug) {
      let counter = 1;
      let [existingSlugs] = await pool.execute(
        'SELECT slug FROM posts WHERE slug LIKE ?',
        [slug + '%']
      );
      
      while (existingSlugs.some(row => row.slug === finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
    }
    
    console.log('Database values:', [safeTitle, safeContent, safeExcerpt, finalSlug, status, author_id, safeImageUrl]); // Debug
    const [result] = await pool.execute(
      'INSERT INTO posts (title, content, excerpt, slug, status, author_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [safeTitle, safeContent, safeExcerpt, finalSlug, status, author_id, safeImageUrl]
    );
    
    res.status(201).json({
      message: 'Post created successfully',
      postId: result.insertId
    });
  } catch (error) {
    console.error('Create post error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      message: 'Server error',
      details: error.message 
    });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, slug, status, image_url } = req.body;
    
    console.log('DEBUG: User from token:', req.user); // Debug
    
    // Kiểm tra quyền sở hữu bài viết
    const [posts] = await pool.execute(
      'SELECT author_id FROM posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    console.log('DEBUG: Post author_id:', posts[0].author_id); // Debug
    console.log('DEBUG: User ID:', req.user.userId); // Debug
    console.log('DEBUG: User role:', req.user.role); // Debug
    
    // So sánh với kiểu dữ liệu đúng
    const isAuthor = Number(posts[0].author_id) === Number(req.user.userId);
    const isAdmin = req.user.role === 'admin';
    const isManager = req.user.role === 'manager';
    
    console.log('DEBUG: isAuthor, isAdmin, isManager:', isAuthor, isAdmin, isManager); // Debug
    
    if (!isAuthor && !isAdmin && !isManager) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const [result] = await pool.execute(
      'UPDATE posts SET title = ?, content = ?, excerpt = ?, slug = ?, status = ?, image_url = ? WHERE id = ?',
      [title, content, excerpt, slug, status, image_url, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra quyền sở hữu bài viết
    const [posts] = await pool.execute(
      'SELECT author_id FROM posts WHERE id = ?',
      [id]
    );
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (posts[0].author_id !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 