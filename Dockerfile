FROM node:20.12.0-alpine3.19

# Declare build arguments
ARG PORT
ARG REDIS_PORT
ARG REDIS_HOST

WORKDIR /usr/app/

# COPY package.json package-lock.json ./

# COPY src ./src

COPY . ./

RUN npm ci

# Set environment variables for the running container 
ENV PORT=$PORT
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_HOST=$REDIS_HOST

CMD ["npm", "run" ,"devStart"]

