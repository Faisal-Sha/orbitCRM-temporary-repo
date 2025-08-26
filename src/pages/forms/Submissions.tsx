
import PageContainer from "@/components/PageContainer";
import { FormSubmissionsList } from "@/components/forms/FormSubmissionsList";

const Submissions = () => {
  return (
    <PageContainer
      title="Form Submissions"
      description="View and manage form responses"
    >
      <FormSubmissionsList />
    </PageContainer>
  );
};

export default Submissions;
