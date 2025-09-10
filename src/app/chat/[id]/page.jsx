"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { ArrowLeft, Send, FileText } from "lucide-react";
import { useParams } from "next/navigation";
import { getChatHistory } from "@/services/chat.service";
import { useRouter } from "next/navigation";

const Chat = () => {
  const params = useParams();
  const documentId = params.id;
  const router = useRouter();
  const [documents, setDocuments] = useState([]);

  const [messages, setMessages] = useState([]);
  const [document, setDocument] = useState(null);
  const [promptMessage, setPromptMessage] = useState();
  const [fetchStatus, setFetchStatus] = useState("loading");

  useEffect(() => {
    initChatData();
  }, []);

  const initChatData = async () => {
    const chatbotresponse = await fetch("/api/chatbot/" + documentId);
    const chatbotdata = await chatbotresponse.json();
    if (chatbotresponse) {
      console.log("chatbotresponse");
      console.log(chatbotdata);
      setDocument(chatbotdata);
    } else {
      console.log("error when getting chatbot");
      setFetchStatus("error");
    }

    try {
      const response = await fetch("/api/conversations/" + documentId);
      const conversationdata = await response.json();

      if (response) {
        console.log(conversationdata);
        buildChatMessage(conversationdata);
        setFetchStatus("success");
      } else {
        console.log("error when getting chat history");
        setFetchStatus("error");
      }
    } catch (error) {
      console.log("error when getting chat history");
      setFetchStatus("error");
    }
  };

  const buildChatMessage = (data) => {
    // map the response to {type, content}
    setMessages(data);
    // setPromptMessage();
  };

  // useEffect(() => {
  //   const document = documents.find((doc) => doc.id === documentId);
  //   setDocument(document);
  //   setMessages([
  //     {
  //       id: "1",
  //       content: `Hi! I've analyzed your document "${
  //         document?.name || "uploaded file"
  //       }". I can help you understand its content, answer questions, or provide summaries. What would you like to know?`,
  //       sender: "ai",
  //       timestamp: new Date(),
  //     },
  //   ]);
  // }, [documentId]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
  
    if(messages.length > 0) {
      setMessages((prev) => [...prev, userMessage]);
    } else {
      setMessages([userMessage]);
    }
    setInputMessage("");
    setIsLoading(true);
  
    try {
      // 1. Query Pinecone
      const queryResponse = await fetch("/api/document/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          namespace: documentId,
          topK: 5,
        }),
      });
      const queryData = await queryResponse.json();
  
      // 2. Get AI response
      const aiResponseRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serialized: [...messages, userMessage].map((m) => ({
            type: m.sender === "user" ? "human" : "ai",
            content: m.content,
          })),
          message: userMessage.content,
          index: documentId,
          retrievedDocs: queryData.matches || [], // 👈 ADD THIS
        }),
      });
  
      const aiData = await aiResponseRes.json();
  
      if (aiData?.message) {
        const aiMessage = {
          id: Date.now().toString() + "-ai",
          content: aiData.message,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]); // ✅ correct
      }
    } catch (error) {
      console.error("Error in chat flow:", error);
    }
  
    setIsLoading(false);
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (fetchStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-primary">Document not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go back to documents
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      {fetchStatus === "loading" || !document ? (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
          <div className="text-primary">Loading...</div>
        </div>
      ) : (
        <div className="aasd min-h-screen bg-gradient-subtle flex flex-col">
          {/* Header */}
          <header className=" border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 text-primary">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <h1 className="font-semibold">{document.name}</h1>
                    <p className="text-sm text-muted-foreground">
                      {document.size} • Uploaded {document.uploadDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
            {messages.length > 0 && (
              <div className="space-y-6">
                {messages?.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-chat-bubble-ai rounded-2xl px-4 py-3 max-w-[80%]">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0">
            <div className="container mx-auto px-4 py-4 max-w-4xl">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about your document..."
                  className="flex-1 bg-primary-input text-white"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="gap-2 bg-primary cursor-pointer text-white"
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
