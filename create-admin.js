const axios = require('axios');

async function createAdmin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'admin',
      password: 'admin123',
      email: 'admin@blog.com',
      role: 'admin'
    });
    
    console.log('Admin created successfully:', response.data);
  } catch (error) {
    console.error('Error creating admin:', error.response?.data || error.message);
  }
}

createAdmin();
