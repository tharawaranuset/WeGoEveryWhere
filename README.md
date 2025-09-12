# infra
root/db/init/backup.sql
root/.env
root/projects/backend/.env

# docker cli
docker-compose up --build
docker-compose up [SERVICE]
docker-compose down

# seed data (linux)
docker compose exec -T db psql -U admin -d WEGO_EVERYWHERE_DB < db/init/backup.sql

# check
docker exec -it wegoeverywhere-db-1 psql -U admin -d WEGO_EVERYWHERE_DB
\d