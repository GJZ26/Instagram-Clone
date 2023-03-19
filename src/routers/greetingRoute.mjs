import express from 'express';
import { sayHello } from '../controllers/greetingController.mjs';

const router = express.Router();

router.get('/',sayHello);

export { router as greetingRouter }