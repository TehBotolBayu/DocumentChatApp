'use client'
import { Card } from "@/components/ui/card";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  const [time, setTime] = useState(null);

  useEffect(() => {
    if(typeof message?.created_at === 'string') {
      setTime(new Date(message.created_at));
    } else {
      setTime(message.created_at);
    }
  }, [message]);
  
  return (
    <div className={cn("flex gap-3 ", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8  rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "rounded-2xl px-4 py-3 max-w-[80%] ",
        isUser 
            ? "bg-chat-bubble-user text-primaryDark " 
          : "bg-chat-bubble-ai text-white"
      )}>
        <div className="whitespace-pre-wrap markdown">
           {(isUser) ? message.message : 
           <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.message}</ReactMarkdown>
           }
        </div>
        <p className={cn(
          "text-xs mt-1 opacity-70",  
          isUser ? "text-primaryDark" : "text-muted-foreground"
        )}>
          {time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};