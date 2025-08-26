import React, { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Copy, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UTMData {
  id: string;
  campaignName: string;
  domain: string;
  targetPage: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  shortenedUrls: ShortenedUrl[];
}

interface ShortenedUrl {
  id: string;
  path: string;
}

interface UTMBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string;
  campaignName: string;
  utmData?: UTMData[];
  onSave: (campaignId: string, utmData: UTMData[]) => void;
}

const DOMAIN_OPTIONS = [
  "domain.com",
  "company.co",
  "business.org",
  "marketing.io",
  "growth.net"
];

const UTMBuilderModal: React.FC<UTMBuilderModalProps> = ({
  open,
  onOpenChange,
  campaignId,
  campaignName,
  utmData = [],
  onSave
}) => {
  const { toast } = useToast();
  const [utmList, setUtmList] = useState<UTMData[]>(
    utmData.length > 0 ? utmData : [{
      id: '1',
      campaignName: campaignName,
      domain: DOMAIN_OPTIONS[0],
      targetPage: '',
      source: '',
      medium: '',
      campaign: '',
      content: '',
      term: '',
      shortenedUrls: []
    }]
  );

  const generateFullUrl = useCallback((utm: UTMData): string => {
    const baseUrl = `https://${utm.domain}${utm.targetPage.startsWith('/') ? utm.targetPage : `/${utm.targetPage}`}`;
    const params = new URLSearchParams();
    
    if (utm.source) params.append('utm_source', utm.source);
    if (utm.medium) params.append('utm_medium', utm.medium);
    if (utm.campaign) params.append('utm_campaign', utm.campaign);
    if (utm.content) params.append('utm_content', utm.content);
    if (utm.term) params.append('utm_term', utm.term);
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  }, []);

  const generateShortenedUrl = useCallback((domain: string, path: string): string => {
    return `https://${domain}/${path}`;
  }, []);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  }, [toast]);

  const openUrl = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  const updateUTM = useCallback((index: number, field: keyof UTMData, value: string) => {
    setUtmList(prev => prev.map((utm, i) => 
      i === index ? { ...utm, [field]: value } : utm
    ));
  }, []);

  const addUTM = useCallback(() => {
    setUtmList(prev => [...prev, {
      id: Date.now().toString(),
      campaignName: campaignName,
      domain: DOMAIN_OPTIONS[0],
      targetPage: '',
      source: '',
      medium: '',
      campaign: '',
      content: '',
      term: '',
      shortenedUrls: []
    }]);
  }, [campaignName]);

  const removeUTM = useCallback((index: number) => {
    setUtmList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addShortenedUrl = useCallback((utmIndex: number) => {
    setUtmList(prev => prev.map((utm, i) => 
      i === utmIndex ? {
        ...utm,
        shortenedUrls: [...utm.shortenedUrls, {
          id: Date.now().toString(),
          path: ''
        }]
      } : utm
    ));
  }, []);

  const updateShortenedUrl = useCallback((utmIndex: number, urlIndex: number, path: string) => {
    setUtmList(prev => prev.map((utm, i) => 
      i === utmIndex ? {
        ...utm,
        shortenedUrls: utm.shortenedUrls.map((url, j) => 
          j === urlIndex ? { ...url, path } : url
        )
      } : utm
    ));
  }, []);

  const removeShortenedUrl = useCallback((utmIndex: number, urlIndex: number) => {
    setUtmList(prev => prev.map((utm, i) => 
      i === utmIndex ? {
        ...utm,
        shortenedUrls: utm.shortenedUrls.filter((_, j) => j !== urlIndex)
      } : utm
    ));
  }, []);

  const handleSave = useCallback(() => {
    onSave(campaignId, utmList);
    onOpenChange(false);
  }, [campaignId, utmList, onSave, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-background border">
        <DialogHeader>
          <DialogTitle>UTM Builder - {campaignName}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {utmList.map((utm, utmIndex) => (
              <div key={utm.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">UTM Configuration {utmIndex + 1}</h4>
                  {utmList.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeUTM(utmIndex)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`campaignName-${utmIndex}`}>Campaign Name</Label>
                    <Input
                      id={`campaignName-${utmIndex}`}
                      value={utm.campaignName}
                      onChange={(e) => updateUTM(utmIndex, 'campaignName', e.target.value)}
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`domain-${utmIndex}`}>Domain</Label>
                    <Select value={utm.domain} onValueChange={(value) => updateUTM(utmIndex, 'domain', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-md z-50">
                        {DOMAIN_OPTIONS.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`targetPage-${utmIndex}`}>Target Page</Label>
                    <Input
                      id={`targetPage-${utmIndex}`}
                      value={utm.targetPage}
                      onChange={(e) => updateUTM(utmIndex, 'targetPage', e.target.value)}
                      placeholder="/page1/"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`source-${utmIndex}`}>UTM Source</Label>
                    <Input
                      id={`source-${utmIndex}`}
                      value={utm.source}
                      onChange={(e) => updateUTM(utmIndex, 'source', e.target.value)}
                      placeholder="website, facebook, google"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`medium-${utmIndex}`}>UTM Medium</Label>
                    <Input
                      id={`medium-${utmIndex}`}
                      value={utm.medium}
                      onChange={(e) => updateUTM(utmIndex, 'medium', e.target.value)}
                      placeholder="organic, cpc, email"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`campaign-${utmIndex}`}>UTM Campaign</Label>
                    <Input
                      id={`campaign-${utmIndex}`}
                      value={utm.campaign}
                      onChange={(e) => updateUTM(utmIndex, 'campaign', e.target.value)}
                      placeholder="spring_sale, product_launch"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`content-${utmIndex}`}>UTM Content</Label>
                    <Input
                      id={`content-${utmIndex}`}
                      value={utm.content}
                      onChange={(e) => updateUTM(utmIndex, 'content', e.target.value)}
                      placeholder="logolink, textlink"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`term-${utmIndex}`}>UTM Term</Label>
                    <Input
                      id={`term-${utmIndex}`}
                      value={utm.term}
                      onChange={(e) => updateUTM(utmIndex, 'term', e.target.value)}
                      placeholder="running+shoes"
                    />
                  </div>
                </div>

                <div>
                  <Label>Generated URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={generateFullUrl(utm)}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openUrl(generateFullUrl(utm))}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(generateFullUrl(utm), "URL")}
                      className="h-10 w-10 flex-shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Shortened URLs</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShortenedUrl(utmIndex)}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Shortened URL
                    </Button>
                  </div>
                  
                  {utm.shortenedUrls.map((shortenedUrl, urlIndex) => (
                    <div key={shortenedUrl.id} className="flex items-center gap-2 mb-2">
                      <div className="flex-1 flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">https://{utm.domain}/</span>
                        <Input
                          value={shortenedUrl.path}
                          onChange={(e) => updateShortenedUrl(utmIndex, urlIndex, e.target.value)}
                          placeholder="fb"
                          className="flex-1"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openUrl(generateShortenedUrl(utm.domain, shortenedUrl.path))}
                        className="h-10 w-10 flex-shrink-0"
                        disabled={!shortenedUrl.path}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(generateShortenedUrl(utm.domain, shortenedUrl.path), "Shortened URL")}
                        className="h-10 w-10 flex-shrink-0"
                        disabled={!shortenedUrl.path}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeShortenedUrl(utmIndex, urlIndex)}
                        className="h-10 w-10 flex-shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addUTM}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another UTM Configuration
            </Button>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save UTM Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UTMBuilderModal;