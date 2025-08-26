import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Eye, Send, Download, DollarSign, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface InvoicesProps {
  dateRange?: string;
  providerFilter?: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  method: string;
  notes: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  status: "draft" | "sent" | "partially-paid" | "paid" | "overdue";
  provider: string;
  lineItems: LineItem[];
  payments: Payment[];
  notes: string;
  taxRate: number;
  discountAmount: number;
}

const Invoices = ({ dateRange = "this-month", providerFilter = "all" }: InvoicesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [recordingPaymentFor, setRecordingPaymentFor] = useState<Invoice | null>(null);

  // Dummy data for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "John Doe",
      invoiceDate: "2024-01-15",
      dueDate: "2024-02-15",
      totalAmount: 300,
      amountPaid: 150,
      amountDue: 150,
      status: "partially-paid",
      provider: "Dr. Smith",
      lineItems: [
        { id: "1", description: "Individual Therapy Session", quantity: 2, rate: 150, amount: 300 }
      ],
      payments: [
        { id: "1", amount: 150, date: "2024-01-20", method: "Credit Card", notes: "Partial payment" }
      ],
      notes: "Standard therapy sessions",
      taxRate: 0,
      discountAmount: 0
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "Jane Smith",
      invoiceDate: "2024-01-16",
      dueDate: "2024-02-16",
      totalAmount: 225,
      amountPaid: 225,
      amountDue: 0,
      status: "paid",
      provider: "Dr. Johnson",
      lineItems: [
        { id: "2", description: "Group Therapy Session", quantity: 3, rate: 75, amount: 225 }
      ],
      payments: [
        { id: "2", amount: 225, date: "2024-01-18", method: "Bank Transfer", notes: "Full payment" }
      ],
      notes: "Group therapy sessions",
      taxRate: 0,
      discountAmount: 0
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    clientName: "",
    dueDate: "",
    provider: "",
    notes: "",
    taxRate: 0,
    discountAmount: 0
  });

  const [newPayment, setNewPayment] = useState({
    amount: 0,
    date: "",
    method: "Credit Card",
    notes: ""
  });

  const clients = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"];
  const providers = ["Dr. Smith", "Dr. Johnson", "Therapist Brown", "Counselor Davis"];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesClient = clientFilter === "all" || invoice.clientName === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const handleSaveInvoice = () => {
    if (editingInvoice) {
      setInvoices(prev => prev.map(invoice => 
        invoice.id === editingInvoice.id 
          ? { ...editingInvoice, ...newInvoice }
          : invoice
      ));
      toast.success("Invoice updated successfully");
    } else {
      const invoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        totalAmount: 0,
        amountPaid: 0,
        amountDue: 0,
        status: "draft",
        lineItems: [],
        payments: [],
        ...newInvoice
      };
      setInvoices(prev => [...prev, invoice]);
      toast.success("New invoice created successfully");
    }
    
    setIsDialogOpen(false);
    setEditingInvoice(null);
    setNewInvoice({
      clientName: "",
      dueDate: "",
      provider: "",
      notes: "",
      taxRate: 0,
      discountAmount: 0
    });
  };

  const handleRecordPayment = () => {
    if (!recordingPaymentFor) return;
    
    const payment: Payment = {
      id: Date.now().toString(),
      ...newPayment,
      date: newPayment.date || new Date().toISOString().split('T')[0]
    };

    setInvoices(prev => prev.map(invoice => {
      if (invoice.id === recordingPaymentFor.id) {
        const newAmountPaid = invoice.amountPaid + newPayment.amount;
        const newAmountDue = invoice.totalAmount - newAmountPaid;
        const newStatus = newAmountDue <= 0 ? "paid" : "partially-paid";
        
        return {
          ...invoice,
          amountPaid: newAmountPaid,
          amountDue: newAmountDue,
          status: newStatus as Invoice['status'],
          payments: [...invoice.payments, payment]
        };
      }
      return invoice;
    }));

    setIsPaymentDialogOpen(false);
    setRecordingPaymentFor(null);
    setNewPayment({
      amount: 0,
      date: "",
      method: "Credit Card",
      notes: ""
    });
    toast.success("Payment recorded successfully");
  };

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: "sent" as const } : invoice
    ));
    toast.success("Invoice sent successfully");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "secondary",
      sent: "outline",
      "partially-paid": "default",
      paid: "default",
      overdue: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const totalInvoiced = filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const totalOutstanding = filteredInvoices.reduce((sum, invoice) => sum + invoice.amountDue, 0);
  const totalPaid = filteredInvoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredInvoices.filter(i => i.status === "overdue").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Manage client invoices and payment tracking</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingInvoice ? "Edit" : "Create New"} Invoice</DialogTitle>
                    <DialogDescription>
                      {editingInvoice ? "Update the invoice details" : "Create a new invoice for a client"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Select 
                        value={newInvoice.clientName} 
                        onValueChange={(value) => setNewInvoice(prev => ({ ...prev, clientName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client} value={client}>
                              {client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Select 
                        value={newInvoice.provider} 
                        onValueChange={(value) => setNewInvoice(prev => ({ ...prev, provider: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map(provider => (
                            <SelectItem key={provider} value={provider}>
                              {provider}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newInvoice.notes}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Invoice notes or terms"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveInvoice}>
                        {editingInvoice ? "Update" : "Create"} Invoice
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <DialogDescription>
                      Record a payment for {recordingPaymentFor?.invoiceNumber}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentDate">Payment Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select 
                        value={newPayment.method} 
                        onValueChange={(value) => setNewPayment(prev => ({ ...prev, method: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentNotes">Payment Notes</Label>
                      <Textarea
                        id="paymentNotes"
                        value={newPayment.notes}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Payment notes or reference"
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRecordPayment}>
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="partially-paid">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoices Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <User className="w-4 h-4" />
                      </Button>
                      {invoice.clientName}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>${invoice.amountPaid.toLocaleString()}</TableCell>
                  <TableCell>${invoice.amountDue.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {invoice.status === "draft" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSendInvoice(invoice.id)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      {invoice.amountDue > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setRecordingPaymentFor(invoice);
                            setIsPaymentDialogOpen(true);
                          }}
                        >
                          <DollarSign className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
