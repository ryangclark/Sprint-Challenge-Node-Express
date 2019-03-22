const express = require('express');

const db = require('../data/helpers/actionModel');
const projectsDB = require('../data/helpers/projectModel');

const router = express.Router();

function descriptionLengthChecker(req, res, next) {
  if (req.body.hasOwnProperty('description')){
    const description = req.body.description;
    if (typeof description !== 'string' || description.length > 128) {
      return res
        .status(400)
        .json({
          message:
            'The `description` property must be a string no longer than 128 characters in length.'
        });
    }
  }
  next();
}

router.use(descriptionLengthChecker);

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
      let validProjectID = false;
      const projects = await projectsDB.get();
      for (let project of projects) {
        if (project.id.toString() === req.body.project_id) {
          validProjectID = true;
        }
      }
      if (projects && !validProjectID) {
        res.status(404).json({
          message: `No project with ID of ${req.body.project_id} found.`
        });
      } else {
        const action = await db.insert(req.body);
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
  console.log('req.body: ');
  for (let key of Object.keys(req.body)) {
    if (['project_id', 'description', 'notes', 'completed'].includes(key)) {
      continue;
    } else {
      return res.status(400).json({
        message: `Actions can only include properties of 'completed', 'description', 'project_id', and 'notes'.`
      });
    }
  }
  try {
    let validProjectID = false;
    const projects = await projectsDB.get();
    for (let project of projects) {
      if (project.id.toString() === req.body.project_id) {
        validProjectID = true;
      }
    }
    if (projects && !validProjectID) {
      return res.status(404).json({
        message: `No project with ID of ${req.body.project_id} found.`
      });
    } else {
      const updatedAction = await db.update(req.params.id, req.body);
      if (!updatedAction) {
        return res.status(404).json({
          message: `An action with ID ${req.params.id} could not be found.`
        });
      } else {
        return res.status(201).json(updatedAction);
      }
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The request could not be completed.', error: error });
  }
});

module.exports = router;
