#!/bin/bash
if [ "$1" == "bdd" ]; then
    docker-compose down -v
    docker volume prune -f
elif [ "$1" == "all" ]; then
    docker-compose down -v
    docker volume prune -f
    rm -rf node_modules
    # Ajoutez d'autres nettoyages si nécessaire
else
    echo "Usage: ./clean.sh [bdd|all]"
fi
