CREATE DATABASE tandb_auth_db;

CREATE USER postgres_app_tandb_auth WITH PASSWORD 'postgres_password';

GRANT ALL PRIVILEGES ON DATABASE "tandb_auth_db" to postgres_app_tandb_auth;
