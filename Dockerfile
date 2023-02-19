# Building Stage
FROM node:19.6-bullseye-slim AS staging
LABEL maintainer="Armin Radmüller"
ENV NODE_ENV=staging
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production Stage
FROM node:19.6-bullseye-slim AS production
LABEL maintainer="Armin Radmüller"
ENV NODE_ENV=production
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY --from=staging /app/build /app
CMD ["npm", "start"]
