'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/general/date";
import { FileText, MessageSquare, Calendar, HardDrive } from "lucide-react";

const getFileIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📄';
    case 'md':
      return '📋';
    default:
      return '📁';
  }
};

export const DocumentList = ({ documents, onDocumentClick }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No documents uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-1">Upload a document to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4 hover:bg-primary/50 hover:shadow-lg transition-all cursor-pointer" onClick={() => onDocumentClick(doc)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="text-2xl">{getFileIcon(doc.name.split(".").pop() || "unknown")}</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ellipsis">{doc.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {doc.description}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(doc.created_at)}
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};