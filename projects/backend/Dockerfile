# ใช้ Node.js 20 แบบ Alpine
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# รัน dev server (auto reload)
CMD ["npm", "run", "start:dev"]
