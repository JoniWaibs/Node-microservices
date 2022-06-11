const express = require('express');
const axios = require('axios');

const app = express();

const PORT = 4005;
const events = [];

app.use(express.json());

/**
 * Recover all historic events
 */
app.get('/events', (req, res) => res.status(200).json(events))

/**
 * POST events to the all services communication
 */
app.post('/events', (req, res) => {
  /**
   * Store each event received from all services!
   */
  events.push({...req.body});
  /**
   * POSTS micro-service
   */
  axios.post('http://posts-clusterip-srv:4000/events', {...req.body}).catch((err) => console.log(err.message));
  /**
   * COMMENTS micro-service
   */
  axios.post('http://comments-srv:4002/events', {...req.body}).catch((err) => console.log(err.message));
  /**
   * MODERATION micro-service
   */
  axios.post('http://moderation-srv:4003/events', {...req.body}).catch((err) => console.log(err.message));
  /**
   * QUERY micro-service
   */
  axios.post('http://query-srv:4004/events', {...req.body}).catch((err) => console.log(err.message));

  res.json({message: 'EVENT OK'});
});

app.listen(PORT, () => console.log(`API V1 - Server is listening on ${PORT}`));