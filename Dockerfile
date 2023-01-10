FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8 AS builder
  
WORKDIR /app
#USER 0
COPY . .
#RUN chown -R 0:0 .
#USER 0
RUN npm install --unsafe-perm=true --allow-root
#USER 0
#RUN node CA_AUTH.js
CMD ["node", "CA_AUTH.js"]
