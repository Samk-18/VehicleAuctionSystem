

# ---------- Stage 1: Build ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy project
COPY . .

# 🔥 Move into actual frontend folder
WORKDIR /app/app

RUN npm run build


# ---------- Stage 2: Nginx ----------
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
