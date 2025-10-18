import 'dotenv/config';
import express from 'express';

import { setupMongo } from './database';
import { routes } from './routes';
import cors from 'cors';

const app = express();
const port = 4000;

setupMongo()
    .then(() => {
        app.use(cors());
        app.use(express.json());
        app.use(routes);

        app.listen(port, () => {
            console.log(`🚀 Server started on port ${port}! 🖥️`);
        });
    })
    .catch((err) => {
        console.error(err.message);
    });
