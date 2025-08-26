
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import UserProfilePanel from "@/components/userprofile/UserProfilePanel";
import BillingStatistics from "@/components/finance/BillingStatistics";
import BillingFilters from "@/components/finance/BillingFilters";
import BillingTable from "@/components/finance/BillingTable";
import ServiceChargeModal from "@/components/finance/ServiceChargeModal";
import { useBillingData } from "@/hooks/useBillingData";

interface BillingProps {
  dateRange?: string;
  providerFilter?: string;
}

interface ServiceCharge {
  id: string;
  clientName: string;
  serviceProvided: string;
  provider: string;
  dateOfService: string;
  chargeAmount: number;
  status: "unbilled" | "approved" | "paid" | "rejected";
  notes: string;
  rejectionNotes?: string;
  billingCode: string;
  duration: number;
}

const Billing = ({ dateRange = "all-time", providerFilter = "all" }: BillingProps) => {
  const {
    serviceCharges,
    setServiceCharges,
    allProviders,
    serviceTypes,
    durationOptions,
    filterByDateRange,
    calculateChargeAmount
  } = useBillingData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [providerFilterState, setProviderFilterState] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all-time");
  const [customDateRange, setCustomDateRange] = useState<{from?: Date; to?: Date}>({});
  const [selectedCharges, setSelectedCharges] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{name: string; email?: string; phone?: string} | null>(null);
  const [editingCharge, setEditingCharge] = useState<ServiceCharge | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [providerSearchOpen, setProviderSearchOpen] = useState(false);
  const [providerSearchValue, setProviderSearchValue] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [showRejectionNotes, setShowRejectionNotes] = useState(false);
  const itemsPerPage = 20;

  // Scroll position preservation - Enhanced
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
    if (!isDialogOpen && scrollPositionRef.current > 0) {
      restoreScrollPosition();
    }
  }, [isDialogOpen]);

  const [newCharge, setNewCharge] = useState({
    clientName: "",
    serviceProvided: "",
    provider: "",
    dateOfService: "",
    chargeAmount: 0,
    notes: "",
    billingCode: "",
    duration: 60
  });

  const filteredCharges = filterByDateRange(serviceCharges, dateRangeFilter, customDateRange).filter(charge => {
    const matchesSearch = charge.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charge.serviceProvided.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || charge.status === statusFilter;
    const matchesService = serviceFilter === "all" || charge.serviceProvided === serviceFilter;
    const matchesProvider = providerFilterState === "all" || charge.provider === providerFilterState;
    return matchesSearch && matchesStatus && matchesService && matchesProvider;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCharges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCharges = filteredCharges.slice(startIndex, startIndex + itemsPerPage);

  const handleServiceTypeChange = (serviceType: string) => {
    const service = serviceTypes.find(s => s.name === serviceType);
    if (service) {
      setNewCharge(prev => ({
        ...prev,
        serviceProvided: service.name,
        chargeAmount: calculateChargeAmount(prev.duration),
        billingCode: service.code
      }));
    }
  };

  const handleDurationChange = (duration: number) => {
    setNewCharge(prev => ({
      ...prev,
      duration,
      chargeAmount: calculateChargeAmount(duration)
    }));
  };

  const handleSaveCharge = () => {
    if (editingCharge) {
      setServiceCharges(prev => prev.map(charge => 
        charge.id === editingCharge.id 
          ? { ...editingCharge, ...newCharge, rejectionNotes: rejectionNotes || editingCharge.rejectionNotes }
          : charge
      ));
      toast.success("Charge updated successfully");
    } else {
      const charge: ServiceCharge = {
        ...newCharge,
        id: Date.now().toString(),
        status: "unbilled"
      };
      setServiceCharges(prev => [...prev, charge]);
      toast.success("New charge created successfully");
    }
    
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCharge(null);
    setRejectionNotes("");
    setShowRejectionNotes(false);
    setNewCharge({
      clientName: "",
      serviceProvided: "",
      provider: "",
      dateOfService: "",
      chargeAmount: 0,
      notes: "",
      billingCode: "",
      duration: 60
    });
  };

  const handleEditCharge = (charge: ServiceCharge) => {
    saveScrollPosition();
    setEditingCharge(charge);
    setNewCharge({
      clientName: charge.clientName,
      serviceProvided: charge.serviceProvided,
      provider: charge.provider,
      dateOfService: charge.dateOfService,
      chargeAmount: charge.chargeAmount,
      notes: charge.notes,
      billingCode: charge.billingCode,
      duration: charge.duration
    });
    setRejectionNotes(charge.rejectionNotes || "");
    setShowRejectionNotes(!!charge.rejectionNotes);
    setIsDialogOpen(true);
  };

  const handleDeleteCharge = (id: string) => {
    setServiceCharges(prev => prev.filter(charge => charge.id !== id));
    toast.success("Charge deleted successfully");
  };

  const handleBatchApproval = () => {
    if (selectedCharges.length === 0) {
      toast.error("Please select charges to approve");
      return;
    }
    
    setServiceCharges(prev => prev.map(charge => 
      selectedCharges.includes(charge.id) 
        ? { ...charge, status: "approved" as const }
        : charge
    ));
    setSelectedCharges([]);
    toast.success(`${selectedCharges.length} charges approved`);
  };

  const handleApproveCharge = () => {
    if (!editingCharge) return;
    
    setServiceCharges(prev => prev.map(charge => 
      charge.id === editingCharge.id 
        ? { ...charge, status: "approved" as const }
        : charge
    ));
    handleCloseDialog();
    toast.success("Charge approved");
  };

  const handleRejectCharge = () => {
    if (!editingCharge) return;
    
    setServiceCharges(prev => prev.map(charge => 
      charge.id === editingCharge.id 
        ? { ...charge, status: "rejected" as const, rejectionNotes }
        : charge
    ));
    handleCloseDialog();
    toast.success("Charge rejected");
  };

  const handleDisapproveCharge = () => {
    if (!editingCharge) return;
    
    setServiceCharges(prev => prev.map(charge => 
      charge.id === editingCharge.id 
        ? { ...charge, status: "unbilled" as const }
        : charge
    ));
    handleCloseDialog();
    toast.success("Charge disapproved");
  };

  const handleUserProfileClick = (userName: string) => {
    setSelectedUser({ name: userName });
    setIsProfileOpen(true);
  };

  const handleNoteClick = (clientName: string) => {
    window.open(`/records/progress-notes-form?client=${encodeURIComponent(clientName)}`, '_blank');
  };

  const clearAllFilters = () => {
    setStatusFilter("all");
    setServiceFilter("all");
    setProviderFilterState("all");
    setProviderSearchValue("");
  };

  const handleCustomDateRangeChange = (from: Date | undefined, to: Date | undefined) => {
    setCustomDateRange({ from, to });
  };

  return (
    <div className="space-y-6">
      <BillingStatistics filteredCharges={filteredCharges} />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Service Charges</CardTitle>
              <CardDescription>Manage billable services and charges</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open) {
                  handleCloseDialog();
                } else {
                  saveScrollPosition();
                  setIsDialogOpen(true);
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Charge
                  </Button>
                </DialogTrigger>
                <ServiceChargeModal
                  isOpen={isDialogOpen}
                  onClose={handleCloseDialog}
                  editingCharge={editingCharge}
                  newCharge={newCharge}
                  setNewCharge={setNewCharge}
                  serviceTypes={serviceTypes}
                  allProviders={allProviders}
                  durationOptions={durationOptions}
                  rejectionNotes={rejectionNotes}
                  setRejectionNotes={setRejectionNotes}
                  showRejectionNotes={showRejectionNotes}
                  setShowRejectionNotes={setShowRejectionNotes}
                  handleSaveCharge={handleSaveCharge}
                  handleApproveCharge={handleApproveCharge}
                  handleRejectCharge={handleRejectCharge}
                  handleDisapproveCharge={handleDisapproveCharge}
                  handleServiceTypeChange={handleServiceTypeChange}
                  handleDurationChange={handleDurationChange}
                />
              </Dialog>
              
              {selectedCharges.length > 0 && (
                <Button onClick={handleBatchApproval} variant="outline">
                  Approve ({selectedCharges.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BillingFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            serviceFilter={serviceFilter}
            setServiceFilter={setServiceFilter}
            providerFilterState={providerFilterState}
            setProviderFilterState={setProviderFilterState}
            dateRangeFilter={dateRangeFilter}
            setDateRangeFilter={setDateRangeFilter}
            providerSearchOpen={providerSearchOpen}
            setProviderSearchOpen={setProviderSearchOpen}
            providerSearchValue={providerSearchValue}
            setProviderSearchValue={setProviderSearchValue}
            allProviders={allProviders}
            handleCustomDateRangeChange={handleCustomDateRangeChange}
            clearAllFilters={clearAllFilters}
          />

          <BillingTable
            paginatedCharges={paginatedCharges}
            selectedCharges={selectedCharges}
            setSelectedCharges={setSelectedCharges}
            handleEditCharge={handleEditCharge}
            handleDeleteCharge={handleDeleteCharge}
            handleUserProfileClick={handleUserProfileClick}
            handleNoteClick={handleNoteClick}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      <UserProfilePanel 
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Billing;
