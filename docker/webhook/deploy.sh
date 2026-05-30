#!/bin/sh
echo "🚀 Début du déploiement automatique..."
cd /volume1/docker/blaireaudor

git config --global --add safe.directory /volume1/docker/blaireaudor

git pull origin main
docker compose -f compose.prod.yaml up -d --build back front proxy
echo "✅ Déploiement terminé avec succès !"