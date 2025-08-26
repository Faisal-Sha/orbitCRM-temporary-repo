
import PageContainer from "@/components/PageContainer";
import { FormManagementList } from "@/components/forms/FormManagementList";

const Manage = () => {
  return (
    <PageContainer
      title="Manage Forms"
      description="Edit and organize your existing forms"
    >
      <FormManagementList />
    </PageContainer>
  );
};

export default Manage;
