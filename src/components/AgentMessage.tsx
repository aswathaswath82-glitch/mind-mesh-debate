import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wrench, Lightbulb, Scale } from "lucide-react";

interface AgentMessageProps {
  agent: "Engineer" | "Visionary" | "Ethicist";
  message: string;
  round: number;
}

const agentConfig = {
  Engineer: {
    icon: Wrench,
    color: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  Visionary: {
    icon: Lightbulb,
    color: "bg-purple-500",
    badge: "bg-purple-500/10 text-purple-700 border-purple-200",
  },
  Ethicist: {
    icon: Scale,
    color: "bg-green-500",
    badge: "bg-green-500/10 text-green-700 border-green-200",
  },
};

const AgentMessage = ({ agent, message, round }: AgentMessageProps) => {
  const config = agentConfig[agent];
  const Icon = config.icon;

  return (
    <Card className="animate-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className={config.color}>
            <AvatarFallback className="text-white">
              <Icon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{agent}</h3>
              <Badge variant="outline" className={config.badge}>
                Round {round}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentMessage;
