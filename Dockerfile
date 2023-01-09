FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder
USER 0
WORKDIR /app
COPY ./package.json .
RUN chown -R 1001:0 ./
USER 1001
RUN npm install
COPY . .

CMD ["node", "CA_AUTH.js"]
