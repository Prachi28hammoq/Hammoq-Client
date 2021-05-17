FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm run recycledcomponents
RUN npm install
RUN npm -g install react-scripts
EXPOSE 3000
CMD [ "npm", "run", "startdevhost" ]
