
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ShareEmbedModalProps {
  open: boolean;
  onClose: () => void;
  calendar: any;
}

export function ShareEmbedModal({ open, onClose, calendar }: ShareEmbedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share & Embed "{calendar?.title}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="font-semibold text-sm">Share Link</div>
          <div className="flex gap-2 items-center">
            <Input readOnly value={`https://myapp.com/calendar/${calendar?.id}`} className="flex-1" />
            <Button size="sm" className="ml-2">Copy</Button>
          </div>
          <div className="font-semibold text-sm mt-6">Embed Code</div>
          <Textarea
            rows={2}
            readOnly
            value={`<iframe src="https://myapp.com/calendar/${calendar?.id}/embed" style="width:100%;height:500px;border:none;"></iframe>`}
          />
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
