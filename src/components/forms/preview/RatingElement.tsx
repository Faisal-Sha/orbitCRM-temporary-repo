
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Star, Circle } from 'lucide-react';
import { BaseElementProps } from './types';
import { getWidthClass } from './utils';

interface RatingElementProps extends BaseElementProps {}

export const RatingElement: React.FC<RatingElementProps> = ({
  element,
  value,
  updateFormValue,
  isDisabled,
  isRequired,
  error,
}) => {
  const [ratingHover, setRatingHover] = useState(0);
  const rating = parseInt(value) || 0;
  const hoverValue = ratingHover || rating;

  return (
    <div className={`space-y-2 ${getWidthClass(element.width)}`}>
      {element.showLabel && (
        <label className="block text-sm font-medium">
          {element.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {element.iconDesign === 'slider' ? (
        <div className="space-y-2">
          <Slider
            value={[rating]}
            onValueChange={(values) => updateFormValue(element.id, values[0])}
            max={element.maxRating || 5}
            step={1}
            disabled={isDisabled}
            onPointerMove={(e) => {
              const slider = e.currentTarget;
              const rect = slider.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              const sliderValue = Math.round(percent * (element.maxRating || 5));
              setRatingHover(Math.max(0, Math.min(sliderValue, element.maxRating || 5)));
            }}
            onPointerLeave={() => {
              setRatingHover(0);
            }}
          />
          <div className="text-center text-sm font-medium">
            Rating: {hoverValue || rating} / {element.maxRating || 5}
          </div>
        </div>
      ) : (
        <div className="flex space-x-1">
          {Array.from({ length: element.maxRating || 5 }).map((_, i) => {
            const IconComponent = element.iconDesign === 'circle' ? Circle : Star;
            return (
              <button
                key={i}
                type="button"
                onClick={() => updateFormValue(element.id, i + 1)}
                disabled={isDisabled}
                className={`${
                  i < rating 
                    ? element.iconColor === 'red' ? 'text-red-400' 
                      : element.iconColor === 'blue' ? 'text-blue-400'
                      : element.iconColor === 'green' ? 'text-green-400'
                      : 'text-yellow-400'
                    : 'text-gray-300'
                } hover:scale-110 transition-transform`}
              >
                <IconComponent className="h-6 w-6" />
              </button>
            );
          })}
        </div>
      )}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
};
