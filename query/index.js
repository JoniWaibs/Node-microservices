const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = 4004;
let posts = [];

app.use(cors());
app.use(express.json());

/**
 * HELPERS
 */
const handleEvents = (type, data) => {
  console.log({info: `Query service. Event type: ${type} was received`});

  if(type === 'PostCreated') {
    const { id, title } = data;

    const newPost = { id, title, comments: [] };
    posts = [...posts, newPost];
  }

  if(type === 'CommentCreated') {
    const { id, postId, content, status } = data;
    posts.forEach(post => post.id === postId ? post.comments.push({ id, content, status}) : post.comments);
  }

  if(type === 'CommentUpdated') {
    const { id, postId, content, status } = data;
    const post = posts.find(post => post.id === postId);
    const comment = post.comments.find(comment => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
}

/**
 * Retrieves final posts schema (with comments)
 */
app.get('/posts', (req, res) => res.status(200).json(posts));

/**
 * Live listening events from event-bus
 * AND
 * Create a new response schema with merged data (comments into the posts);
 */
app.post('/events', (req, res) => {
  const { type, ...data} = req.body;

  handleEvents(type, data);

  res.status(200).json({});
});

/**
 * Listening all events from event-bus posted
 * And immediately updates all posts and comments schema
 */
app.listen(PORT, async () => {
  console.log(`Server is listening on ${PORT}`);

  const { data: eventsData } = await axios.get('http://event-bus-srv:4005/events');

  eventsData.forEach(({ type, ...data}) => handleEvents(type, data));
});