const express = require('express');

const db = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const actions = await db.get();
    res.status(200).json(actions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const action = await db.get(req.params.id);
    if (!action) {
      res.status(404).json({
        message: `An action with ID ${req.params.id} could not be found.`
      });
    } else {
      res.status(200).json(action);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.post('/', async (req, res) => {
  try {
    if (
      !req.body.hasOwnProperty('description') ||
      !req.body.hasOwnProperty('notes') ||
      !req.body.hasOwnProperty('project_id')
    ) {
      res.status(400).json({
        message:
          'Please provide `description`, `notes`, and `project_id` properties in your request body.'
      });
    } else {
      const action = await db.insert(req.body);
      // TODO: Need to test how this handles a req with a bad `project_id`
      if (!action) {
        res.status(404).json({
          message: `No project with ID of ${req.body.project_id} found.`
        });
      } else {
        res.status(201).json(action);
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const action = await db.remove(req.params.id);
    if (!action) {
      res.status(404).json({
        message: `An action with ID ${req.params.id} could not be found.`
      });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.put('/:id', async (req, res) => {
  for (let key of req.body.keys()) {
    if (['project_id', 'description', 'notes', 'completed'].includes(key)) {
      continue;
    } else {
      res.status(400).json({
        message: `Actions can only include properties 
          of 'description', 'project_id', and 'notes'.`
      });
    }
  }
  try {
    const updatedAction = await db.update(req.params.id, req.body);
    if (!updatedAction) {
      res
        .status(404)
        .json({
          message: `An action with ID ${req.params.id} could not be found.`
        });
    } else {
      res.status(201).json(updatedAction);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});
