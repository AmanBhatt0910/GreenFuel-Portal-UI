import React from 'react';

interface Comment {
  author: string;
  timestamp: string;
  text: string;
}

interface CommentItemProps {
  comment: Comment;
  formatDate: (dateString: string) => string;
}

const Avatar: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={className}>{children}</div>
);

const AvatarFallback: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={className}>{children}</div>
);

const CommentItem: React.FC<CommentItemProps> = React.memo(
  ({ comment, formatDate }) => {
    return (
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3 border-2 border-blue-200 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
              {comment.author.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-indigo-900">{comment.author}</p>
            <p className="text-xs text-indigo-600">{formatDate(comment.timestamp)}</p>
          </div>
        </div>
        <p className="whitespace-pre-line text-gray-700 bg-white p-3 rounded-md border border-blue-100 shadow-sm">
          {comment.text}
        </p>
      </div>
    );
  }
);

export default CommentItem;
