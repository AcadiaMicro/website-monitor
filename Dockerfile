FROM mcr.microsoft.com/playwright:bionic

ENV PORT 3000

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
ENV PLAYWRIGHT_BROWSERS_PATH=0
RUN npm install

# Bundle app source
RUN npm run build
EXPOSE 3000


ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start" ]