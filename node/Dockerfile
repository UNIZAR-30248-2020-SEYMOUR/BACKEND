FROM node

WORKDIR /home/node/app

COPY package.json /home/node/app
RUN npm install -g nodemon
RUN npm install

CMD [ "npm", "start" ]
