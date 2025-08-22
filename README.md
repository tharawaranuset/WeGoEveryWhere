# infra
root/db/init/backup.sql
root/.env
root/projects/backend/.env

# docker cli
docker-compose up --build
docker-compose up [SERVICE]
docker-compose down

# seed data
docker exec -it wegoeverywhere-db-1 psql -U myuser -d mydatabase
docker compose exec -T db psql -U myuser -d mydatabase < db/init/backup.sql