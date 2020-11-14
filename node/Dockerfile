FROM node

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies
COPY package.json /home/node/app

RUN npm install -g nodemon
RUN npm install

# Bundle app source
COPY . /home/node/app

CMD [ "npm", "start" ]
