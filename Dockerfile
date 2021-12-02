FROM mcr.microsoft.com/playwright:bionic

ENV PORT 3000

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


CMD [ "npm", "start" ]
