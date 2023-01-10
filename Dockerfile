FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-minimal
  
WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "CA_AUTH.js"]
