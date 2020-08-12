FROM mhart/alpine-node:10.21.0

MAINTAINER mahendrabagul <bagulm123@gmail.com>

WORKDIR /app

# install node modules separately for pre-cache
ADD package.json .
ADD yarn.lock .
RUN yarn install --ignore-engines --pure-lockfile

# create /app and add files, node_modules is ignored in .dockerignore
ADD . .

# set default NODE_ENV=production
ENV NODE_ENV production

CMD ["node", "server.js"]
