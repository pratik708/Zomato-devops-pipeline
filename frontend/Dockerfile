FROM node:18-alpine as build

# Build argument for API base URL
ARG VITE_API_BASE=https://foodhub.sbs
ENV VITE_API_BASE=${VITE_API_BASE}

WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
			npm ci --silent; \
		else \
			npm install --silent; \
		fi
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]