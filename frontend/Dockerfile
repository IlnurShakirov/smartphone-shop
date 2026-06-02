FROM node:20-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем вообще все файлы фронтенда
COPY . .

EXPOSE 5173

# Запуск Vite с принудительным указанием хоста
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


