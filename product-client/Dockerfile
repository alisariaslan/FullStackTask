# product-client/Dockerfile

# Hafif Node.js imajı
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Next.js port
EXPOSE 3000

# Geliştirme modunda başlat
CMD ["npm", "run", "dev"]