FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder

WORKDIR /app
COPY . .
RUN chown -R 1001:0 ./
USER 1001
RUN npm install

RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

CMD ["node", "CA_AUTH.js"]
