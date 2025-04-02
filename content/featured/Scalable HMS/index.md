---
date: '6'
title: 'Scalable Hospital Management System'
cover: './CICD.png'
github: 'https://github.com/Scalable-HMS'
cta: ''
tech:
  - GO
  - Kubernetes
  - Docker
  - GCP
---

A hospital management application built using flutter frontend and microservices architecture backend written in golang. Scaling being top priority, we used regionally scaled GKS with external database service to handle the load of orders of Indian population. The database was based on GCP CloudSQL with read replicas, load balanced with proxysql instance.
