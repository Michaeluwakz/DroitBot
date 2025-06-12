
// src/app/call-shield/_components/call-shield-client.tsx
"use client";

import React, { useState, useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Loader2, PhoneOff, ShieldCheck, AlertTriangle, FileAudio, Info, ListChecks, Ear, MessageCircleWarning, Ban, BookOpen, Volume2, ShieldAlert, Mic } from "lucide-react";
import { callShield, CallShieldOutput } from "@/ai/flows/call-shield";
import { generateSpeech } from "@/ai/flows/text-to-speech-flow";
import { LanguageContext } from '@/contexts/language-context';
import { useToast } from "@/hooks/use-toast";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Voice IDs for ElevenLabs
const voiceMap = {
  en: '21m00Tcm4TlvDq8ikWAM', // Rachel (Good for English, multilingual model helps with French)
  fr: '21m00Tcm4TlvDq8ikWAM', // Rachel (Relies on eleven_multilingual_v2 for French)
  ar: 'pNInz6obpgDQGcFmaJgB', // Adam (Good for Arabic with eleven_multilingual_v2)
};
type SupportedLanguageForSpeech = keyof typeof voiceMap;


export default function CallShieldClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<CallShieldOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [liveScan, setLiveScan] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);


  const { translate, language } = useContext(LanguageContext)!;
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("audio/")) {
        setError(translate("alerts.invalidFileTypeAudio"));
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      setError(null); 
      setFile(selectedFile);
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
      const callRecordingDataUri = await fileToDataUri(file);
      const result = await callShield({ callRecordingDataUri });
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
  
  const handleTextToSpeech = async (textToRead: string) => {
    if (!textToRead) return;
    setIsSynthesizingSpeech(true);
    try {
      const currentLang = language as SupportedLanguageForSpeech;
      const selectedVoiceId = voiceMap[currentLang] || voiceMap.en; // Fallback to English voice

      const { audioDataUri } = await generateSpeech({ 
        text: textToRead,
        voiceId: selectedVoiceId,
        // modelId can be omitted if the flow has a good default like eleven_multilingual_v2
      });
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioDataUri;
        audioPlayerRef.current.play();
      }
    } catch (speechError: any) {
      toast({
        title: "Speech Generation Failed",
        description: speechError.message || "Could not generate audio.",
        variant: "destructive",
      });
    } finally {
      setIsSynthesizingSpeech(false);
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto py-8 space-y-6">
      <audio ref={audioPlayerRef} className="hidden" />
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-2 w-full break-words">
          {translate("pageTitles.audioShield")}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 w-full break-words">
          {translate("text.pageSubtitleAudioShield")}
        </p>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
            <ShieldCheck className="mr-2 h-6 w-6 flex-shrink-0" /> {translate("labels.liveCallProtection")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Switch id="live-scan" checked={liveScan} onCheckedChange={setLiveScan} disabled />
            <Label htmlFor="live-scan" className="text-sm font-medium w-full break-words">{translate("labels.autoScanAllCalls")}</Label>
          </div>
          <p className="text-xs text-muted-foreground w-full break-words">{translate("text.liveCallPrivacyDisclaimer")}</p>
          <Alert>
            <Info className="h-4 w-4 flex-shrink-0" />
            <AlertTitle className="w-full break-words">{translate("text.realTimeAlertsTitle")}</AlertTitle>
            <AlertDescription className="space-y-1 mt-1 w-full break-words">
                <p className="w-full break-words"><strong>{translate("text.voicePatternDetection")}:</strong> {translate("text.voicePatternDetectionExample")}</p>
                <p className="w-full break-words"><strong>{translate("text.numberCheck")}:</strong> {translate("text.numberCheckExample")}</p>
            </AlertDescription>
          </Alert>
           <p className="text-sm text-muted-foreground w-full break-words">{translate("text.liveProtectionDescription")}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary w-full break-words">{translate("labels.uploadAudioPrompt")}</CardTitle>
          <CardDescription className="w-full break-words">
            {translate("text.audioUploadInstruction")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-file" className="font-semibold w-full break-words">{translate("labels.audioFile")}</Label>
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="border-input focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {file && <p className="text-sm text-muted-foreground w-full break-words">{translate("text.selectedFile")}: {file.name}</p>}
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Button type="button" variant="outline" className="w-full sm:w-auto min-h-[44px]" onClick={() => handleMockAction(translate("buttons.recordAudio"))} disabled>
                    <Mic className="mr-2 h-4 w-4 flex-shrink-0" /> {translate("buttons.recordAudio")}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground w-full break-words">{translate("text.recordAudioDisclaimer")}</p>
            {error && !loading && (
              <Alert variant="destructive" className="overflow-hidden">
                 <PhoneOff className="h-4 w-4 flex-shrink-0" />
                <AlertTitle className="w-full break-words">{translate("alerts.error")}</AlertTitle>
                <AlertDescription className="w-full break-words">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end p-4 md:p-6">
            <Button type="submit" disabled={loading || !file} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" /> : <FileAudio className="mr-2 h-5 w-5 flex-shrink-0" />}
              {translate("buttons.analyzeAudio")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {output && !loading && !error && (
        <Card className="shadow-lg mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
              {output.isScam ? <AlertTriangle className="mr-2 h-6 w-6 text-destructive flex-shrink-0" /> : <ShieldCheck className="mr-2 h-6 w-6 text-green-500 flex-shrink-0" />}
              {translate("labels.audioAnalysisReport")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            {!output.isScam ? (
              <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400 overflow-hidden">
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0" />
                <AlertTitle className="font-semibold w-full break-words">{translate("results.audioSafe")}</AlertTitle>
                <AlertDescription className="w-full break-words">{output.reason || translate("results.noSuspiciousContent")}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="destructive" className="overflow-hidden">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <AlertTitle className="font-bold text-lg w-full break-words">{translate("alerts.suspiciousAudioDetected")}</AlertTitle>
                </Alert>
                <div className="space-y-3 pt-2">
                    <p className="text-sm w-full break-words"><strong className="text-primary">{translate("results.issueDetected")}:</strong> {translate("text.potentialMisinformation")}</p> {/* Example */}
                    <div className="w-full break-words">
                        <strong className="text-primary">{translate("results.analysisDetails")}:</strong>
                         <p className="text-sm text-muted-foreground whitespace-pre-wrap">{output.reason}</p>
                    </div>
                </div>
                 {output.reason &&
                    <Button variant="ghost" size="default" onClick={() => handleTextToSpeech(output.reason)} className="text-primary mt-2 p-2 h-auto" disabled={isSynthesizingSpeech}>
                        {isSynthesizingSpeech ? <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0"/> : <Volume2 className="mr-2 h-4 w-4 flex-shrink-0" />}
                         {translate("buttons.textToSpeech")}
                    </Button>
                }
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {output && output.isScam && !loading && !error && (
         <Card className="shadow-lg mt-6 overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-lg sm:text-xl text-primary w-full break-words">{translate("text.quickActionsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
                <Button onClick={() => handleMockAction(translate("buttons.reportContent"))} className="w-full bg-destructive hover:bg-destructive/90 min-h-[44px]">
                    <MessageCircleWarning className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.reportContent")}
                </Button>
                 <Button variant="outline" onClick={() => handleMockAction(translate("buttons.learnMoreAudioRisks"))} className="w-full min-h-[44px]">
                    <BookOpen className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.learnMoreAudioRisks")}
                </Button>
            </CardContent>
         </Card>
      )}

      {!output && !loading && !error && (
        <Card className="shadow-lg mt-6 overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary w-full break-words">{translate("labels.audioAnalysisReport")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Info size={48} className="mb-4 opacity-50 flex-shrink-0" />
              <p className="w-full break-words">{translate("text.noResultsYetAudio")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
                <ShieldAlert className="mr-2 h-6 w-6 flex-shrink-0"/> {translate("labels.emergencyModeIntegration")}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-2 text-sm text-muted-foreground">
            <p className="w-full break-words">{translate("text.emergencyModeIntegrationDesc")}</p>
            <Alert variant="destructive" className="overflow-hidden">
                <AlertTriangle className="h-4 w-4 flex-shrink-0"/>
                <AlertDescription className="w-full break-words">
                    <strong>{translate("text.emergencyFlashAlert")}</strong>
                </AlertDescription>
            </Alert>
            <ul className="list-disc pl-5 space-y-1">
                <li className="w-full break-words">{translate("text.emergencyActionLocation")}</li>
                <li className="w-full break-words">{translate("text.emergencyActionPoliceCall")}</li>
            </ul>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8 p-4 md:p-6">
        <p className="text-xs text-muted-foreground w-full break-words">
          {translate("text.privacyNoticeAudioAnalysis")}
        </p>
      </div>
    </div>
  );
}

