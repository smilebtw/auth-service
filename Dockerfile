FROM node:16

WORKDIR /auth/

COPY package*.json ./

RUN npm install

COPY . . 

EXPOSE 5000 

RUN npm run generate
CMD ["npm", "run", "dev"]
