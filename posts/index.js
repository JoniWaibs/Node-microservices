const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = 4000;
let posts = [];

app.use(cors());
app.use(express.json());

/**
 * Retrieves all posts - Unused
 */
app.get('/posts', (req, res) => res.status(200).json(posts));

/**
 * Create new post
 */
app.post('/posts/create', async (req, res) => {
  if(!Object.keys(req.body).length) {
    res.status(412).json({ message: 'Error, you must send a new post data' });
  }

  const id = randomBytes(4).toString('hex');
  const newPost = { id, ...req.body };
  try {
    /**
     * Post event to event-bus
     */
    await axios.post('http://event-bus-srv:4005/events', { type: 'PostCreated', ...newPost })

    posts = [...posts, newPost];
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error)
  }
})

/**
 * Live listening events from event-bus
 */
app.post('/events', (req, res) => {
  console.log({ info: `Posts service. Event type: ${req.body.type} was received` });

  res.status(200).json({});
})

app.listen(PORT, () => console.log(`API V1 - Server is listening on ${PORT}`));