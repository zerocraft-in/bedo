
import { Router } from 'express';
const router = Router();

router.post('/register', async (_req,res)=>{
  res.json({message:'register endpoint'});
});

router.post('/login', async (_req,res)=>{
  res.json({message:'login endpoint'});
});

export default router;
