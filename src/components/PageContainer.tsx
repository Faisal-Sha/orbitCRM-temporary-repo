
import { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const PageContainer = ({ title, description, children }: PageContainerProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="app-heading-1">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
