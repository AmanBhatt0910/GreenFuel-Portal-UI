import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useState } from "react";

interface CommentInputProps {
  onAddComment: (text: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = React.memo(
  ({ onAddComment }) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
    };

    const handleSubmit = () => {
      if (inputValue.trim()) {
        onAddComment(inputValue);
        setInputValue("");
      }
    };

    return (
      <div className="w-full space-y-3">
        <Textarea
          placeholder="Add your comment..."
          value={inputValue}
          onChange={handleChange}
          className="resize-none border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg min-h-[100px] shadow-sm bg-indigo-50/30"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white flex items-center transition-all duration-300 rounded-lg shadow-md hover:shadow-lg"
          >
            <Send className="h-4 w-4 mr-2" /> Add Comment
          </Button>
        </div>
      </div>
    );
  }
);

export default CommentInput;
