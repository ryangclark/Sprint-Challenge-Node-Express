const express = require('express');

const db = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const projects = await db.get();
    for (let project of projects) {
      if (project.id.toString() === req.params.id) {
        res.status(200).json(project);
      }
    }
    if (projects) {
      return res.status(404).json({
        message: `No project with ID of ${req.params.id} found.`
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const project = await db.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: `An action with ID ${req.params.id} could not be found.`
      });
    } else {
      res.status(200).json(project.actions);
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
      !req.body.hasOwnProperty('name')
    ) {
      res.status(400).json({
        message:
          'Please provide `description` and `name` properties in your request body.'
      });
    } else {
      const project = await db.insert(req.body);
      if (project) {
        res.status(201).json(project);
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
    const project = await db.remove(req.params.id);
    if (!project) {
      res.status(404).json({
        message: `A project with ID ${req.params.id} could not be found.`
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
    if (['description', 'name', 'completed'].includes(key)) {
      continue;
    } else {
      res.status(400).json({
        message: `Projects can only include properties 
          of 'completed', 'description', and 'name'.`
      });
    }
  }
  try {
    const updatedProject = await db.update(req.params.id, req.body);
    if (!updatedProject) {
      res
        .status(404)
        .json({
          message: `A project with ID ${req.params.id} could not be found.`
        });
    } else {
      res.status(201).json(updatedProject);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

module.exports = router;