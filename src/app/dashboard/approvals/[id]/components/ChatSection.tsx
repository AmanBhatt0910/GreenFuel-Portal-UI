import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquarePlus } from "lucide-react";
import { ChatRoom, ChatMessage, Comment } from '@/app/dashboard/approvals/components/interfaces';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatSectionProps {
  chatRoom: ChatRoom | null;
  chatMessages: ChatMessage[];
  newComment: string;
  setNewComment: (comment: string) => void;
  handleStartChat: () => Promise<void>;
  handleSendMessage: () => Promise<void>;
  isChatLoading: boolean;
  currentUserId?: number;
  comments: Comment[];
  handleAddComment: () => void;
}

export default function ChatSection({
  chatMessages,
  newComment,
  setNewComment,
  handleSendMessage,
  isChatLoading,
  comments,
  handleAddComment
}: ChatSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatTab, setChatTab] = React.useState<string>("history");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      if (chatTab === "history") {
        handleAddComment();
      } else {
        handleSendMessage();
      }
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

  // Mock user data for demonstration
  const users = {
    1: { name: "You (Approver)", designation: "Finance Manager" },
    2: { name: "John Smith", designation: "Requester" }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Chat</CardTitle>
        <CardDescription>Communicate with the requester about this approval</CardDescription>
      </CardHeader>
      <CardContent>
       
          
          {/* Chat History Tab */}
          <Card className="mt-4">
            {/* Message Input */}
            <div className="mb-6">
              <div className="flex gap-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment to the chat history..."
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
            
            {/* Chat History Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No chat history yet. Add the first comment!</p>
                </div>
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
          </Card>
      </CardContent>
    </Card>
  );
} 