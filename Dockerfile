FROM node:23
RUN npm install -g npm@11.3.0
RUN npm install -g typescript
WORKDIR /var/task/chat
