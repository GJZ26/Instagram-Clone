import express from 'express';
import { login, signup } from '../controllers/authController.mjs';
import { uploadAvatar } from '../middlewares/avatarUploader.mjs';

const router = express.Router()

router.post("/login", login);
router.post("/signup", uploadAvatar.single("avatar"), signup);

export { router as authRouter }