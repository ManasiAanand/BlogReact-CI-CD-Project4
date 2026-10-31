FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Production runtime stage
FROM nginxinc/nginx-unprivileged:alpine

# Update Alpine packages to receive available security fixes
USER root

RUN apk upgrade --no-cache

# Return to non-root user for secure Nginx execution
USER 101

# Copy frontend build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx reverse proxy configuration template
COPY default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
