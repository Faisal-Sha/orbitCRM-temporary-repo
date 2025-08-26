import React from 'react';
import { formatDateTime } from '@/utils/dateTimeFormatter';
import html2pdf from 'html2pdf.js';

interface FormPreviewSubmissionProps {
  formData: any;
  formValues: Record<string, any>;
  calculateQuizScore: () => number;
  triggeredConfirmationId?: string | null;
}

export const FormPreviewSubmission: React.FC<FormPreviewSubmissionProps> = ({
  formData,
  formValues,
  calculateQuizScore,
  triggeredConfirmationId,
}) => {
  const processShortcodes = (content: string) => {
    let processedContent = content;
    
    // Replace form title
    processedContent = processedContent.replace(/{{FORM_TITLE}}/g, formData.settings?.title || 'Form');
    
    // Replace quiz score
    const quizScore = calculateQuizScore();
    const scoreDisplayType = formData.settings?.quiz?.scoreDisplayType || 'number';
    
    let quizScoreDisplay = '';
    if (scoreDisplayType === 'percentage') {
      // Calculate percentage based on max possible score
      let maxScore = 0;
      formData.steps?.forEach((step: any) => {
        step.elements?.forEach((element: any) => {
          if (element.type.includes('quiz')) {
            if (element.type === 'quiz_slider') {
              maxScore += element.sliderMax || 10;
            } else if (element.options) {
              const maxOptionScore = Math.max(...element.options.map((opt: any) => opt.score || 0));
              maxScore += maxOptionScore;
            }
          }
        });
      });
      quizScoreDisplay = maxScore > 0 ? `${Math.round((quizScore / maxScore) * 100)}%` : '0%';
    } else if (scoreDisplayType === 'text') {
      const ranges = formData.settings?.quiz?.scoreRanges || [];
      const matchingRange = ranges.find((range: any) => 
        quizScore >= range.minScore && quizScore <= range.maxScore
      );
      quizScoreDisplay = matchingRange?.message || quizScore.toString();
    } else {
      quizScoreDisplay = quizScore.toString();
    }
    
    processedContent = processedContent.replace(/{{QUIZ_SCORE}}/g, quizScoreDisplay);
    
    // Collect all form elements to handle ALL shortcodes (including hidden fields)
    const allElements: any[] = [];
    formData.steps?.forEach((step: any) => {
      step.elements?.forEach((element: any) => {
        if (element && !['next', 'previous', 'save', 'submit', 'linebreak'].includes(element.type)) {
          allElements.push(element);
        }
      });
    });
    
    // Process shortcodes for all elements (including hidden fields)
    allElements.forEach(element => {
      if (element.label) {
        const shortcode = `{{${element.label.toLowerCase().replace(/\s+/g, '_')}}}`;
        let value = formValues[element.id] || '';
        
        // Handle different field types for empty values
        if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
          // For empty fields, replace shortcode with empty string
          processedContent = processedContent.replace(new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        } else {
          // Handle signature fields - convert base64 to HTML img tag
          if (element.type === 'signature' && typeof value === 'string' && value.startsWith('data:image/')) {
            value = `<img src="${value}" alt="Signature" style="max-width: 300px; max-height: 150px;" />`;
          } else if (element.type === 'datetime' && value) {
            value = formatDateTime(value, element.dateFormat, element.dateType);
          } else if ((element.type === 'checkbox' || element.type === 'quiz_checkbox') && Array.isArray(value)) {
            value = value.join(', '); // Add spaces between options
          }
          
          processedContent = processedContent.replace(new RegExp(shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
        }
      }
    });
    
    return processedContent;
  };

  const generateAndDownloadPDF = (pdfConfig: any) => {
    // Process the PDF content with shortcodes
    const processedContent = processShortcodes(pdfConfig.content || '');
    
    // Create a complete HTML document for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${pdfConfig.name || 'PDF Document'}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px; 
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3, h4, h5, h6 { 
              color: #2c3e50; 
              margin-top: 30px;
              margin-bottom: 15px;
            }
            p { 
              margin-bottom: 15px; 
            }
            strong { 
              font-weight: bold; 
            }
            em { 
              font-style: italic; 
            }
            img {
              max-width: 100%;
              height: auto;
              margin: 20px 0;
            }
            a {
              color: #3498db;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          ${processedContent}
        </body>
      </html>
    `;
    
    // Create a temporary element to hold the HTML content
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    // Configure PDF options
    const options = {
      margin: 1,
      filename: `${pdfConfig.filename || pdfConfig.name || 'document'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Generate and download the PDF
    html2pdf().set(options).from(element).save();
  };

  const processContentWithPDFLinks = (content: string) => {
    let processedContent = processShortcodes(content);
    
    // Replace PDF download links with functional click handlers
    const pdfs = formData.settings?.pdfs || [];
    pdfs.forEach((pdf: any) => {
      const pdfLinkRegex = new RegExp(`<a[^>]*onclick=["']downloadPDF\\('${pdf.id}'\\)["'][^>]*>([^<]*)</a>`, 'g');
      processedContent = processedContent.replace(pdfLinkRegex, (match, linkText) => {
        return `<a href="#" style="color: #0066cc; text-decoration: underline; cursor: pointer;" data-pdf-id="${pdf.id}">${linkText}</a>`;
      });
    });
    
    return processedContent;
  };

  // Handle PDF download clicks
  React.useEffect(() => {
    const handlePDFClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' && target.hasAttribute('data-pdf-id')) {
        event.preventDefault();
        const pdfId = target.getAttribute('data-pdf-id');
        const pdf = formData.settings?.pdfs?.find((p: any) => p.id.toString() === pdfId);
        if (pdf) {
          generateAndDownloadPDF(pdf);
        }
      }
    };

    // Add event listener to the document
    document.addEventListener('click', handlePDFClick);
    
    return () => {
      document.removeEventListener('click', handlePDFClick);
    };
  }, [formData, formValues]);

  // Show confirmation page
  const confirmations = formData.settings?.confirmations || [];
  
  // Find appropriate confirmation based on conditional logic
  let selectedConfirmation = confirmations[0]; // Default to first one
  
  // If triggeredConfirmationId is provided, find the matching confirmation
  if (triggeredConfirmationId) {
    console.log('Looking for confirmation with ID:', triggeredConfirmationId);
    console.log('Available confirmations:', confirmations.map((c: any) => ({ id: c.id, name: c.name })));
    
    const matchingConfirmation = confirmations.find((conf: any) => 
      conf.id.toString() === triggeredConfirmationId.toString()
    );
    
    if (matchingConfirmation) {
      console.log('Found matching confirmation:', matchingConfirmation.name);
      selectedConfirmation = matchingConfirmation;
    } else {
      console.log('No matching confirmation found, using default');
    }
  }
  
  if (selectedConfirmation?.type === 'redirect') {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Redirecting...</h2>
        <p className="text-muted-foreground">
          You would be redirected to: {selectedConfirmation.url}
        </p>
      </div>
    );
  } else if (selectedConfirmation?.type === 'design') {
    const processedContent = processContentWithPDFLinks(selectedConfirmation.content || 'Thank you for your submission!');
    return (
      <div className="p-6">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: processedContent
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\n/g, '<br>')
          }} 
        />
      </div>
    );
  }
  
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Thank you!</h2>
      <p className="text-muted-foreground">Your form has been submitted successfully.</p>
    </div>
  );
};
