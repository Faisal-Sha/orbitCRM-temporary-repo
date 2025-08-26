
import { useMemo } from "react";
import GoalsListView from "./GoalsListView";

interface Goal {
  id: string;
  title: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Blocked" | "Completed" | "Cancelled";
  dueDate: Date | null;
  milestones?: Goal[];
  isExpanded?: boolean;
  sectionId: string;
}

interface GoalsMilestonesListProps {
  goals: Goal[];
  sections: { id: string; title: string }[];
  onGoalUpdate: (updatedGoal: Goal) => void;
  onGoalToggle: (goalId: string) => void;
  onGoalComplete: (goalId: string) => void;
}

const GoalsMilestonesList = ({
  goals,
  sections,
  onGoalUpdate,
  onGoalToggle,
  onGoalComplete,
}: GoalsMilestonesListProps) => {
  const goalsMilestones = useMemo(() => {
    return goals.filter(goal => goal.sectionId === 'goals' || goal.sectionId === 'development');
  }, [goals]);

  return (
    <GoalsListView
      goals={goalsMilestones}
      sections={sections}
      onGoalUpdate={onGoalUpdate}
      onGoalToggle={onGoalToggle}
      onGoalComplete={onGoalComplete}
    />
  );
};

export default GoalsMilestonesList;
