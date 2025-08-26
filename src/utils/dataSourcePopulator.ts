
// Client-side data source population utility for hidden form fields
export interface DataSourceConfig {
  type: 'none' | 'url_parameter' | 'referrer_url' | 'user_contact_field' | 'static_value' | 'client_ip';
  parameterName?: string;
  contactField?: string;
  staticValue?: string;
}

// Mock user/contact data for demonstration
const mockUserData = {
  contact_first_name: 'John',
  contact_last_name: 'Doe', 
  contact_email: 'john.doe@example.com',
  contact_phone: '+1-555-0123',
  contact_id: 'contact_12345',
  user_id: 'user_67890',
  user_email: 'john.doe@example.com',
  user_role: 'admin'
};

export const populateDataSource = (dataSource: DataSourceConfig): string => {
  if (!dataSource || dataSource.type === 'none') {
    return '';
  }

  switch (dataSource.type) {
    case 'url_parameter':
      if (dataSource.parameterName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(dataSource.parameterName) || '';
      }
      return '';

    case 'referrer_url':
      return document.referrer || '';

    case 'user_contact_field':
      if (dataSource.contactField) {
        return mockUserData[dataSource.contactField as keyof typeof mockUserData] || '';
      }
      return '';

    case 'static_value':
      return dataSource.staticValue || '';

    case 'client_ip':
      // In a real implementation, this would fetch the IP from a service
      // For demo purposes, return a mock IP
      return '192.168.1.100';

    default:
      return '';
  }
};

// Function to populate all hidden fields with data sources in a form
export const populateHiddenFieldsData = (formElements: any[]): Record<string, string> => {
  const populatedData: Record<string, string> = {};

  formElements.forEach((element) => {
    if (element.type === 'hidden' && element.dataSource) {
      const value = populateDataSource(element.dataSource);
      if (value) {
        populatedData[element.id] = value;
        // Also store by label for shortcode access
        if (element.label) {
          populatedData[element.label.toLowerCase().replace(/\s+/g, '_')] = value;
        }
      }
    }
  });

  return populatedData;
};
