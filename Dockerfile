FROM node:23.0.0

WORKDIR /usr

COPY ./ ./

RUN npm install

EXPOSE 8081

CMD ["npm", "start"]
