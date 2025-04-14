import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import { Comment } from '@/app/dashboard/approvals/components/interfaces';

interface ChatSectionProps {
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  isChatLoading: boolean;
  comments: Comment[];
}

// Format date to a more readable format
const formatDate = (timestamp: string | number | Date) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ChatSection({
  newComment,
  setNewComment,
  isChatLoading,
  comments,
  handleAddComment
}: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (isChatLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
          Comments
        </CardTitle>
        <CardDescription>
          Add comments and communicate about this approval request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat History Messages */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-1 mb-4 border rounded-lg bg-gray-50">
          {comments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No comments yet. Be the first to add a comment.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-indigo-600 text-white">
                    {comment.userInitials || comment.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.userRole || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <div className="bg-white rounded-lg p-3 border shadow-sm">
                    <p className="text-sm whitespace-pre-line">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div>
          <div className="flex gap-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px] flex-1"
              onKeyDown={handleKeyDown}
            />
            <Button 
              className="self-end bg-indigo-600 hover:bg-indigo-700"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              <span>Send</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Ctrl+Enter to send
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 