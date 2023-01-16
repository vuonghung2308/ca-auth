FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .

CMD ["node", "CA_AUTH.js"]
