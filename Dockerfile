FROM node:20.12.0-alpine3.19

# Declare build arguments
ARG PORT
ARG REDIS_PORT
ARG REDIS_HOST
ARG REDIS_PASSWORD

# Set the working directory
WORKDIR /usr/app/

# Copy the application code into the container
COPY . ./

# Install dependencies
RUN npm ci

# Set environment variables for the running container
ENV PORT=$PORT
ENV REDIS_PORT=$REDIS_PORT
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD

# Print all environment variables for debugging purposes
CMD ["sh", "-c", "printenv && npm run devStart"]
