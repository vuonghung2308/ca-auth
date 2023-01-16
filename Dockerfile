FROM image-registry.openshift-image-registry.svc:5000/openshift/nodejs:16-ubi8
  
WORKDIR /app

COPY . .

RUN npm install

RUN pwd

RUN whoami

CMD ["node", "CA_AUTH.js"]
