FROM dkarchmervue/fluent-ffmpeg

RUN npm install -g nodemon
RUN npm install -g nyc
RUN npm install -g mocha

WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install && mv /usr/src/app/node_modules /node_modules
COPY . /usr/src/app

CMD [ "npm", "start" ]
