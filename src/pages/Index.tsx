import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DebateArena from "@/components/DebateArena";
import KnowledgeBase from "@/components/KnowledgeBase";
import { Brain, MessageSquare, Database } from "lucide-react";

const Index = () => {
  const [topic, setTopic] = useState("");
  const [debateStarted, setDebateStarted] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");

  const handleStartDebate = () => {
    if (topic.trim()) {
      setDebateStarted(true);
      setActiveTab("debate");
    }
  };

  const handleReset = () => {
    setDebateStarted(false);
    setTopic("");
    setActiveTab("setup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Thought Weaver
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            RAG-Powered Multi-Agent Debate System
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="setup" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <Database className="w-4 h-4" />
              Knowledge
            </TabsTrigger>
            <TabsTrigger value="debate" disabled={!debateStarted} className="gap-2">
              <Brain className="w-4 h-4" />
              Debate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Configure Debate Topic</CardTitle>
                <CardDescription>
                  Enter a topic for the AI agents to debate. Three personas (Engineer, Visionary, Ethicist) will discuss it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Debate Topic</label>
                  <Textarea
                    placeholder="e.g., Should AI agents have voting rights in digital democracies?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  onClick={handleStartDebate} 
                  className="w-full"
                  size="lg"
                  disabled={!topic.trim()}
                >
                  Start Debate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeBase />
          </TabsContent>

          <TabsContent value="debate">
            {debateStarted && (
              <DebateArena topic={topic} onReset={handleReset} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
