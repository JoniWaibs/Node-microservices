import React from "react";
import { statusContent } from './enums/statusContent';

const { APPROVED, REJECTED, PENDING } = statusContent;

const CommentList = ({ comments }) => (
  <ul>
    {comments.map((comment) => {
      const { id, status, content } = comment;

      const contentByStatus = {
        [APPROVED]: content,
        [REJECTED]: 'This content has been rejected',
        [PENDING]: 'This content is awaiting moderation',
        default: ''
      }

      return <li key={id}>{contentByStatus[status] || contentByStatus.default}</li>
    })}
  </ul>
);

export default CommentList;
