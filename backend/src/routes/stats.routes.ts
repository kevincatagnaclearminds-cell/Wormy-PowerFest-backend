import { Router } from 'express';
import { RegistrationController } from '../controllers/registration.controller';

const router = Router();
const controller = new RegistrationController();

router.get('/', (req, res) => controller.getStats(req, res));

export default router;
