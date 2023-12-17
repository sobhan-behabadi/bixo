const cors = require("cors");
const swaggerjsdoc = require('swagger-jsdoc');
const swagger = require('swagger-ui-express');
const url = require("url");

module.exports = function (app, express) {

    const options = {
        definition: {
            openapi: '3.0.0',
            servers: [
                {
                    url: "http://localhost:2000/api"
                }
            ],
            info: {
                title: 'bixo',
                version: '1.0.0',
                contact: {
                    name: 'Sobhan Behabadi',
                    url: 'sobhanbehabadi.ir',
                    email: 'sobhan.behabadi@yahoo.com'
                }
            },
        },
        apis: ['./src/routes/user/*.js'], // files containing annotations as above
    };
    const spec = swaggerjsdoc(options);
    app.use("/api-docs", swagger.serve, swagger.setup(spec))
    app.use(cors());
    app.use(express.json({limit: "30mb"}));
    app.use(express.urlencoded({extended: true}));
    app.use(express.static('public'));


}