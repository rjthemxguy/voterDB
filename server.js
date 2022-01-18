const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');


var cors = require('cors')


app.use(cors())

//	Connect Database
connectDB();
app.use(express.json({extended:false}));


app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/voters',require('./routes/voters'));



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));



