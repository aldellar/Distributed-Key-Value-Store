import express from 'express';
import {
  getAllData,
  setData,
  getValue,
  delValue,
} from '../RouteServices.js';

// const myId = process.env.NODE_IDENTIFIER; 
const router = new express.Router();

router.get('/', (req, res) => {
  console.log('recieved this request on node', process.env.NODE_IDENTIFIER);
  res.status(200).json(getAllData());
});

router.put('/:key', (req, res) => {
  const {key} = req.params;
  const {value} = req.body;
  console.log('Received type:', typeof value, 'value:', value);
  return res.status(setData(key, value) ? 200 : 201).send();
});

router.get('/:key', (req, res) => {
  const {key} = req.params;
  const value = getValue(key);
  if (!value) return res.sendStatus(404);
  return res.status(200).json({value});
});

router.delete('/:key', (req, res) => {
  const {key} = req.params;
  const deleted = delValue(key);
  return res.status(deleted ? 200 : 404).send();
});

export default router;
