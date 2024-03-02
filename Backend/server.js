const express = require('express');
const { Client } = require('pg');
const cors=require("cors");


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'root123',
    database: 'zithara'
});

app.get('/api/customerData', (req, res) => {
    client.query(`SELECT * FROM customer_data`, (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
