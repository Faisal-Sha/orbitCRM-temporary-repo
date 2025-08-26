
import React from 'react';

interface FormPreviewHeaderProps {
  formData: any;
  userLoginStatus: string;
  setUserLoginStatus: (status: string) => void;
}

export const FormPreviewHeader: React.FC<FormPreviewHeaderProps> = ({
  formData,
  userLoginStatus,
  setUserLoginStatus,
}) => {
  return (
    <>
      {/* Form Title */}
      {formData.settings?.title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{formData.settings.title}</h1>
          {formData.settings?.description && (
            <p className="text-muted-foreground mt-2">{formData.settings.description}</p>
          )}
        </div>
      )}

      {/* User Login Status Simulator */}
      <div className="mb-4 p-3 bg-muted/50 rounded-md">
        <label className="text-sm font-medium">Simulate User Status:</label>
        <select 
          value={userLoginStatus} 
          onChange={(e) => setUserLoginStatus(e.target.value)}
          className="ml-2 text-sm"
        >
          <option value="any">Any</option>
          <option value="logged_in">Logged In</option>
          <option value="logged_out">Logged Out</option>
        </select>
      </div>
    </>
  );
};
