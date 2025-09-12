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

#To know for merge
- Event api for create, update , delete in backend/src/modules/event
- Update User api in backend/src/modules/users
- arrange user file into user folder
- add Index.ts (backend\src\database\schema\index.ts)
- add Status into event schema
