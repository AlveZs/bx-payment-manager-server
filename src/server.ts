import express from 'express'
import { routes } from './routes'
import cors from 'cors'
import { allowedOrigins } from './config/AllowedOrigins';
import { credentials } from './middlewares/Credentials';
import cookieParser = require('cookie-parser');

const app = express();

app.use(credentials);

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin || '') !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(3333, () => {
  console.log('HTTP server running!');
});