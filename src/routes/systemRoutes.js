import express from 'express';
import {setView} from '../RouteServices.js';

const router = new express.Router();

router.get('/ping', (req, res) => {
  res.status(200).send();
});

router.put('/view', (req, res) => {
  setView(req.body.view);
  res.status(200).send();
});

export default router;
