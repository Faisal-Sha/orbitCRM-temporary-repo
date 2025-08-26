
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';

interface FormSettingsQuizProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FormSettingsQuiz: React.FC<FormSettingsQuizProps> = ({
  formData,
  setFormData,
}) => {
  const updateQuizSetting = (key: string, value: any) => {
    setFormData({
      ...formData,
      settings: {
        ...formData.settings,
        quiz: {
          ...formData.settings?.quiz,
          [key]: value
        }
      }
    });
  };

  const addScoreRange = () => {
    const currentRanges = formData.settings?.quiz?.scoreRanges || [];
    const newRange = {
      id: Date.now(),
      minScore: 0,
      maxScore: 10,
      message: 'Enter result message'
    };
    
    updateQuizSetting('scoreRanges', [...currentRanges, newRange]);
  };

  const updateScoreRange = (rangeId: number, field: string, value: any) => {
    const currentRanges = formData.settings?.quiz?.scoreRanges || [];
    const updatedRanges = currentRanges.map((range: any) =>
      range.id === rangeId ? { ...range, [field]: value } : range
    );
    updateQuizSetting('scoreRanges', updatedRanges);
  };

  const removeScoreRange = (rangeId: number) => {
    const currentRanges = formData.settings?.quiz?.scoreRanges || [];
    const updatedRanges = currentRanges.filter((range: any) => range.id !== rangeId);
    updateQuizSetting('scoreRanges', updatedRanges);
  };

  const scoreDisplayType = formData.settings?.quiz?.scoreDisplayType || 'number';

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Quiz Settings</h3>
      
      <div className="space-y-2">
        <Label>Score Display Type</Label>
        <Select 
          value={scoreDisplayType} 
          onValueChange={(value) => updateQuizSetting('scoreDisplayType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="percentage">Percentage</SelectItem>
            <SelectItem value="text">Text Message</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {scoreDisplayType === 'text' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Quiz Result Ranges</Label>
            <Button variant="outline" size="sm" onClick={addScoreRange}>
              <Plus className="h-4 w-4 mr-1" />
              Add Range
            </Button>
          </div>
          
          <div className="space-y-4">
            {(formData.settings?.quiz?.scoreRanges || []).map((range: any) => (
              <div key={range.id} className="p-4 border rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Score Range</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScoreRange(range.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Min Score</Label>
                    <Input
                      type="number"
                      value={range.minScore}
                      onChange={(e) => updateScoreRange(range.id, 'minScore', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Score</Label>
                    <Input
                      type="number"
                      value={range.maxScore}
                      onChange={(e) => updateScoreRange(range.id, 'maxScore', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Result Message</Label>
                  <Textarea
                    value={range.message}
                    onChange={(e) => updateScoreRange(range.id, 'message', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
