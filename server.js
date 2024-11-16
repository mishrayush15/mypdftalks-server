const express = require('express');
const app = express();
const cors = require('cors');
const indexRouter = require('./routes/index')
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, 
    console.log('Connected to database')
)

app.use('/api/v1', indexRouter);


app.listen(3000 || PORT, ()=>{
    console.log(`Server running`);
})
