FROM node:22-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY server ./server
COPY sql ./sql
COPY app ./app
COPY demo ./demo
RUN mkdir -p data && chown -R node:node /usr/src/app
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 DB_PATH=/usr/src/app/data/centro-ia.sqlite
EXPOSE 3000
CMD ["node", "server/index.mjs"]