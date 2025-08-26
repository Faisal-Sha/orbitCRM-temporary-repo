
export const getWidthClass = (width?: string) => {
  switch (width) {
    case '50%':
    case 'Half':
      return 'basis-[calc(50%-0.5rem)] flex-shrink-0';
    case '33.33%':
    case 'One Third':
      return 'basis-[calc(33.333%-0.667rem)] flex-shrink-0';
    case '66.66%':
    case 'Two Thirds':
      return 'basis-[calc(66.667%-0.333rem)] flex-shrink-0';
    case '25%':
    case 'Quarter':
      return 'basis-[calc(25%-0.75rem)] flex-shrink-0';
    case '75%':
    case 'Three Quarters':
      return 'basis-[calc(75%-0.25rem)] flex-shrink-0';
    default:
      return 'basis-full flex-shrink-0';
  }
};
