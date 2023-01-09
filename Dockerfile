FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder
  
WORKDIR /app
USER 0
COPY . .
RUN chown -R 0:0 ./
USER 0
RUN npm install
USER 0

CMD ["node", "CA_AUTH.js"]
