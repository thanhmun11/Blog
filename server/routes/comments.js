const express = require('express');
const pool = require('../config/database');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const [comments] = await pool.execute(`
      SELECT c.*, u.username as author_name 
      FROM comments c 
      JOIN users u ON c.author_id = u.id 
      WHERE c.post_id = ? 
      ORDER BY c.created_at DESC
    `, [postId]);
    
    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { content, post_id } = req.body;
    const author_id = req.user.id; // Lấy author_id từ token
    
    const [result] = await pool.execute(
      'INSERT INTO comments (content, post_id, author_id) VALUES (?, ?, ?)',
      [content, post_id, author_id]
    );
    
    res.status(201).json({
      message: 'Comment created successfully',
      commentId: result.insertId
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE comments SET content = ? WHERE id = ?',
      [content, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 