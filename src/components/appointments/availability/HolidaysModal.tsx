
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface HolidaysModalProps {
  open: boolean;
  holidays: string[];
  availabilityIndex: number;
  onClose: () => void;
  onRemove: (index: number) => void;
}

export const HolidaysModal = ({ 
  open, 
  holidays, 
  availabilityIndex, 
  onClose, 
  onRemove 
}: HolidaysModalProps) => (
  <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
    <DialogContent className="max-w-xs">
      <DialogHeader>
        <DialogTitle>Holidays</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pb-2">
        {holidays.length === 0
          ? <div className="text-gray-400 py-8 text-center">No holidays</div>
          : holidays.map((date, i) => (
            <div key={date} className="flex items-center justify-between bg-muted rounded px-2 py-1">
              <span className="text-xs font-mono">{date}</span>
              <Button size="icon" variant="ghost" className="p-1" onClick={() => onRemove(i)}>
                <X size={15} />
              </Button>
            </div>
          ))}
      </div>
      <DialogFooter>
        <Button onClick={onClose} className="w-full">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
