# Full-Stack Blog app

This service is part of a collection of services that work together to form the backend of a blog-type application.

## Powered by
- [React.js](https://es.reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/es/)
- [Docker](https://docs.docker.com/)
- [Kubernetes](https://kubernetes.io/es/docs/home/)
- [Nginx](https://kubernetes.github.io/ingress-nginx/deploy/)

## How it works
This is a collection of microservices orchestrated to work together as the backend of a blog-type application. The communication between them is based on events (async communication). The general idea is to introduce something within our application that is accessible from all services through an event bus.
## Event-bus objective
The objective of this bus is to handle small notifications or events that arrive from all our services. You can think of it as little objects that describe something that happened or should happen in the application.

![Screen Shot 2022-06-11 at 12 02 01 PM](https://user-images.githubusercontent.com/71559187/173193242-5b089e56-663c-4009-80d7-18fd15a6186a.png)


## Client
The frontend is built with react and basically it shows a list of posts, and in each of them you can add comments.

## Infra
The infra is provided for a kubernetes cluster.
> Each microservice is mounted in a docker container
> Each docker container is mounted on top of a kubernetes pod
> All the pods are connected to each other through a cluster ip service
> All pods and services are deployed in a kubernetes cluster


## Access to kubernetes cluster (Load balancer)
> A load balancer configured with ngnix called ingress-controller is used, which provides a series of routing rules to send traffic to the k8s cluster that contains all the pods.

[ingress]: https://www.kindpng.com/picc/m/212-2120522_kubernetes-nginx-ingress-hd-png-download.png "Nginx diagram"
![alt text][ingress]


## License

© 2022 Jonatan Waibsnaider
