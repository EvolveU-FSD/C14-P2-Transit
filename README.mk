To start the app go to .env.template and change the "ENTER_PASSWORD_HERE" to the actual password.

command to import csv file into mongo atlas after downloading the mongo tools and adding to path:

mongoimport --uri "mongodb+srv://user:ENTER_PASSWORD@project.fnqowfy.mongodb.net/Transit" --collection COLLECTION_NAME --type csv --file FILE_NAME --headerline

to run "node server.js" or "npm start" 


to create a .env environment variable file copy the '.env.template' file and rename it to '.env' and change the password in the file to the actual password.