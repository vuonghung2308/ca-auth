FROM node:16

WORKDIR /app
COPY . .
RUN npm install

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

CMD ["node", "CA_AUTH.js"]