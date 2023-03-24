import express from 'express';
import { login, signup } from '../controllers/authController.mjs';
import { fileUpload } from '../controllers/imagesController.mjs';

const router = express.Router()

router.post("/login", login);
router.post("/signup", fileUpload, signup);

export { router as authRouter }