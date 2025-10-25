import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const stored = localStorage.getItem("knowledgeBase");
    if (stored) {
      setDocuments(JSON.parse(stored));
    }
  };

  const saveDocuments = (docs: Document[]) => {
    localStorage.setItem("knowledgeBase", JSON.stringify(docs));
    setDocuments(docs);
  };

  const addDocument = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    saveDocuments([...documents, newDoc]);
    setTitle("");
    setContent("");
    
    toast({
      title: "Document Added",
      description: "Knowledge base updated successfully",
    });
  };

  const deleteDocument = (id: string) => {
    saveDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "Removed from knowledge base",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Knowledge Document</CardTitle>
          <CardDescription>
            Add documents that agents will reference during debates (simulated RAG retrieval)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Title</label>
            <Input
              placeholder="e.g., AI Ethics Guidelines 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Content</label>
            <Textarea
              placeholder="Enter the document content that will be used as context..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <Button onClick={addDocument} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Knowledge Base</h3>
          <Badge variant="secondary">{documents.length} documents</Badge>
        </div>

        {documents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents yet. Add your first document above.</p>
            </CardContent>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                    <CardDescription>
                      Added {new Date(doc.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {doc.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
