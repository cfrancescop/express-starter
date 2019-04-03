FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY src/ /usr/src/app/src

RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]