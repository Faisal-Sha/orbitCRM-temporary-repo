
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Generate 30 dummy files
const DUMMY_FILES = [
  {
    id: 1,
    name: "IntakeForm.pdf",
    uploadedBy: "Dr. Alan Grant",
    uploadedAt: "2025-06-06 12:14",
    size: "1.3MB",
    url: "#",
    type: "pdf"
  },
  {
    id: 2,
    name: "CarePlan.docx",
    uploadedBy: "Case Manager Sue",
    uploadedAt: "2025-06-04 17:48",
    size: "320KB",
    url: "#",
    type: "docx"
  },
  {
    id: 3,
    name: "AssessmentSummary.txt",
    uploadedBy: "Beth",
    uploadedAt: "2025-06-01 09:32",
    size: "12KB",
    url: "#",
    type: "txt"
  },
  // 27 programmatically generated entries
  ...Array.from({ length: 27 }).map((_, i) => {
    const id = i + 4;
    return {
      id,
      name: `Document_${id}.${["pdf", "docx", "txt"][id % 3]}`,
      uploadedBy: ["Alex", "Jordan", "Sue", "Beth", "Sam"][id % 5],
      uploadedAt: `2025-06-${(id % 30 + 1).toString().padStart(2, "0")} ${(8 + id % 10).toString().padStart(2, "0")}:${(12 + id * 3) % 60}`,
      size: `${(Math.round(Math.random() * 900) + 100) / 100}MB`,
      url: "#",
      type: ["pdf", "docx", "txt"][id % 3]
    };
  })
];

const fileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <span className="inline-block w-5 h-5 bg-red-100 flex items-center justify-center rounded text-red-500 font-bold text-xs mr-2">PDF</span>;
    case "docx":
      return <span className="inline-block w-5 h-5 bg-blue-100 flex items-center justify-center rounded text-blue-500 font-bold text-xs mr-2">DOC</span>;
    case "txt":
      return <span className="inline-block w-5 h-5 bg-gray-200 flex items-center justify-center rounded text-gray-700 font-bold text-xs mr-2">TXT</span>;
    default:
      return <FileText className="h-4 w-4 text-gray-500 mr-2" />;
  }
};

const FilesRecords = () => {
  // Consistent padding/scrolling area for Files
  return (
    <div className="bg-white dark:bg-card border rounded-lg shadow-sm flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2">
        <div className="flex flex-col md:flex-row md:items-center mb-4 gap-3">
          <h3 className="text-base font-semibold flex-1">Files</h3>
          <Button variant="default" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-muted">
                <th className="py-2 px-2 text-left font-semibold">File</th>
                <th className="py-2 px-2 text-left font-semibold">Uploaded By</th>
                <th className="py-2 px-2 text-left font-semibold">Date/Time</th>
                <th className="py-2 px-2 text-left font-semibold">Size</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_FILES.map((file) => (
                <tr key={file.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-2 px-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {fileTypeIcon(file.type)}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">{file.uploadedBy}</td>
                  <td className="py-2 px-2">{file.uploadedAt}</td>
                  <td className="py-2 px-2">{file.size}</td>
                  <td className="py-2 px-2">
                    <a
                      href={file.url}
                      className="text-xs text-blue-600 hover:underline"
                      download
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilesRecords;
