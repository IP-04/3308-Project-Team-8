#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://users_db_l5qz_user:rr5a32wwfUFM8lfzh7bn9vQ5hd79nsdP@dpg-csvplfhu0jms738b8sbg-a.oregon-postgres.render.com/users_db_l5qz"

# Execute each .sql file in the directory
for file in src/init_data/03_update.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done
