# Blog Admin (React + Vite)

## Giới thiệu

Đây là project blog với giao diện quản trị, sử dụng React, Vite, TailwindCSS và mock API bằng json-server qua file `db.json`.

## Cài đặt

### 1. Cài đặt Node.js và npm
- Tải và cài đặt Node.js từ https://nodejs.org/
- Kiểm tra phiên bản:
  ```bash
  node -v
  npm -v
  ```

### 2. Cài đặt các thư viện cần thiết
- Cài đặt dependencies:
  ```bash
  npm install
  ```

### 3. Cài đặt json-server (giả lập API)
- Cài đặt toàn cục (khuyên dùng):
  ```bash
  npm install -g json-server
  ```
- Hoặc cài đặt cục bộ:
  ```bash
  npm install --save-dev json-server
  ```

### 4. Chạy mock API với json-server
- Chạy lệnh sau tại thư mục gốc (nơi có file `db.json`):
  ```bash
  json-server --watch db.json
  ```
- API sẽ chạy tại: http://localhost:3000

### 5. Chạy ứng dụng React
- Chạy lệnh:
  ```bash
  npm run dev
  ```
- Ứng dụng sẽ chạy tại: http://localhost:5173 (hoặc cổng do Vite chỉ định)

## Scripts
- `npm run dev`: Chạy ứng dụng ở chế độ phát triển
- `npm run build`: Build ứng dụng
- `npm run preview`: Xem thử bản build
- `npm run lint`: Kiểm tra code với ESLint

## Tham khảo
- [json-server](https://github.com/typicode/json-server)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)

## Ghi chú
- Đảm bảo chạy cả mock API (`json-server`) và ứng dụng React cùng lúc để frontend có thể truy cập dữ liệu.
- Có thể chỉnh sửa dữ liệu mẫu trong `db.json` để phù hợp với nhu cầu phát triển.
