# Hướng dẫn Test API

## 1. Test GET Posts
**URL:** `http://localhost:5000/api/posts`
**Method:** GET
**Expected Response:** JSON array của các bài viết

## 2. Test GET Users
**URL:** `http://localhost:5000/api/auth/users`
**Method:** GET
**Expected Response:** JSON array của các users

## 3. Test Register User
**URL:** `http://localhost:5000/api/auth/register`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com",
  "role": "viewer"
}
```

## 4. Test Login
**URL:** `http://localhost:5000/api/auth/login`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

## 5. Test Create Post
**URL:** `http://localhost:5000/api/posts`
**Method:** POST
**Headers:** `Content-Type: application/json`
**Body:**
```json
{
  "title": "Test Post",
  "content": "This is a test post content",
  "excerpt": "Test excerpt",
  "slug": "test-post",
  "status": "published",
  "author_id": 1
}
```

## Cách test nhanh:
1. Mở browser
2. Truy cập: `http://localhost:5000/api/posts`
3. Nếu thấy JSON data = thành công! 