
// src/app/document-check/_components/document-check-client.tsx
"use client";

import React, { useState, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileScan, FileWarning, FileCheck2, Camera, Upload, Info, ListChecks, ShieldCheck, Download, Users, FileText as FileTextLucide, ZoomIn, Volume2, Briefcase, Settings2, Eye, MapPin, AlertCircle, Sparkles, FileType2 } from "lucide-react";
import { imagePdfFraudCheck, ImagePdfFraudCheckOutput } from "@/ai/flows/image-pdf-fraud-check";
import { LanguageContext } from '@/contexts/language-context';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const commonScams = [
  { id: "fake_police_report", titleKey: "text.fakePoliceReport", descriptionKey: "text.fakePoliceReportDesc", imageUrl: "https://cdn-icons-png.flaticon.com/128/9338/9338114.png" },
  { id: "property_scam", titleKey: "text.propertyScam", descriptionKey: "text.propertyScamDesc", imageUrl: "https://cdn-icons-png.flaticon.com/128/14424/14424709.png" },
  { id: "customs_duty_fraud", titleKey: "text.customsDutyFraud", descriptionKey: "text.customsDutyFraudDesc", imageUrl: "https://cdn-icons-png.flaticon.com/128/4410/4410015.png" },
];

export default function DocumentCheckClient() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<ImagePdfFraudCheckOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { translate } = useContext(LanguageContext)!;
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/") && selectedFile.type !== "application/pdf") {
        setError(translate("alerts.invalidFileTypeImagePdf"));
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setError(null);
      setFile(selectedFile);
      setOutput(null); // Clear previous results
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError(translate("alerts.uploadFileError"));
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const fileDataUri = await fileToDataUri(file);
      const result = await imagePdfFraudCheck({ fileDataUri, description });
      setOutput(result);
    } catch (e: any) {
      setError(e.message || translate("alerts.analysisError"));
    } finally {
      setLoading(false);
    }
  };

  const handleMockAction = (actionName: string) => {
    toast({
      title: `${actionName} (Action concept)`,
      description: `This action (${actionName.toLowerCase()}) would be implemented here.`,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-2 w-full break-words">
          {translate("pageTitles.documentFraudCheck")}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 w-full break-words">
          {translate("text.pageSubtitleDocumentCheck")}
        </p>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary w-full break-words">{translate("labels.uploadMethods")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button type="button" variant="outline" onClick={() => handleMockAction(translate("buttons.scanWithCamera"))} className="w-full min-h-[44px]">
                    <Camera className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.scanWithCamera")}
                </Button>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full min-h-[44px]">
                    <Upload className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.uploadFromFile")}
                </Button>
            </div>
             <Input
                id="document-file-hidden"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />
            {file && <p className="text-sm text-muted-foreground w-full break-words">{translate("text.selectedFile")}: {file.name}</p>}
            
            <p className="text-sm text-center text-muted-foreground w-full break-words">
                <Volume2 className="inline-block mr-1 h-4 w-4 flex-shrink-0" /> {translate("text.voiceGuidanceDocumentCheck")}
            </p>

            <div className="space-y-2">
              <Label htmlFor="document-description" className="font-semibold w-full break-words">{translate("labels.optionalDescription")}</Label>
              <Textarea
                id="document-description"
                placeholder={translate("placeholders.documentDescriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="border-input focus:ring-primary"
              />
            </div>
            {error && !loading && (
              <Alert variant="destructive" className="overflow-hidden">
                <FileWarning className="h-4 w-4 flex-shrink-0" />
                <AlertTitle className="w-full break-words">{translate("alerts.error")}</AlertTitle>
                <AlertDescription className="w-full break-words">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end p-4 md:p-6">
            <Button type="submit" disabled={loading || !file} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" /> : <FileScan className="mr-2 h-5 w-5 flex-shrink-0" />}
              {translate("buttons.analyzeDocument")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {!output && !loading && !error && (
        <Card className="shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
                <Sparkles className="mr-2 h-6 w-6 flex-shrink-0" /> {translate("labels.aiAnalysis")}
            </CardTitle>
            <CardDescription className="w-full break-words">{translate("results.resultsIn10Seconds")}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Info size={48} className="mb-4 opacity-50 flex-shrink-0" />
              <p className="w-full break-words">{translate("text.noResultsYet")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {output && !loading && !error && (
        <Card className="shadow-lg overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
                    <Sparkles className="mr-2 h-6 w-6 flex-shrink-0" /> {translate("labels.aiAnalysis")}
                </CardTitle>
                 <CardDescription className="w-full break-words">{translate("results.resultsIn10Seconds")}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
                {output.isFraudulent ? (
                <>
                    <Alert variant="destructive" className="overflow-hidden">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <AlertTitle className="font-bold text-lg w-full break-words">{translate("alerts.documentFraudWarning")}</AlertTitle>
                    </Alert>
                    <div className="space-y-3 pt-2">
                        <h3 className="font-semibold text-md w-full break-words">{translate("results.visualAnnotations")}:</h3>
                         <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30">
                            <Image src="https://placehold.co/60x60.png" alt={translate("text.fakeStamp")} data-ai-hint="stamp" width={60} height={60} className="rounded border flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm w-full break-words">{translate("text.fakeStamp")}</p>
                                <p className="text-xs text-muted-foreground w-full break-words">{translate("text.fakeStampDesc")}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30">
                            <Image src="https://placehold.co/60x60.png" alt={translate("text.mismatchedFont")} data-ai-hint="text font" width={60} height={60} className="rounded border flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm w-full break-words">{translate("text.mismatchedFont")}</p>
                                <p className="text-xs text-muted-foreground w-full break-words">{translate("text.mismatchedFontDesc")}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/30">
                            <Image src="https://placehold.co/60x60.png" alt={translate("text.alteredDate")} data-ai-hint="calendar date" width={60} height={60} className="rounded border flex-shrink-0" />
                            <div>
                                <p className="font-medium text-sm w-full break-words">{translate("text.alteredDate")}</p>
                                <p className="text-xs text-muted-foreground w-full break-words">{translate("text.alteredDateDesc")}</p>
                            </div>
                        </div>
                        <p className="text-sm w-full break-words"><strong className="text-primary">{translate("results.confidence")}:</strong> {(output.confidence * 100).toFixed(0)}%</p>
                        <p className="text-sm w-full break-words"><strong className="text-primary">{translate("results.reason")}:</strong> {output.reason}</p>
                         <p className="text-sm text-destructive-foreground bg-destructive p-2 rounded-md w-full break-words">{translate("text.userScenarioDocCheck", {count: 7})}</p>
                    </div>
                </>
                ) : (
                <>
                    <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400 overflow-hidden">
                        <FileCheck2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <AlertTitle className="font-semibold w-full break-words">{translate("alerts.documentVerified")}</AlertTitle>
                         <AlertDescription className="w-full break-words">{translate("results.documentMatchesOfficial")}</AlertDescription>
                    </Alert>
                    <Button variant="outline" onClick={() => handleMockAction(translate("buttons.saveSecureCopy"))} className="w-full sm:w-auto min-h-[44px]">
                        <ShieldCheck className="mr-2 h-5 w-5 flex-shrink-0" />{translate("buttons.saveSecureCopy")}
                    </Button>
                    <p className="text-xs text-muted-foreground w-full break-words">{translate("text.saveSecureCopyDesc")}</p>
                </>
                )}
          </CardContent>
        </Card>
      )}

      {output && output.isFraudulent && !loading && !error && (
         <Card className="shadow-lg overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-lg sm:text-xl text-primary w-full break-words">{translate("labels.legalActionToolkit")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
                <Button onClick={() => handleMockAction(translate("buttons.reportToPublicProsecutor"))} className="w-full bg-destructive hover:bg-destructive/90 min-h-[44px]">
                    <FileWarning className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.reportToPublicProsecutor")}
                </Button>
                <p className="text-xs text-muted-foreground w-full break-words">{translate("text.reportToPublicProsecutorDesc")}</p>
                <p className="text-xs text-muted-foreground w-full break-words">{translate("text.penalCodeArticle96")}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" onClick={() => handleMockAction(translate("buttons.contactCustoms"))} className="w-full min-h-[44px]">
                        <ShieldCheck className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.contactCustoms")}
                    </Button>
                    <Button variant="outline" onClick={() => handleMockAction(translate("buttons.contactJudicialPolice"))} className="w-full min-h-[44px]">
                         <Users className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.contactJudicialPolice")}
                    </Button>
                </div>
                <div className="flex items-center text-sm text-muted-foreground pt-2">
                    <MapPin className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                    <p className="w-full break-words">{translate("text.scamMapDocCheck", {count: 12})}</p>
                </div>
            </CardContent>
         </Card>
      )}

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
            <ListChecks className="mr-2 h-6 w-6 flex-shrink-0" /> {translate("labels.commonScamAlerts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {commonScams.map((scam) => (
              <Card key={scam.id} className="bg-muted/50 overflow-hidden w-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-foreground whitespace-normal break-words w-full">{translate(scam.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm p-4">
                  <Image 
                    src={scam.imageUrl} 
                    alt={translate(scam.titleKey)} 
                    width={100} 
                    height={100} 
                    className="rounded border w-full h-auto max-h-[150px] object-contain mx-auto" 
                  />
                  <p className="text-muted-foreground whitespace-normal break-words w-full">{translate(scam.descriptionKey)}</p>
                  <p className="text-xs text-muted-foreground whitespace-normal break-words w-full">{translate("text.sideBySideComparison")}</p>
                  <p className="text-xs text-muted-foreground whitespace-normal break-words w-full">{translate("text.redCircleIndicators")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

    <Card className="shadow-lg overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
                <FileTextLucide className="mr-2 h-6 w-6 flex-shrink-0"/> {translate("labels.preventionHub")}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
            <h3 className="font-semibold text-md w-full break-words">{translate("text.officialTemplates")}:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleMockAction(translate("buttons.downloadPoliceReportTemplate"))} className="w-full min-h-[44px]">
                    <Download className="mr-2 h-4 w-4 flex-shrink-0" /> {translate("text.templatePoliceReport")}
                </Button>
                <Button variant="outline" onClick={() => handleMockAction(translate("buttons.downloadSalesContractTemplate"))} className="w-full min-h-[44px]">
                    <Download className="mr-2 h-4 w-4 flex-shrink-0" /> {translate("text.templateSalesContract")}
                </Button>
            </div>
            <h3 className="font-semibold text-md pt-2 w-full break-words">{translate("text.howToVerifyYourself")}:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li className="w-full break-words">{translate("text.verificationStepQr")}</li>
                <li className="w-full break-words">{translate("text.verificationStepHotline")}</li>
            </ul>
        </CardContent>
    </Card>

    <Card className="shadow-lg overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
                <Eye className="mr-2 h-6 w-6 flex-shrink-0"/> {translate("labels.accessibilityFeatures")}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-2 text-sm text-muted-foreground">
            <p className="w-full break-words"><strong>{translate("text.elderMode")}:</strong> {translate("text.elderModeDesc")}</p>
            <ul className="list-disc pl-5 space-y-1">
                <li className="w-full break-words">{translate("text.magnifyingGlassDesc")}</li>
                <li className="w-full break-words">{translate("text.audioExplanationDesc")}</li>
            </ul>
            <p className="w-full break-words pt-1"><strong>{translate("text.notaryMode")}:</strong> {translate("text.notaryModeDesc")}</p>
             <ul className="list-disc pl-5 space-y-1">
                <li className="w-full break-words">{translate("text.batchScanDesc")}</li>
            </ul>
        </CardContent>
    </Card>
      
      <div className="text-center mt-8 p-4 md:p-6">
        <p className="text-xs text-muted-foreground w-full break-words">
          {translate("text.privacyNoticeDocumentCheck")}
        </p>
      </div>
    </div>
  );
}

