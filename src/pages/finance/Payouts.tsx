
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";
import { toast } from "sonner";
import PayoutsStatistics from "@/components/finance/PayoutsStatistics";
import PayoutsFilters from "@/components/finance/PayoutsFilters";
import PayoutsTable from "@/components/finance/PayoutsTable";
import PayoutsModals from "@/components/finance/PayoutsModals";

interface PayoutsProps {
  dateRange?: string;
  providerFilter?: string;
}

interface Payout {
  id: string;
  recipientName: string;
  service: string;
  payoutDate: string;
  amount: number;
  status: "ready" | "scheduled" | "processed" | "paid" | "canceled";
  paymentMethod: string;
  associatedServices: string[];
  invoiceLinks: string[];
  notes: string;
  cancelationNotes?: string;
  servicesPeriod: string;
  scheduledDate?: string;
}

const PayoutsPage = ({ dateRange = "this-month", providerFilter = "all" }: PayoutsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [recipientFilter, setRecipientFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all-time");
  const [customDateRange, setCustomDateRange] = useState<{from?: Date; to?: Date}>({});
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{name: string; email?: string; phone?: string} | null>(null);
  const [editingPayout, setEditingPayout] = useState<Payout | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipientSearchOpen, setRecipientSearchOpen] = useState(false);
  const [recipientSearchValue, setRecipientSearchValue] = useState("");
  const [cancelationNotes, setCancelationNotes] = useState("");
  const [showCancelationNotes, setShowCancelationNotes] = useState(false);
  const itemsPerPage = 20;

  // Scroll position preservation
  const scrollPositionRef = useRef(0);
  
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.pageYOffset;
  };

  const restoreScrollPosition = () => {
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 50);
  };

  useEffect(() => {
    if (!isEditDialogOpen && !isCreateDialogOpen && scrollPositionRef.current > 0) {
      restoreScrollPosition();
    }
  }, [isEditDialogOpen, isCreateDialogOpen]);

  // Generate 30 dummy recipients
  const allRecipients = [
    "Dr. Amanda Smith", "Dr. Michael Johnson", "Therapist Sarah Brown", "Counselor David Davis",
    "Dr. Emily Wilson", "Therapist Maria Garcia", "Dr. Robert Martinez", "Counselor Lisa Taylor",
    "Dr. James Anderson", "Therapist Jennifer White", "Dr. Christopher Lee", "Counselor Michelle Clark",
    "Dr. Daniel Harris", "Therapist Nancy Lewis", "Dr. Kevin Walker", "Counselor Rachel Hall",
    "Dr. Steven Allen", "Therapist Patricia Young", "Dr. Mark King", "Counselor Susan Wright",
    "Dr. Paul Lopez", "Therapist Linda Hill", "Dr. Thomas Scott", "Counselor Carol Green",
    "Dr. Richard Adams", "Therapist Helen Baker", "Dr. Charles Nelson", "Counselor Karen Carter",
    "Dr. Joseph Mitchell", "Therapist Betty Roberts"
  ];

  // Generate 25 dummy payouts
  const generateDummyData = (): Payout[] => {
    const services = ["Individual Therapy Session", "Group Therapy Session", "Assessment Consultation", "Family Therapy Session", "Psychological Testing"];
    const statuses: ("ready" | "scheduled" | "processed" | "paid" | "canceled")[] = ["ready", "scheduled", "processed", "paid", "canceled"];
    const paymentMethods = ["Bank Transfer", "Direct Deposit", "Check", "PayPal"];
    
    return Array.from({ length: 25 }, (_, i) => {
      const status = statuses[i % statuses.length];
      const service = services[i % services.length];
      
      return {
        id: (i + 1).toString(),
        recipientName: allRecipients[i % allRecipients.length],
        service,
        payoutDate: new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        amount: Math.round((Math.random() * 2000 + 500) * 100) / 100,
        status,
        paymentMethod: paymentMethods[i % paymentMethods.length],
        associatedServices: [`${service} - Client ${i + 1}`, `Session ${i + 2}`],
        invoiceLinks: [`INV-2025-${String(i + 1).padStart(3, '0')}`],
        notes: Math.random() > 0.5 ? `Payout notes for ${allRecipients[i % allRecipients.length]}` : "",
        cancelationNotes: status === "canceled" && Math.random() > 0.5 ? "Payment canceled due to policy changes" : undefined,
        servicesPeriod: "January 2025",
        scheduledDate: status === "scheduled" ? new Date(2025, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : undefined
      };
    });
  };

  const [payouts, setPayouts] = useState<Payout[]>(generateDummyData());

  const [newPayout, setNewPayout] = useState({
    recipientName: "",
    service: "",
    amount: 0,
    paymentMethod: "Bank Transfer",
    associatedServices: "",
    notes: "",
    servicesPeriod: "",
    scheduledDate: ""
  });

  // Date filtering logic
  const filterByDateRange = (payouts: Payout[], dateRangeFilter: string, customDateRange: {from?: Date; to?: Date}) => {
    if (dateRangeFilter === "all-time") {
      return payouts;
    }

    if (dateRangeFilter === "custom" && customDateRange.from && customDateRange.to) {
      return payouts.filter(payout => {
        const payoutDate = new Date(payout.payoutDate);
        return payoutDate >= customDateRange.from! && payoutDate <= customDateRange.to!;
      });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return payouts.filter(payout => {
      const payoutDate = new Date(payout.payoutDate);
      
      switch (dateRangeFilter) {
        case "this-month":
          return payoutDate.getFullYear() === currentYear && payoutDate.getMonth() === currentMonth;
        case "last-month":
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return payoutDate.getFullYear() === lastMonthYear && payoutDate.getMonth() === lastMonth;
        case "this-quarter":
          const currentQuarter = Math.floor(currentMonth / 3);
          const quarterStart = currentQuarter * 3;
          const quarterEnd = quarterStart + 2;
          return payoutDate.getFullYear() === currentYear && 
                 payoutDate.getMonth() >= quarterStart && 
                 payoutDate.getMonth() <= quarterEnd;
        case "last-quarter":
          const lastQuarter = Math.floor(currentMonth / 3) - 1;
          const lastQuarterStart = lastQuarter >= 0 ? lastQuarter * 3 : 9;
          const lastQuarterYear = lastQuarter >= 0 ? currentYear : currentYear - 1;
          const lastQuarterEnd = lastQuarterStart + 2;
          return payoutDate.getFullYear() === lastQuarterYear && 
                 payoutDate.getMonth() >= lastQuarterStart && 
                 payoutDate.getMonth() <= lastQuarterEnd;
        case "this-year":
          return payoutDate.getFullYear() === currentYear;
        case "last-year":
          return payoutDate.getFullYear() === currentYear - 1;
        default:
          return true;
      }
    });
  };

  const filteredPayouts = filterByDateRange(payouts, dateRangeFilter, customDateRange).filter(payout => {
    const matchesSearch = payout.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payout.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    const matchesService = serviceFilter === "all" || payout.service === serviceFilter;
    const matchesRecipient = recipientFilter === "all" || payout.recipientName === recipientFilter;
    return matchesSearch && matchesStatus && matchesService && matchesRecipient;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayouts = filteredPayouts.slice(startIndex, startIndex + itemsPerPage);

  const handleBatchProcess = () => {
    if (selectedPayouts.length === 0) {
      toast.error("Please select payouts to process");
      return;
    }
    
    setPayouts(prev => prev.map(payout => 
      selectedPayouts.includes(payout.id) 
        ? { ...payout, status: "processed" as const }
        : payout
    ));
    setSelectedPayouts([]);
    toast.success(`${selectedPayouts.length} payouts processed`);
  };

  const handleEditPayout = (payout: Payout) => {
    saveScrollPosition();
    setEditingPayout(payout);
    setNewPayout({
      recipientName: payout.recipientName,
      service: payout.service,
      amount: payout.amount,
      paymentMethod: payout.paymentMethod,
      associatedServices: payout.associatedServices.join('\n'),
      notes: payout.notes,
      servicesPeriod: payout.servicesPeriod,
      scheduledDate: payout.scheduledDate || ""
    });
    setCancelationNotes(payout.cancelationNotes || "");
    setShowCancelationNotes(!!payout.cancelationNotes);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingPayout(null);
    setCancelationNotes("");
    setShowCancelationNotes(false);
    setNewPayout({
      recipientName: "",
      service: "",
      amount: 0,
      paymentMethod: "Bank Transfer",
      associatedServices: "",
      notes: "",
      servicesPeriod: "",
      scheduledDate: ""
    });
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewPayout({
      recipientName: "",
      service: "",
      amount: 0,
      paymentMethod: "Bank Transfer",
      associatedServices: "",
      notes: "",
      servicesPeriod: "",
      scheduledDate: ""
    });
  };

  const handleSavePayout = () => {
    if (editingPayout) {
      setPayouts(prev => prev.map(payout => 
        payout.id === editingPayout.id 
          ? { 
              ...editingPayout, 
              notes: newPayout.notes,
              paymentMethod: newPayout.paymentMethod,
              scheduledDate: newPayout.scheduledDate,
              cancelationNotes: cancelationNotes || editingPayout.cancelationNotes
            }
          : payout
      ));
      toast.success("Payout updated successfully");
    } else {
      const payout: Payout = {
        id: Date.now().toString(),
        ...newPayout,
        payoutDate: new Date().toISOString().split('T')[0],
        status: "ready",
        associatedServices: newPayout.associatedServices.split('\n').filter(s => s.trim()),
        invoiceLinks: []
      };
      setPayouts(prev => [...prev, payout]);
      toast.success("New payout created successfully");
    }
    
    if (editingPayout) {
      handleCloseEditDialog();
    } else {
      handleCloseCreateDialog();
    }
  };

  const handleProcessNow = () => {
    if (!editingPayout) return;
    
    setPayouts(prev => prev.map(payout => 
      payout.id === editingPayout.id 
        ? { ...payout, status: "processed" as const }
        : payout
    ));
    handleCloseEditDialog();
    toast.success("Payout processed");
  };

  const handleCancelPayout = () => {
    if (!editingPayout) return;
    
    setPayouts(prev => prev.map(payout => 
      payout.id === editingPayout.id 
        ? { ...payout, status: "canceled" as const, cancelationNotes }
        : payout
    ));
    handleCloseEditDialog();
    toast.success("Payout canceled");
  };

  const handleDeletePayout = (id: string) => {
    setPayouts(prev => prev.filter(payout => payout.id !== id));
    toast.success("Payout deleted successfully");
  };

  const handleUserProfileClick = (userName: string) => {
    setSelectedUser({ name: userName });
    setIsProfileOpen(true);
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
  };

  const handleCustomDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setCustomDateRange({ from, to });
  };

  // Statistics calculations
  const getStatistics = () => {
    const totalPayouts = filteredPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const totalCount = filteredPayouts.length;

    const readyPayouts = filteredPayouts.filter(p => p.status === "ready");
    const readyAmount = readyPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const readyCount = readyPayouts.length;

    const scheduledPayouts = filteredPayouts.filter(p => p.status === "scheduled");
    const scheduledAmount = scheduledPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const scheduledCount = scheduledPayouts.length;

    const processedPayouts = filteredPayouts.filter(p => p.status === "processed");
    const processedAmount = processedPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const processedCount = processedPayouts.length;

    const paidPayouts = filteredPayouts.filter(p => p.status === "paid");
    const paidAmount = paidPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const paidCount = paidPayouts.length;

    const canceledPayouts = filteredPayouts.filter(p => p.status === "canceled");
    const canceledAmount = canceledPayouts.reduce((sum, payout) => sum + payout.amount, 0);
    const canceledCount = canceledPayouts.length;

    return {
      total: { amount: totalPayouts, count: totalCount },
      ready: { amount: readyAmount, count: readyCount },
      scheduled: { amount: scheduledAmount, count: scheduledCount },
      processed: { amount: processedAmount, count: processedCount },
      paid: { amount: paidAmount, count: paidCount },
      canceled: { amount: canceledAmount, count: canceledCount }
    };
  };

  const statistics = getStatistics();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <PayoutsStatistics statistics={statistics} />

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payouts</CardTitle>
              <CardDescription>Manage payments to service providers and staff</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  handleCloseCreateDialog();
                } else {
                  saveScrollPosition();
                  setIsCreateDialogOpen(true);
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Payout
                  </Button>
                </DialogTrigger>
              </Dialog>
              
              {selectedPayouts.length > 0 && (
                <Button onClick={handleBatchProcess} variant="outline">
                  Process Payouts ({selectedPayouts.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <PayoutsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            recipientFilter={recipientFilter}
            setRecipientFilter={setRecipientFilter}
            dateRangeFilter={dateRangeFilter}
            setDateRangeFilter={setDateRangeFilter}
            recipientSearchOpen={recipientSearchOpen}
            setRecipientSearchOpen={setRecipientSearchOpen}
            recipientSearchValue={recipientSearchValue}
            setRecipientSearchValue={setRecipientSearchValue}
            allRecipients={allRecipients}
            handleCustomDateRangeChange={handleCustomDateRangeChange}
            clearAllFilters={clearAllFilters}
          />

          {/* Payouts Table */}
          <PayoutsTable
            paginatedPayouts={paginatedPayouts}
            selectedPayouts={selectedPayouts}
            setSelectedPayouts={setSelectedPayouts}
            handleEditPayout={handleEditPayout}
            handleDeletePayout={handleDeletePayout}
            handleUserProfileClick={handleUserProfileClick}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <PayoutsModals
        isEditDialogOpen={isEditDialogOpen}
        isCreateDialogOpen={isCreateDialogOpen}
        editingPayout={editingPayout}
        newPayout={newPayout}
        setNewPayout={setNewPayout}
        cancelationNotes={cancelationNotes}
        setCancelationNotes={setCancelationNotes}
        showCancelationNotes={showCancelationNotes}
        setShowCancelationNotes={setShowCancelationNotes}
        allRecipients={allRecipients}
        handleCloseEditDialog={handleCloseEditDialog}
        handleCloseCreateDialog={handleCloseCreateDialog}
        handleSavePayout={handleSavePayout}
        handleProcessNow={handleProcessNow}
        handleCancelPayout={handleCancelPayout}
      />

      <UserProfilePanel 
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default PayoutsPage;
