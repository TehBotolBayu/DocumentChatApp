"use client";
import { DocumentList } from "@/components/DocumentList";
import { FileUpload } from "@/components/FileUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, MessageSquare, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    async function loadChatbots() {
      const chatbots = await fetchChatbots();
      setDocuments(chatbots);
    }
    loadChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      const response = await fetch("/api/chatbot", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch chatbots");
      }
  
      const data = await response.json();
      return data; // array of chatbots
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      return [];
    }
  }

  const handleFileUpload = async (files) => {
    setIsUploading(true);
  
    const file = files[0];
    const newDoc = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      type: file.name.split(".").pop() || "unknown",
    };
  
    try {
      // 1. Extract text from PDF via OCR API
      const formData = new FormData();
      formData.append("file", file);
  
      const ocrResponse = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
  
      if (!ocrResponse.ok) {
        throw new Error("Failed to extract text");
      }
  
      const { text } = await ocrResponse.json();

      const namespaceId = uuidv4();
  
      // 2. Send extracted text to Pinecone vector service
      const pineconeResponse = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          content: text,
          namespace: namespaceId, // or dynamic
        }),
      });
  
      if (!pineconeResponse.ok) {
        throw new Error("Failed to store vectors in Pinecone");
      }
  
      const pineconeData = await pineconeResponse.json();
      console.log("Pinecone upsert result:", pineconeData);
  
      // 3. Create metadata document in Supabase
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: namespaceId,
          name: newDoc.name,
          description: newDoc.size,
          system_prompt: "",
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData.error || "Unknown error");
        return;
      }
  
      const data = await response.json();
      console.log("Chatbot created:", data);
  
      // Update UI
      setDocuments((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Upload error:", error);
    }
  
    setIsUploading(false);
  };
  

  const handleDocumentClick = (doc) => {
    router.push(`/chat/${doc.id}`, { state: { document: doc } });
  };
  return (
    <div className="min-h-screen background-noise">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-6xl font-bold bg-white bg-clip-text text-transparent mt-12">
              Document Chat AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your documents and chat with AI to get insights, summaries,
            and answers based on your content.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="border-upload-border blurglass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Document
              </CardTitle>
              <CardDescription>
                Upload PDF, Word, or text files to start chatting with AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />
            </CardContent>
          </Card>

          <Card className="blurglass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Documents ({documents.length})
              </CardTitle>
              <CardDescription>
                Click on any document to start a conversation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList
                documents={documents}
                onDocumentClick={handleDocumentClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
