import { AppDataSource } from "./data-source"
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import { routes } from './routes';

AppDataSource.initialize().then(async () => {

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
      credentials: true
  }));

  routes(app);

  app.listen(8000, () => {
      console.log('Listening to port 8000');
  })
  
}).catch(error => console.log(error))



