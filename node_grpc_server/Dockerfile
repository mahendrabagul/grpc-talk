FROM mhart/alpine-node:10.21.0

MAINTAINER HKS Developers <developers@hks.io>

# install required packages
RUN apk --update add build-base python libc6-compat
# added below command that resolves root user blank password
RUN sed -i -e 's/^root::/root:!:/' /etc/shadow
# added below command for shadow file permissions
RUN chmod 600 /etc/shadow

# install dependencies
ARG NPM_TOKEN

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
