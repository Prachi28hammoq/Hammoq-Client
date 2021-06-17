FROM node:14 as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm run recycledcomponents
RUN npm install
RUN npm -g install react-scripts
CMD [ "npm", "run", "startdevhost" ]

# # FROM nginx:1.19
# # COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# # COPY --from=build /usr/src/app/build /usr/share/nginx/html
# FROM nginx:stable-alpine
# COPY --from=build /usr/src/app/build /usr/share/nginx/html
# # new
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80