import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoUploadProps {
  value?: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  uploading?: boolean;
  className?: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ 
  value, 
  onUpload, 
  onRemove, 
  uploading = false, 
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (uploading) return;
    
    const files = e.dataTransfer.files;
    const file = files[0];
    
    if (file && isValidImageFile(file)) {
      onUpload(file);
    }
  }, [onUpload, uploading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!uploading) {
      setIsDragOver(true);
    }
  }, [uploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImageFile(file)) {
      onUpload(file);
    }
    // Reset input value so same file can be selected again
    e.target.value = '';
  }, [onUpload]);

  const isValidImageFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      return false;
    }
    
    if (file.size > maxSize) {
      return false;
    }
    
    return true;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Organization Logo</Label>
      
      {value ? (
        // Show current logo with options to change/remove
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
            <div className="h-16 w-16 rounded-lg border bg-background flex items-center justify-center overflow-hidden">
              <img 
                src={value} 
                alt="Organization logo" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <Image className="h-6 w-6 text-muted-foreground hidden" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Current Logo</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, SVG up to 5MB</p>
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                onChange={handleFileSelect}
                className="hidden"
                id="logo-change"
                disabled={uploading}
              />
              <label htmlFor="logo-change">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  disabled={uploading}
                >
                  <span className="cursor-pointer">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Change"
                    )}
                  </span>
                </Button>
              </label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Show upload area when no logo
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            uploading && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Image className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Upload organization logo"}
              </p>
              <p className="text-xs text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WEBP, SVG up to 5MB
              </p>
            </div>
            {!uploading && (
              <>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                </label>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;