#!/bin/bash

# MySQL Connection Details
HOST="blu3qahxctqrn6lbcqeg-mysql.services.clever-cloud.com"
PORT="3306"
DB="blu3qahxctqrn6lbcqeg"
USER="uxb88lq5utdn5nkr"
PASSWORD="9CwrDnfgwqXFsGPwIEZL"

echo "Importing database schema..."
mysql -h $HOST -P $PORT -u $USER -p$PASSWORD $DB < database/schema.sql

echo "Importing sample data..."
mysql -h $HOST -P $PORT -u $USER -p$PASSWORD $DB < database/seed_sample_data.sql

echo "Database import completed!"
echo "Verifying tables..."
mysql -h $HOST -P $PORT -u $USER -p$PASSWORD $DB -e "SHOW TABLES;"
