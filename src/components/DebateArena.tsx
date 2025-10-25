import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Download } from "lucide-react";
import AgentMessage from "./AgentMessage";
import KnowledgeGraph from "./KnowledgeGraph";
import { simulateDebate } from "@/lib/debateSimulator";

interface DebateArenaProps {
  topic: string;
  onReset: () => void;
}

const DebateArena = ({ topic, onReset }: DebateArenaProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(2);
  const [summary, setSummary] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    startDebate();
  }, []);

  const startDebate = async () => {
    setIsDebating(true);
    setMessages([]);
    setSummary("");
    setCurrentRound(0);

    try {
      const result = await simulateDebate(topic, totalRounds, (message) => {
        setMessages((prev) => [...prev, message]);
      });
      
      setCurrentRound(totalRounds);
      setSummary(result.summary);
      toast({
        title: "Debate Complete",
        description: "All agents have presented their arguments.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete debate",
        variant: "destructive",
      });
    } finally {
      setIsDebating(false);
    }
  };

  const exportDebate = () => {
    const data = {
      topic,
      timestamp: new Date().toISOString(),
      messages,
      summary,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate-${Date.now()}.json`;
    a.click();
  };

  const progress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Debate Topic</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{topic}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportDebate} disabled={messages.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Topic
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Round {currentRound} of {totalRounds}</span>
              <Badge variant={isDebating ? "default" : "secondary"}>
                {isDebating ? "Debating..." : "Complete"}
              </Badge>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {messages.length === 0 && isDebating && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Agents are preparing their arguments...</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {messages.map((msg, idx) => (
            <AgentMessage key={idx} {...msg} />
          ))}

          {summary && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Debate Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <KnowledgeGraph messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default DebateArena;
