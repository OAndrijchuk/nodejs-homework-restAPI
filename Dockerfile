FROM node:19

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV PORT 3001

EXPOSE $PORT

RUN npm run build

CMD ["npm", "run", "start"]