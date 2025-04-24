/*
 * Based on code from David C. Harrison from CSE 186
 */
import express from 'express';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'node:path';
import OpenApiValidator from 'express-openapi-validator';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import * as data from './data.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

app.use((err, req, res, next) => {
  res.status(err.status > 400 && err.status < 500 ? 400 : err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status > 400 && err.status < 500 ? 400 : err.status,
  });
});

app.get('/ping', data.ping);
app.put('/data/:key', data.put);
app.get('/data/:key', data.getById);
app.delete('/data/:key', data.remove);
app.get('/data', data.get);
app.put('/view', data.setView);

app.listen(8081, () => {
  console.log('CSE138 Assignment 1 Server Running');
  console.log('Swagger UI: http://localhost:8081/docs');
});
