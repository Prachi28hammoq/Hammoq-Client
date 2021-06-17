FROM node:14 as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm run recycledcomponents
RUN npm install
RUN npm -g install react-scripts
COPY . .
CMD [ "npm", "run", "devbuild" ]

FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
