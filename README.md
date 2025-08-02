
# Distributed Key-Value Store

## Project Overview
This project implements a **distributed key-value store** using a **Primary/Backup replication model**.  
It provides RESTful HTTP endpoints for storing, retrieving, and deleting key-value pairs and is deployed with:

- **Node.js / Express**
- **Docker and Docker Compose** (3 containers: primary and 2 backups)
- **AWS EC2** for hosting
- **GitHub Actions CI/CD** for automated build, deployment, and view initialization

The application is currently hosted on an AWS EC2 instance.  
Once deployed, it is available at:

```
http://3.83.89.100:8081/docs
http://3.83.89.100:8082/docs
http://3.83.89.100:8083/docs
```

## Features
- **Primary/Backup replication** to maintain strong consistency.
- **View management**: Each node maintains a list of all nodes in the cluster.
- Automated CI/CD: GitHub Actions builds and pushes Docker images to DockerHub, deploys to EC2, and initializes the cluster view on all nodes.
- OpenAPI 3.0 + Swagger UI for API documentation.

## How to Use (Hosted on EC2)

### Cluster View
After each deployment, the workflow automatically initializes the cluster view for all three nodes, so you can immediately begin using the API.

### Writing Data
To create or update a key:
```bash
curl -X PUT http://3.83.89.100:8081/data/test \
  -H "Content-Type: application/json" \
  -d '{"value":"hello"}'
```

### Reading Data
You can then read from **any node**:
```bash
curl http://3.83.89.100:8082/data/test
curl http://3.83.89.100:8083/data/test
```

### Testing Replication
You can test the replication on the deployed cluster by:
1. Using the Swagger UI or `curl` to **PUT** a key to node1.
2. Using the Swagger UI or `curl` to **GET** the same key from node2 and node3.
If the system is configured correctly, the value will appear on all replicas because the view is already set up during deployment.

### Swagger UI
Swagger API docs are available at:
```
http://3.83.89.100:8081/docs
http://3.83.89.100:8082/docs
http://3.83.89.100:8083/docs
```

## Local Development

1. Clone the repository.
2. Build and start the cluster:
   ```bash
   docker-compose up --build
   ```
3. Initialize the cluster view manually (if running locally):
   ```bash
   for port in 8081 8082 8083; do
     curl -X PUT http://localhost:$port/view \
       -H "Content-Type: application/json" \
       -d '{
         "view": [
           {"address":"node1:8081","id":1},
           {"address":"node2:8081","id":2},
           {"address":"node3:8081","id":3}
         ]
       }'
   done
   ```

4. Access the Swagger UI locally:
   ```
   http://localhost:8081/docs
   http://localhost:8082/docs
   http://localhost:8083/docs
   ```

## Deployment Workflow
On push to `main`:
- GitHub Actions builds the Docker images and pushes them to DockerHub.
- EC2 pulls the images, recreates the containers, and runs the above view initialization loop automatically.
- After deployment, the cluster is immediately ready to accept requests.

## Contributors
- Julian Benjamin Cayanan
- Andrew Louis Dell'Aringa
- Ian Phillip Halim

