## how to setup eslint ?  (similar to preetier)

- `https://medium.com/@tericcabrel/set-up-node-js-project-with-typescript-eslint-and-prettier-b4f7bd0f1b1f`

## HOW sample workers are working ?

- redis docker run `docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
- and we can check all containers with `docker ps -a`
- also can do restart previous docker container with `docker restart <conId>`

![imgg](https://res.cloudinary.com/dncm3mid4/image/upload/v1727460937/githubreadme/zpek14llftjkfs8ksayx.png)

## what are DTO and DAO ?

- dto [ https://dev.to/tareksalem/dtos-in-javascript-118p ] (how to make with libs like zod) 
- object that carries "standardize the structure of the data" between client to server(db, thirdparty api, microservice)

- dao [ https://medium.com/@eliassalom/what-is-a-dao-layer-26a65c32b277 ]

- [ https://chatgpt.com/share/66f7a922-379c-8010-b0a8-2448f5f11b8f ]

## serizlize, deserialize, bits during network calls/ http calls

- https://youtu.be/Zhg59uq1gfE?si=iZX4M6BbcRkAVDIR

## docker helper ( decoding chunks )

- ![img](https://res.cloudinary.com/dncm3mid4/image/upload/v1729048169/githubreadme/v5k0jcjsh3yjjnqpejws.png)