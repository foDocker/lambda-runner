FROM mhart/alpine-node
COPY . /app
WORKDIR /app
RUN npm install
CMD npm start
