FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY dist/ /usr/src/app/dist

RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]