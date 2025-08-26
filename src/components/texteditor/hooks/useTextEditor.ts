
import { useState, useRef, useEffect, useCallback } from 'react';
import { DialogState, FormData, EditorActions } from '../types';

export const useTextEditor = (value: string, onChange: (value: string) => void, isSourceView: boolean) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isLinkDialogOpen: false,
    isImageDialogOpen: false,
    isFileDialogOpen: false,
    isPDFDialogOpen: false,
    isTemplateDialogOpen: false,
    isSaveTemplateDialogOpen: false,
  });

  const [formData, setFormData] = useState<FormData>({
    linkUrl: '',
    linkText: '',
    imageUrl: '',
    imageAlt: '',
    fileName: '',
    fileUrl: '',
    selectedPDFId: '',
    templateName: '',
    templateSubject: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastRangeRef = useRef<Range | null>(null);

  const formatText = useCallback((command: string, value?: string) => {
    if (isSourceView) return;
    
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [isSourceView, onChange]);

  // Function to save current cursor position
  const saveCursorPosition = useCallback(() => {
    if (isSourceView) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastRangeRef.current = selection.getRangeAt(0).cloneRange();
      console.log('Cursor position saved');
    }
  }, [isSourceView]);

  // Simplified function to restore cursor position or set to end of content
  const restoreCursorPosition = useCallback(() => {
    if (isSourceView || !editorRef.current) return false;
    
    const editor = editorRef.current;
    
    try {
      const selection = window.getSelection();
      if (!selection) return false;

      // If we have a saved range and it's still valid, use it
      if (lastRangeRef.current) {
        try {
          selection.removeAllRanges();
          selection.addRange(lastRangeRef.current);
          editor.focus();
          console.log('Cursor position restored');
          return true;
        } catch (error) {
          console.log('Saved range invalid, falling back to end position');
        }
      }

      // Simplified fallback: Set cursor to end of content using selectNodeContents
      const range = document.createRange();
      
      // Check if editor is truly empty (no content or just whitespace)
      const hasContent = editor.textContent && editor.textContent.trim().length > 0;
      
      if (hasContent) {
        // Position cursor at the end of all content
        range.selectNodeContents(editor);
        range.collapse(false); // Collapse to end
      } else {
        // Editor is empty, position at the beginning
        range.selectNodeContents(editor);
        range.collapse(true); // Collapse to start
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
      editor.focus();
      
      lastRangeRef.current = range.cloneRange();
      console.log('Cursor set to', hasContent ? 'end' : 'beginning', 'of content');
      return true;
    } catch (error) {
      console.log('Failed to set cursor position:', error);
    }
    return false;
  }, [isSourceView]);

  const insertHtml = useCallback((html: string) => {
    console.log('insertHtml called with:', html, 'isSourceView:', isSourceView);
    
    if (isSourceView) {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const beforeText = value.substring(0, start);
      const afterText = value.substring(end);
      
      const newText = beforeText + html + afterText;
      onChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + html.length, start + html.length);
      }, 0);
    } else {
      const editor = editorRef.current;
      if (!editor) {
        console.error('Editor ref is null');
        return;
      }

      // Focus the editor first
      editor.focus();
      
      // Set cursor position (either restore saved position or go to end)
      restoreCursorPosition();

      // Now insert the HTML at the cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        try {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          // Create a document fragment to insert
          const fragment = document.createDocumentFragment();
          const div = document.createElement('div');
          div.innerHTML = html;
          
          // Move all child nodes to the fragment
          while (div.firstChild) {
            fragment.appendChild(div.firstChild);
          }
          
          // Insert the fragment at the current position
          range.insertNode(fragment);
          
          // Move cursor to end of inserted content
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Save the new cursor position
          lastRangeRef.current = range.cloneRange();
          
          console.log('Content inserted at cursor position');
        } catch (error) {
          console.error('Error inserting HTML:', error);
        }
      }

      // Update the content
      const newContent = editor.innerHTML;
      onChange(newContent);
      console.log('Content updated:', newContent);
    }
  }, [isSourceView, value, onChange, restoreCursorPosition]);

  const insertShortcode = useCallback((shortcode: string) => {
    console.log('insertShortcode called with:', shortcode);
    
    if (!isSourceView && editorRef.current) {
      // Focus the editor
      editorRef.current.focus();
      
      // Check if we have a valid saved cursor position
      const selection = window.getSelection();
      const hasValidCursor = selection && selection.rangeCount > 0 && lastRangeRef.current;
      
      if (!hasValidCursor) {
        // No valid cursor position, so we need to position at the end
        console.log('No valid cursor position, positioning at end of content');
        restoreCursorPosition();
      }
    }
    
    // Insert the shortcode
    insertHtml(shortcode);
  }, [isSourceView, insertHtml, restoreCursorPosition]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = event.target.files?.[0];
    if (file) {
      const dummyUrl = `https://example.com/uploads/${file.name}`;
      
      if (type === 'image') {
        setFormData(prev => ({
          ...prev,
          imageUrl: dummyUrl,
          imageAlt: file.name
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          fileUrl: dummyUrl,
          fileName: file.name
        }));
      }
    }
  }, []);

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Save cursor position when the editor loses focus
  const handleEditorBlur = useCallback(() => {
    saveCursorPosition();
  }, [saveCursorPosition]);

  // Handle clicks in the editor to update cursor position
  const handleEditorClick = useCallback(() => {
    saveCursorPosition();
  }, [saveCursorPosition]);

  // Handle key events to track cursor position
  const handleEditorKeyUp = useCallback(() => {
    saveCursorPosition();
  }, [saveCursorPosition]);

  const updateDialogState = useCallback((updates: Partial<DialogState>) => {
    setDialogState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData({
      linkUrl: '',
      linkText: '',
      imageUrl: '',
      imageAlt: '',
      fileName: '',
      fileUrl: '',
      selectedPDFId: '',
      templateName: '',
      templateSubject: '',
    });
  }, []);

  // Update editor content when value changes or switching views
  useEffect(() => {
    if (editorRef.current && !isSourceView) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isSourceView]);

  const actions: EditorActions = {
    formatText,
    insertHtml,
    insertShortcode,
    handleFileUpload,
  };

  return {
    dialogState,
    formData,
    editorRef,
    textareaRef,
    actions,
    updateDialogState,
    updateFormData,
    resetFormData,
    handleEditorInput,
    handleEditorBlur,
    handleEditorClick,
    handleEditorKeyUp,
  };
};
