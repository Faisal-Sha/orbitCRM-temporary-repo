
import React from 'react';
import { getWidthClass } from './utils';

interface StaticElementsProps {
  element: any;
}

export const StaticElements: React.FC<StaticElementsProps> = ({ element }) => {
  switch (element.type) {
    case 'heading':
      return (
        <div className={getWidthClass(element.width)}>
          <h3 className="text-lg font-semibold">{element.label}</h3>
        </div>
      );

    case 'paragraph':
      return (
        <div className={getWidthClass(element.width)}>
          <p className="text-sm text-muted-foreground">{element.label}</p>
        </div>
      );

    case 'linebreak':
      return (
        <div className={getWidthClass(element.width)}>
          <hr className="border-border" />
        </div>
      );

    default:
      return null;
  }
};
