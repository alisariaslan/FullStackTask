-- Create Auth Database
SELECT 'CREATE DATABASE AuthDb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'AuthDb')\gexec

-- Create Product Database
SELECT 'CREATE DATABASE ProductDb'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ProductDb')\gexec
