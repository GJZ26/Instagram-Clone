import express from 'express';
import { sayHello } from '../services/greetingServices.mjs';

const router = express.Router();

router.get('/',sayHello);

export { router as greetingRouter }