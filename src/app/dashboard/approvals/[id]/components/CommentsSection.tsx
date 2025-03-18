import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Comment } from '@/app/dashboard/approvals/components/interfaces';

interface CommentsSectionProps {
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  handleAddComment: () => void;
  loading: boolean;
}

export default function CommentsSection({
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  loading
}: CommentsSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Chat History</CardTitle>
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
        <CardTitle className="text-xl">Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat Input */}
        <div className="mb-6">
          <div className="flex gap-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[80px] flex-1"
              onKeyDown={handleKeyDown}
            />
            <Button 
              className="self-end"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Ctrl+Enter to send
          </p>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No messages yet. Start the conversation!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.userRole}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 