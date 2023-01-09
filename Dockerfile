FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder

RUN addgroup app && adduser -S -G app app

RUN mkdir /app && chown app:app /app

WORKDIR /app

COPY . .

RUN npm install

USER app
CMD ["node", "CA_AUTH.js"]
