import express from 'express';
import {
  getAllData,
  setData,
  getValue,
  delValue,
} from '../RouteServices.js';

// const myId = process.env.NODE_IDENTIFIER; 
const router = new express.Router();

//Julian
router.get('/', async (req, res) => {
  const result = await getAllData();
  if (result.data) res.status(200).json(result.data);
  else res.status(result.status).send();
});

//Andrew
router.put('/:key', async (req, res) => {
  const {key} = req.params;
  const {value} = req.body;
  const isReplication = req.headers['x-replication'] === 'true';
  const result = await setData(key, value, isReplication);
  return res.status(result).send();
});

//Andrew
router.get('/:key', async (req, res) => {
  const {key} = req.params;
  const result = await getValue(key);
  if (result.data) {
    const value = result.data;
    res.status(200).json({value});
  }
  else res.status(result.status).send();
});

//Julian
router.delete('/:key', async (req, res) => {
  const {key} = req.params;
  const isReplication = req.headers['x-replication'] === 'true';
  const deleted = await delValue(key, isReplication);
  return res.status(deleted).send();
});

export default router;
