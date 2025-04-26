import React from 'react';
import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import { Comment } from '../../type';


interface CommentsListProps {
  comments: Comment[];
  formatDate: (dateString: string) => string;
}

const CommentsList: React.FC<CommentsListProps> = React.memo(
  ({ comments, formatDate }) => {
    if (comments.length === 0) {
      return (
        <div className="text-center py-12 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <MessageSquare className="h-14 w-14 text-blue-300 mx-auto mb-3 opacity-60" />
          <p className="text-indigo-700 font-medium">No comments yet</p>
          <p className="text-indigo-500 text-sm mt-1 max-w-md mx-auto">
            Be the first to leave a comment on this request
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            formatDate={formatDate}
          />
        ))}
      </div>
    );
  }
);

export default CommentsList;
