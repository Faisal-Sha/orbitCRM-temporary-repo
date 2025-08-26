
import PageContainer from "@/components/PageContainer";
import EmailInbox from "@/components/email/EmailInbox";

const Email = () => {
  return (
    <PageContainer
      title="Email"
      description="Manage all email and in-person communications"
    >
      <EmailInbox />
    </PageContainer>
  );
};

export default Email;
