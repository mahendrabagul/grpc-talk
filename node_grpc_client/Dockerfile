FROM mhart/alpine-node:10.13.0
COPY ./ /app/
WORKDIR /app
RUN yarn install
CMD ["node", "client.js"]