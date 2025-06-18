<<<<<<< HEAD
# n8n-nodes-redis-collector

Một custom node cho n8n để thu thập và tổng hợp tin nhắn từ Redis.

## Tính năng

- Thu thập tất cả tin nhắn từ một Redis list theo thread ID
- Chờ một khoảng thời gian được cấu hình trước khi thu thập
- Tự động xóa Redis key sau khi thu thập
- Trả về nội dung đã tổng hợp và metadata

## Cài đặt

### Yêu cầu

- n8n phiên bản >= 1.93
- Node.js >= 16
- Redis server

### Cài đặt từ npm (sau khi publish)

```bash
npm install n8n-nodes-redis-collector
```

### Cài đặt thủ công cho n8n self-hosted

1. **Build package:**

```bash
npm install
npm run build
```

2. **Copy vào thư mục n8n:**

```bash
# Tạo thư mục custom nodes nếu chưa có
mkdir -p ~/.n8n/custom

# Copy built package
cp -r dist ~/.n8n/custom/n8n-nodes-redis-collector
```

3. **Cập nhật n8n configuration:**

Thêm vào file `~/.n8n/config/index.js` (tạo nếu chưa có):

```javascript
module.exports = {
  nodes: {
    include: [
      '~/.n8n/custom/n8n-nodes-redis-collector'
    ]
  }
};
```

Hoặc sử dụng environment variable:

```bash
export N8N_CUSTOM_EXTENSIONS="~/.n8n/custom"
```

4. **Restart n8n:**

```bash
n8n start
```

### Cài đặt cho n8n Docker

1. **Mount custom nodes directory:**

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/dist:/home/node/.n8n/custom/n8n-nodes-redis-collector \
  n8nio/n8n
```

2. **Hoặc build custom Docker image:**

Tạo `Dockerfile`:

```dockerfile
FROM n8nio/n8n:latest

USER root
COPY dist /home/node/.n8n/custom/n8n-nodes-redis-collector
RUN chown -R node:node /home/node/.n8n/custom

USER node
ENV N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
```

Build và chạy:

```bash
docker build -t n8n-custom .
docker run -it --rm --name n8n -p 5678:5678 n8n-custom
```

## Sử dụng

### Tham số đầu vào

- **Thread ID** (string, bắt buộc): ID của Redis key chứa tin nhắn
- **Redis Host** (string, mặc định: localhost): Hostname của Redis server
- **Redis Port** (number, mặc định: 6379): Port của Redis server
- **Wait Time** (number, mặc định: 5): Thời gian chờ (giây) trước khi thu thập

### Đầu ra

```json
{
  "threadId": "12345",
  "content": "message1\nmessage2\nmessage3",
  "messageCount": 3,
  "collectedAt": "2024-01-15T10:30:00.000Z"
}
```

### Ví dụ workflow

1. **Trigger node** → **Redis Collector**
2. Cấu hình Redis Collector với:
   - Thread ID: `chat_session_123`
   - Host: `redis.example.com`
   - Port: `6379`
   - Wait Time: `10`

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run dev
```

### Lint

```bash
npm run lint
npm run lintfix
```

## Cấu trúc dự án

```
gomtin/
├── src/
│   ├── nodes/
│   │   └── RedisCollector/
│   │       ├── RedisCollector.node.ts
│   │       └── redisCollector.svg
│   └── index.ts
├── dist/                 # Built files
├── package.json
├── tsconfig.json
├── gulpfile.js
└── README.md
```

## Troubleshooting

### Node không xuất hiện trong n8n

1. Kiểm tra n8n logs để xem có lỗi load node không
2. Đảm bảo đường dẫn custom nodes đúng
3. Restart n8n sau khi cài đặt
4. Kiểm tra permissions của thư mục custom nodes

### Lỗi kết nối Redis

1. Kiểm tra Redis server đang chạy
2. Xác nhận host và port đúng
3. Kiểm tra firewall/network connectivity
4. Đảm bảo Redis cho phép kết nối từ n8n server

## License

MIT
=======
# redis-collector
>>>>>>> e94f711d8ecc05cccd2fcdeedb8688f584c16243
