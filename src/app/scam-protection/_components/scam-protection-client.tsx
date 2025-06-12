
// src/app/scam-protection/_components/scam-protection-client.tsx
"use client";

import React, { useState, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { LanguageContext } from '@/contexts/language-context';
import { analyzeMessage, AnalyzeMessageInput, AnalyzeMessageOutput } from "@/ai/flows/real-time-scam-protection";
import { generateSpeech } from "@/ai/flows/text-to-speech-flow";
import { Loader2, ShieldCheck, ShieldAlert, AlertTriangle, Send, Mic, ListChecks, MessageCircleWarning, BookOpen, Volume2, CheckCircle, Info, Copy, PlayCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

// Voice IDs for ElevenLabs
const voiceMap = {
  en: '21m00Tcm4TlvDq8ikWAM', // Rachel (Good for English, multilingual model helps with French)
  fr: '21m00Tcm4TlvDq8ikWAM', // Rachel (Relies on eleven_multilingual_v2 for French)
  ar: 'pNInz6obpgDQGcFmaJgB', // Adam (Good for Arabic with eleven_multilingual_v2)
};
type SupportedLanguageForSpeech = keyof typeof voiceMap;


export default function ScamProtectionClient() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<AnalyzeMessageOutput | null>(null);
  const [autoScan, setAutoScan] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isSynthesizingSpeech, setIsSynthesizingSpeech] = useState(false);

  const { toast } = useToast();
  const { translate, language } = useContext(LanguageContext)!;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      setError(translate("alerts.noMessageError"));
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await analyzeMessage({ message, source: "WHATSAPP" }); 
      setOutput(result);
    } catch (e: any) {
      setError(e.message || translate("alerts.analysisError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    const responseText = translate("text.prewrittenScamResponse");
    navigator.clipboard.writeText(responseText);
    toast({
      title: translate("alerts.textCopied"),
      description: `"${responseText.substring(0,30)}..."`,
    });
  };
  
  const handleReportToAuthorities = () => {
    toast({
      title: translate("buttons.reportToAuthorities") + " (Action concept)",
      description: "Reporting to authorities would be implemented here.",
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

  const handleMockAction = (actionName: string) => {
    toast({
      title: `${actionName} (Action concept)`,
      description: `This action (${actionName.toLowerCase()}) would be implemented here.`,
    });
  };


  return (
    <div className="w-full max-w-2xl mx-auto py-8 md:py-10 space-y-6">
      <audio ref={audioPlayerRef} className="hidden" />
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-2 w-full break-words">
          {translate("pageTitles.messageScamCheck")}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 w-full break-words">
          {translate("text.pageSubtitleScamProtection")}
        </p>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("labels.howToScan")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-content" className="font-semibold break-words w-full">{translate("labels.messageContent")}</Label>
              <Textarea
                id="message-content"
                placeholder={translate("placeholders.pasteMessageOrSelect")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="border-input focus:ring-primary"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" variant="outline" className="w-full sm:w-auto min-h-[44px]" onClick={() => handleMockAction(translate("text.selectFromConversationsAndroid"))} disabled>
                    <ListChecks className="mr-2 h-4 w-4 flex-shrink-0" /> {translate("text.selectFromConversationsAndroid")}
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto min-h-[44px]" onClick={() => handleMockAction(translate("labels.voiceInput"))} disabled>
                    <Mic className="mr-2 h-4 w-4 flex-shrink-0" /> {translate("labels.voiceInput")} 
                </Button>
            </div>
             <p className="text-xs text-muted-foreground break-words w-full">{translate("text.voiceInputDisclaimer")}</p>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch id="auto-scan" checked={autoScan} onCheckedChange={setAutoScan} disabled />
              <Label htmlFor="auto-scan" className="text-sm break-words w-full">{translate("labels.autoScanToggle")}</Label>
            </div>
            <p className="text-xs text-muted-foreground break-words w-full">{translate("labels.autoScanPrivacy")}</p>
          </CardContent>
          <CardFooter className="flex justify-end p-4 md:p-6">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" /> : <Send className="mr-2 h-5 w-5 flex-shrink-0" />}
              {translate("buttons.scanNow")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("labels.recentScamsFeed")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3">
          <Alert variant="destructive" className="overflow-hidden">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="break-words w-full">{translate("text.exampleScamOoredoo")}</AlertDescription>
          </Alert>
          <Alert variant="destructive" className="overflow-hidden">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <AlertDescription className="break-words w-full">{translate("text.exampleScamBank")}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground text-center pt-2 break-words w-full">{translate("text.feedComingSoon")}</p>
        </CardContent>
      </Card>

      {output && !loading && !error && (
        <Card className="shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("results.scanResultsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            {!output.isScam ? (
              <>
                <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400 overflow-hidden">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <AlertTitle className="font-semibold break-words w-full">{translate("results.messageSafe")}</AlertTitle>
                  <AlertDescription className="w-full break-words">{translate("alerts.messageSafe", {lang: "ar"})}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => toast({ title: translate("buttons.reportFalsePositive") + " (Action concept)" })} className="w-full sm:w-auto min-h-[44px]">
                  {translate("buttons.reportFalsePositive")}
                </Button>
              </>
            ) : (
              <>
                <Alert variant="destructive" className="overflow-hidden">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <AlertTitle className="font-bold text-lg break-words w-full">{translate("alerts.highScamProbability")}</AlertTitle>
                </Alert>

                <div className="space-y-3 pt-2">
                  <h3 className="font-semibold text-md break-words w-full">{translate("results.aiBreakdownTitle")}</h3>
                  
                  {output.scamType && (
                    <p className="text-sm break-words w-full">
                      <strong className="text-primary">{translate("results.scamType")}:</strong> {output.scamType}
                    </p>
                  )}
                  {output.confidence !== undefined && (
                     <p className="text-sm break-words w-full">
                        <strong className="text-primary">{translate("results.confidence")}:</strong> {(output.confidence * 100).toFixed(0)}%
                    </p>
                  )}

                  {output.explanation && (
                    <div className="w-full">
                        <strong className="text-primary break-words">{translate("results.redFlagsHighlighted")}:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-muted-foreground">
                            <li className="w-full break-words">{translate("text.redFlagPersonalRequest")}</li>
                            <li className="w-full break-words">{translate("text.redFlagSuspiciousLink")}</li>
                        </ul>
                        {/* <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap break-words w-full">{output.explanation}</p> */}
                    </div>
                  )}

                  <div className="w-full">
                    <strong className="text-primary break-words">{translate("results.legalContextTitle")}:</strong>
                    <p className="text-sm text-muted-foreground mt-1 break-words w-full">{translate("text.legalContextArticle254")}</p>
                  </div>
                </div>
                { (output.explanation || output.scamType) &&
                    <Button variant="ghost" size="default" 
                      onClick={() => handleTextToSpeech( `${output.scamType ? translate("results.scamType") + output.scamType + '.' : ''} ${output.explanation ? translate("results.redFlagsHighlighted") + output.explanation : ''}`)} 
                      className="text-primary mt-2 p-2 h-auto"
                      disabled={isSynthesizingSpeech}
                    >
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
         <Card className="shadow-lg overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("text.quickActionsTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-3">
                <Button onClick={handleReportToAuthorities} className="w-full bg-destructive hover:bg-destructive/90 min-h-[44px]">
                    <MessageCircleWarning className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.reportToAuthorities")}
                </Button>
                <Button variant="outline" onClick={handleCopyResponse} className="w-full min-h-[44px]">
                    <Copy className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.copyPrewrittenResponse")}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full min-h-[44px]">
                        <BookOpen className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.educateMe")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-primary w-full break-words">{translate("dialogTitles.educationalResources")}</DialogTitle>
                      <DialogDescription className="text-foreground/80 w-full break-words">{translate("dialogDescriptions.learnMoreAboutScams")}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                      <h3 className="font-semibold text-foreground w-full break-words">{translate("headings.understandingScamTactics")}</h3>
                      <p className="text-sm text-muted-foreground w-full break-words">
                        {translate("text.scamTacticsExplanation")}
                      </p>
                      <h3 className="font-semibold text-foreground w-full break-words">{translate("headings.watchOurVideoGuide")}</h3>
                      <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-muted-foreground flex-shrink-0" />
                      </div>
                       <p className="text-xs text-muted-foreground w-full break-words">{translate("text.videoPlaceholderDesc")}</p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary" className="min-h-[44px]">{translate("buttons.close")}</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </CardContent>
         </Card>
      )}

       {!output && !loading && !error && (
        <Card className="shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("results.scanResultsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Info size={48} className="mb-4 opacity-50 flex-shrink-0" />
              <p className="break-words w-full">{translate("text.noResultsYet")}</p>
            </div>
          </CardContent>
        </Card>
      )}


      {error && !loading && (
        <Alert variant="destructive" className="overflow-hidden">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <AlertTitle className="break-words w-full">{translate("alerts.error")}</AlertTitle>
          <AlertDescription className="break-words w-full">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("text.communityShield")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3 text-center">
            <p className="text-sm text-muted-foreground mb-3 break-words w-full">{translate("text.communityShieldDescription")}</p>
            <Button variant="outline" className="w-full sm:w-auto min-h-[44px]" onClick={() => handleMockAction(translate("buttons.shareAnonymously"))}>
                <ShieldCheck className="mr-2 h-4 w-4 flex-shrink-0"/> {translate("buttons.shareAnonymously")}
            </Button>
            <p className="text-sm text-muted-foreground mt-3 break-words w-full">{translate("text.scamsReportedThisMonth", { count: 25, location: translate("locales.tunis") })}</p>
            <p className="text-xs text-muted-foreground break-words w-full">{translate("text.scamMapFeatureComingSoon")}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary break-words w-full">{translate("text.preventionTips")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "tipOtp",
              "tipBankSms",
              "tipGovLinks",
              "tipSenderIdentity",
              "tipTooGoodToBeTrue",
            ].map((tipKey) => (
              <Card key={tipKey} className="bg-muted/50 overflow-hidden w-full">
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-foreground whitespace-normal break-words w-full">
                    💡 {translate(`text.${tipKey}`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8 p-4 md:p-6">
        <p className="text-xs text-muted-foreground break-words w-full">
          {translate("text.privacyNoticeScamProtection")}
        </p>
      </div>
    </div>
  );
}

