FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder

WORKDIR /app
USER 0
COPY . .
RUN chown -R 1001:0 ./
USER 1001
RUN npm install

CMD ["node", "CA_AUTH.js"]
