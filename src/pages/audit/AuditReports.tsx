
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { FileText, Download, Plus, Play, Calendar, User, Shield } from 'lucide-react';

const AuditReports = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reportName, setReportName] = useState('');
  const [selectedLogSources, setSelectedLogSources] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Predefined report templates
  const reportTemplates = [
    {
      id: 'phi-access-by-user',
      name: 'PHI Access by User',
      description: 'All PHI access events for a specific user',
      icon: User,
      category: 'HIPAA Compliance'
    },
    {
      id: 'client-record-changes',
      name: 'Client Record Changes',
      description: 'All modifications to client records',
      icon: FileText,
      category: 'Data Integrity'
    },
    {
      id: 'security-incidents',
      name: 'Security Incidents Report',
      description: 'Failed logins and security events',
      icon: Shield,
      category: 'Security'
    },
    {
      id: 'configuration-audit',
      name: 'Configuration Audit',
      description: 'System configuration changes',
      icon: Calendar,
      category: 'System Administration'
    }
  ];

  const logSources = [
    { id: 'activity-log', name: 'Activity Log' },
    { id: 'phi-access-log', name: 'PHI Access Log' },
    { id: 'data-modification-log', name: 'Data Modification Log' },
    { id: 'security-events', name: 'Security & Systems Events' },
    { id: 'configuration-changes', name: 'Configuration Changes' }
  ];

  const availableColumns = [
    { id: 'timestamp', name: 'Timestamp' },
    { id: 'user', name: 'User' },
    { id: 'action', name: 'Action' },
    { id: 'entity', name: 'Entity' },
    { id: 'client', name: 'Client' },
    { id: 'ip-address', name: 'IP Address' },
    { id: 'details', name: 'Details' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setReportName(template.name);
      // Auto-select appropriate log sources based on template
      switch (templateId) {
        case 'phi-access-by-user':
          setSelectedLogSources(['phi-access-log']);
          break;
        case 'client-record-changes':
          setSelectedLogSources(['data-modification-log']);
          break;
        case 'security-incidents':
          setSelectedLogSources(['security-events']);
          break;
        case 'configuration-audit':
          setSelectedLogSources(['configuration-changes']);
          break;
      }
    }
  };

  const handleLogSourceToggle = (logId: string) => {
    setSelectedLogSources(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleGenerateReport = () => {
    if (!reportName || selectedLogSources.length === 0) {
      toast({
        title: "Incomplete Configuration",
        description: "Please provide a report name and select at least one log source.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `${reportName} has been generated successfully.`
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format.`
    });
  };

  const handlePreviewReport = () => {
    toast({
      title: "Report Preview",
      description: "Opening report preview in new window."
    });
  };

  return (
    <div className="space-y-6">
      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Predefined Report Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Custom Report Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Name */}
          <div className="space-y-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Enter report name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* Log Sources */}
          <div className="space-y-3">
            <Label>Log Sources</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {logSources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={source.id}
                    checked={selectedLogSources.includes(source.id)}
                    onCheckedChange={() => handleLogSourceToggle(source.id)}
                  />
                  <Label htmlFor={source.id} className="text-sm font-normal">
                    {source.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>User Filter</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="USR001">Dr. Sarah Johnson</SelectItem>
                  <SelectItem value="USR002">Admin User</SelectItem>
                  <SelectItem value="USR003">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Client Filter</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="CLT001">Mary Wilson</SelectItem>
                  <SelectItem value="CLT002">Robert Davis</SelectItem>
                  <SelectItem value="CLT003">Lisa Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Columns */}
          <div className="space-y-3">
            <Label>Columns to Include</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availableColumns.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={() => handleColumnToggle(column.id)}
                  />
                  <Label htmlFor={column.id} className="text-sm font-normal">
                    {column.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Timestamp</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="entity">Entity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handlePreviewReport} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Preview Report
            </Button>
            <Button onClick={handleGenerateReport}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button onClick={() => handleExportReport('csv')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => handleExportReport('pdf')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* HIPAA Compliance Notice */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">HIPAA Compliance Notice</h3>
            <p className="text-sm text-blue-700">
              All generated reports maintain audit trail integrity and are designed to support 
              HIPAA compliance requirements. Reports include only necessary information and 
              maintain data security standards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReports;
