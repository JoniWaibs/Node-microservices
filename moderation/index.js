const express = require('express');
const axios = require('axios');

const app = express();

const PORT = 4003;
const REJECTED_COMMENT_STATUS = 'rejected';
const APPROVED_COMMENT_STATUS = 'approved';
const BLACK_WORDS_LIST = ['orange'];

app.use(express.json());

/**
 * Live listening (CommentCreated) event from event-bus
 * AND
 * Create a new response schema with moderated comments
 * Then, send it to event-bus and the other services will update this
 */
app.post('/events', async (req, res) => {
  const { type, ...data} = req.body;
  console.log({info: `Moderation service. Event type: ${type} was received`});

  if(type === 'CommentCreated') {
    const { status, content, ...commentInfo } = data;
    const moderatedCommentStatus = BLACK_WORDS_LIST.includes(content) ? REJECTED_COMMENT_STATUS : APPROVED_COMMENT_STATUS;

    try {
      /**
       * Post event to event-bus
       */
      await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentModerated',
        ...{ status: moderatedCommentStatus, content, ...commentInfo }
      })

      res.status(200).json({});
    } catch (error) {
      console.log(error);
    }
  }
});

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));