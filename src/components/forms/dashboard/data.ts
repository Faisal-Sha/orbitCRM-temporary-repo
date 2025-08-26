
export interface FormData {
  id: string;
  title: string;
  status: 'Active' | 'Draft' | 'Archived';
  submissions: number;
  createdDate: string;
  lastModified: string;
  category: string;
  averageScore?: number;
}

export interface SubmissionData {
  id: string;
  formId: string;
  formTitle: string;
  submitterName: string;
  submissionDate: string;
  source: string;
  score?: number;
  status: 'Complete' | 'Partial' | 'Pending';
}

export interface FormsDashboardData {
  totalForms: number;
  totalSubmissions: number;
  activeForms: number;
  archivedForms: number;
  draftForms: number;
  forms: FormData[];
  submissions: SubmissionData[];
  submissionTrends: Array<{
    month: string;
    submissions: number;
  }>;
  formsByStatus: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  submissionsBySource: Array<{
    source: string;
    count: number;
    color: string;
  }>;
  topFormsBySubmissions: Array<{
    formTitle: string;
    submissions: number;
  }>;
  averageQuizScore: number;
}

const generateDummyForms = (): FormData[] => {
  const formTitles = [
    'Client Intake Form',
    'Therapy Session Feedback',
    'Mental Health Assessment',
    'Progress Evaluation',
    'Treatment Goals Planning',
    'Medication Review',
    'Crisis Assessment',
    'Discharge Planning',
    'Family Therapy Intake',
    'Group Therapy Registration',
    'Substance Abuse Screening',
    'Anxiety Assessment Quiz',
    'Depression Screening',
    'Trauma History Form',
    'Coping Skills Assessment'
  ];

  const categories = [
    'Intake Forms',
    'Assessment Forms',
    'Feedback Forms',
    'Treatment Forms',
    'Screening Forms'
  ];

  const statuses: Array<'Active' | 'Draft' | 'Archived'> = ['Active', 'Draft', 'Archived'];

  return formTitles.map((title, index) => ({
    id: `form-${index + 1}`,
    title,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    submissions: Math.floor(Math.random() * 500) + 10,
    createdDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastModified: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    category: categories[Math.floor(Math.random() * categories.length)],
    averageScore: title.includes('Quiz') || title.includes('Assessment') ? Math.floor(Math.random() * 40) + 60 : undefined
  }));
};

const generateDummySubmissions = (forms: FormData[]): SubmissionData[] => {
  const sources = ['Website', 'Email', 'Mobile App', 'Kiosk', 'Staff Portal'];
  const submitterNames = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
    'David Wilson', 'Jessica Miller', 'Robert Taylor', 'Amanda Garcia',
    'Christopher Lee', 'Jennifer Martinez', 'Matthew Anderson', 'Ashley Thompson'
  ];
  const statuses: Array<'Complete' | 'Partial' | 'Pending'> = ['Complete', 'Partial', 'Pending'];

  const submissions: SubmissionData[] = [];

  forms.forEach(form => {
    const submissionCount = form.submissions;
    for (let i = 0; i < submissionCount; i++) {
      submissions.push({
        id: `sub-${form.id}-${i + 1}`,
        formId: form.id,
        formTitle: form.title,
        submitterName: submitterNames[Math.floor(Math.random() * submitterNames.length)],
        submissionDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        source: sources[Math.floor(Math.random() * sources.length)],
        score: form.averageScore ? Math.floor(Math.random() * 40) + 60 : undefined,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  });

  return submissions;
};

const generateSubmissionTrends = (submissions: SubmissionData[]): Array<{month: string; submissions: number}> => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return months.map(month => ({
    month,
    submissions: Math.floor(Math.random() * 200) + 50
  }));
};

export const generateFormsDashboardData = (dateRange: string): FormsDashboardData => {
  const forms = generateDummyForms();
  const submissions = generateDummySubmissions(forms);

  const activeForms = forms.filter(f => f.status === 'Active').length;
  const archivedForms = forms.filter(f => f.status === 'Archived').length;
  const draftForms = forms.filter(f => f.status === 'Draft').length;

  const formsByStatus = [
    { status: 'Active', count: activeForms, color: '#10b981' },
    { status: 'Draft', count: draftForms, color: '#f59e0b' },
    { status: 'Archived', count: archivedForms, color: '#6b7280' }
  ];

  const submissionsBySource = [
    { source: 'Website', count: Math.floor(submissions.length * 0.4), color: '#3b82f6' },
    { source: 'Mobile App', count: Math.floor(submissions.length * 0.3), color: '#10b981' },
    { source: 'Email', count: Math.floor(submissions.length * 0.15), color: '#f59e0b' },
    { source: 'Kiosk', count: Math.floor(submissions.length * 0.1), color: '#ef4444' },
    { source: 'Staff Portal', count: Math.floor(submissions.length * 0.05), color: '#8b5cf6' }
  ];

  const topFormsBySubmissions = forms
    .sort((a, b) => b.submissions - a.submissions)
    .slice(0, 8)
    .map(form => ({
      formTitle: form.title,
      submissions: form.submissions
    }));

  const quizSubmissions = submissions.filter(s => s.score !== undefined);
  const averageQuizScore = quizSubmissions.length > 0 
    ? Math.floor(quizSubmissions.reduce((sum, s) => sum + (s.score || 0), 0) / quizSubmissions.length)
    : 0;

  return {
    totalForms: forms.length,
    totalSubmissions: submissions.length,
    activeForms,
    archivedForms,
    draftForms,
    forms,
    submissions,
    submissionTrends: generateSubmissionTrends(submissions),
    formsByStatus,
    submissionsBySource,
    topFormsBySubmissions,
    averageQuizScore
  };
};
