import { Router } from 'express';
import { VerificationController } from '../controllers/verification.controller';

const router = Router();
const controller = new VerificationController();

router.post('/', (req, res) => controller.verify(req, res));

export default router;
