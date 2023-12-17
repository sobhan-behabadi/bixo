const express = require('express');
const app = express();
const router = require('./src/routes/index');


require('./startup/config')(app, express);
require('./startup/db')();
require('./startup/logging')();


app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(2000, () => console.log(`listening on port ${port}`));



