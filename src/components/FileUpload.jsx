"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Loader2, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export const FileUpload = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const fileList = new DataTransfer();
        acceptedFiles.forEach((file) => fileList.items.add(file));
        onFileUpload(fileList.files);
      }
      setDragActive(false);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
      "text/markdown": [".md"],
    },
    multiple: true,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        " border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-secondary/50",
        isDragActive || dragActive
          ? "border-primary bg-primary/5"
          : "border-upload-border"
      )}
    >
      <input {...getInputProps()} />
      <div className="p-8 text-center">
        <Upload
          className={cn(
            "mx-auto h-12 w-12 mb-4 transition-colors",
            isDragActive || dragActive
              ? "text-primary"
              : "text-muted-foreground"
          )}
        />
        <h3 className="text-lg font-semibold mb-2">
          {isDragActive || dragActive ? "Drop files here" : "Upload Documents"}
        </h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your files here, or click to browse
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Supports PDF, Word, TXT, and Markdown files
        </p>
        <Button disabled={isLoading}>
          {isLoading ? (
            <><Loader className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
          ) : (
            <><File className="h-4 w-4 mr-2" /> Choose Files</>
          )}
          
        </Button>
      </div>
    </Card>
  );
};
