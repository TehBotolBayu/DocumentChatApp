'use client'
import { Card } from "@/components/ui/card";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  
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
          ? "bg-chat-bubble-user text-primary-foreground" 
          : "bg-chat-bubble-ai text-foreground"
      )}>
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={cn(
          "text-xs mt-1 opacity-70",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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