const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = 4002;
const DEFAULT_COMMENT_STATUS = 'pending';
let commentsByPostId = [];

app.use(cors());
app.use(express.json());

/**
 * Retrieves a comment by postId
 */
app.get('/posts/:id/comments', (req, res) => {
  if(!req.params.id) {
    res.status(412).json({message: 'Error, PostID is missing'});
  }
  const comments = commentsByPostId.filter(comment => comment.postId === req.params.id);
  res.status(200).send(comments);
});

/**
 * Create comment by postId
 */
app.post('/posts/:id/comments', async (req, res) => {
  if(!req.params.id) {
    res.status(412).json({message: 'Error, PostID is missing'});
  }

  if(!Object.keys(req.body).length) {
    res.status(412).json({message: 'Error, you must send a new comment data'});
  }

  const id = randomBytes(4).toString('hex');
  const newComment = { id, postId: req.params.id, status: DEFAULT_COMMENT_STATUS, ...req.body };

  try {
    /**
     * Post event to event-bus
     */
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentCreated',
      ...newComment
    })

    commentsByPostId = [...commentsByPostId , newComment];
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error)
  }
});

/**
 * Live listening events from event-bus
 */
app.post('/events', async (req, res) => {
  const { type, ...data} = req.body;
  console.log({info: `Comments service. Event type: ${type} was received`});

  if(type === 'CommentModerated') {
    const { id, status, ...commentInfo } = data;
    const comment = commentsByPostId.find(comment => comment.id === id);
    // Update status comment whit comment moderated status
    comment.status = status;

    try {
      /**
       * Post event to event-bus
       */
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        ...{ id, status, ...commentInfo }
      })

      res.status(200).json({});
    } catch (error) {
      console.log(error);
    }
  }
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));