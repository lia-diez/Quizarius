FROM node:20-alpine as build
WORKDIR /app
COPY  package*.json /app/
RUN npm ci
COPY . .
COPY config/.env .
RUN npm run build
FROM nginx:alpine as prod
RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY config/nginx.conf /etc/nginx
WORKDIR /app
COPY --from=build /app/dist /app/static