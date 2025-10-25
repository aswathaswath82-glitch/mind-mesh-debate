import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KnowledgeGraphProps {
  messages: any[];
}

const KnowledgeGraph = ({ messages }: KnowledgeGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || messages.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define nodes
    const nodes = [
      { id: "Engineer", x: 150, y: 100, color: "#3b82f6" },
      { id: "Visionary", x: 150, y: 200, color: "#a855f7" },
      { id: "Ethicist", x: 150, y: 300, color: "#22c55e" },
    ];

    // Draw edges
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((other) => {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach((node) => {
      // Outer circle
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#1f2937";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.id, node.x, node.y + 50);
    });

    // Add interaction count
    const agentCounts = messages.reduce((acc, msg) => {
      acc[msg.agent] = (acc[msg.agent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    nodes.forEach((node) => {
      const count = agentCounts[node.id] || 0;
      ctx.fillStyle = node.color;
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(count.toString(), node.x, node.y + 5);
    });
  }, [messages]);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Consensus Map</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={300}
          height={400}
          className="w-full border rounded-lg bg-background"
        />
        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
          <p>• Nodes represent agent personas</p>
          <p>• Numbers show argument count</p>
          <p>• Lines show debate connections</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraph;
