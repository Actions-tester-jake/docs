#!/bin/bash

# Path to your Docker Compose file
COMPOSE_URL="https://raw.githubusercontent.com/redpanda-data/redpanda-labs/main/docker-compose/three-brokers/docker-compose.yml"

# Local path to save the downloaded Docker Compose file
COMPOSE_FILE="./docker-compose.yml"

# Download Docker Compose file
echo "Downloading Docker Compose file..."
curl -o "$COMPOSE_FILE" "$COMPOSE_URL" || wget -O "$COMPOSE_FILE" "$COMPOSE_URL"

# Check if download was successful
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Failed to download Docker Compose file."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Deploy Docker Compose
echo "Deploying Docker Compose..."
docker-compose -f "$COMPOSE_FILE" up -d

# Check deployment status
if [ $? -eq 0 ]; then
    echo "Docker Compose deployed successfully."
else
    echo "Failed to deploy Docker Compose."
    exit 1
fi
