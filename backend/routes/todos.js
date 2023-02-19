const winston = require("winston");
const auth = require("../middleware/auth");
const { Todo } = require("../models/todo");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();


// route to the main page and view all todos.
// can be tested even with postman
router.get("/", auth, async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    const filteredTodos = todos.filter(todo => todo.uid === req.user._id);
    res.send(filteredTodos);
  } catch (error) {
    res.status(500).send("Error: " + error.message);

    winston.error(error.message);
  }
});// jumanne changes usiku.

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post("/", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(200).required(),
    author: Joi.string().min(3),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    priority: Joi.boolean(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { name, author, isComplete, date, uid } = req.body;

  let todo = new Todo({ name, author, isComplete, date, uid });

  todo = await todo.save();
  res.send(todo);
});


// route to update todo item
router.put("/:id", auth, async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    author: Joi.string().min(3),
    uid: Joi.string(),
    isComplete: Joi.boolean(),
    date: Joi.date(),
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(result.error.details[0].message);

  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).send("Todo not found...");

  if (todo.uid !== req.user._id)
    return res.status(401).send("Todo update failed. Not authorized...");

  const { name, author, isComplete, date, uid } = req.body;
  
  // updating values of todo item
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { name, author, isComplete, date, uid },
    { new: true }
  );

  res.send(updatedTodo);
});


// function to update todo status by checking and uncheking it
router.patch("/:id", auth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).send("Todo not found...");

  if (todo.uid !== req.user._id)
    return res.status(401).send("Todo check/uncheck failed. Not authorized...");

  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    {
      isComplete: !todo.isComplete,
    },
    {
      new: true,
    }
  );

  res.send(updatedTodo);
});


// delete todo functionality
router.delete("/:id", auth, async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) return res.status(404).send("Todo not found...");

  if (todo.uid !== req.user._id)
    return res.status(401).send("Todo deletion failed. Not authorized...");

  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);

  res.send(deletedTodo);
});
// last changes wedn jioni
// by @ athumani & mussa




module.exports = router;
