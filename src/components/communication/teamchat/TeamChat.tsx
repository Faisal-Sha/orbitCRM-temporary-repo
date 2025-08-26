
import TeamPersonalChat from "./TeamPersonalChat";
import TeamGroupChat from "./TeamGroupChat";
import TeamTaskChat from "./TeamTaskChat";

interface TeamChatProps {
  defaultTab?: "chat" | "spaces" | "tasks";
}

/** This orchestrator selects which context (personal, group, tasks) to show based on prop. */
const TeamChat = ({ defaultTab }: TeamChatProps) => {
  // Use the prop to decide which subcomponent to render.
  if (defaultTab === "spaces") return <TeamGroupChat />;
  if (defaultTab === "tasks") return <TeamTaskChat />;
  // Default to personal chat
  return <TeamPersonalChat />;
};

export default TeamChat;
