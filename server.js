const express = require('express');
const mongodb = require('./data/database.js');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

mongodb.initDb()
    .then(() => {
        app.use('/', require('./routes'));

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
