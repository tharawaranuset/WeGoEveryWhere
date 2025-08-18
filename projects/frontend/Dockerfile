# 1. Base image Node.js 20
FROM node:20-alpine

# 2. โฟลเดอร์ทำงาน
WORKDIR /app

# 3. copy โค้ดทั้งหมด
COPY . .

# 4. ติดตั้ง dependencies
RUN npm install

# 6. สั่งรัน dev server
CMD ["next", "run", "dev"]
