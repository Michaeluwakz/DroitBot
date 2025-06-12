
// src/app/emergency/_components/emergency-mode-client.tsx
"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, ShieldAlert, ListChecks, Copy, MessageCircleQuestion, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LanguageContext, Translations, LanguageDirection } from '@/contexts/language-context';
import { emergencyAdvisor, EmergencyAdvisorOutput, EmergencyAdvisorInput } from "@/ai/flows/emergency-advisor-flow";

const staticLegalPrompts: Record<keyof Translations['lang'], string[]> = {
  en: [
    'I need to verify this information with official sources before proceeding.',
    'I am not authorized to share that information over the phone/message.',
    'I will consult with a legal advisor before taking any action.',
    'Please provide official documentation that I can verify independently.',
    'I do not make financial decisions under pressure.',
    'This request may be inconsistent with Tunisian law. I need to verify its legality.',
    'I will report any suspicious activity to the relevant authorities.'
  ],
  fr: [
    'Je dois vérifier ces informations auprès de sources officielles avant de continuer.',
    'Je ne suis pas autorisé(e) à partager ces informations par téléphone/message.',
    'Je consulterai un conseiller juridique avant de prendre toute mesure.',
    'Veuillez fournir une documentation officielle que je peux vérifier indépendamment.',
    'Je ne prends pas de décisions financières sous pression.',
    'Cette demande pourrait être contraire à la loi tunisienne. Je dois vérifier sa légalité.',
    'Je signalerai toute activité suspecte aux autorités compétentes.'
  ],
  ar: [
    'نحتاج نثبت من المعلومات هذي من مصادر رسمية قبل ما نعمل أي حاجة.',
    'مانيش مسموحلي باش نبارطاجي المعلومات هاذي بالتليفون/ميساج.',
    'بش نستشير مستشار قانوني قبل ما نعمل أي خطوة.',
    'يرجى تقديم وثائق رسمية نجم نثبت منها وحدي.',
    'ما ناخذش قرارات مالية تحت الضغط.',
    'الطلب هذا يمكن يكون مخالف للقانون التونسي. لازمني نثبت من شرعيته.',
    'بش نبلّغ السلطات المعنية على أي نشاط مشبوه.'
  ]
};

export default function EmergencyModeClient() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [situationDescription, setSituationDescription] = useState("");
  const [aiAdviceOutput, setAiAdviceOutput] = useState<EmergencyAdvisorOutput | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { translate, language, textDirection } = useContext(LanguageContext)!;

  const activateEmergencyMode = () => {
    setIsEmergencyActive(true);
    setShowConfirmation(false);
    setAiAdviceOutput(null);
    setSituationDescription("");
    setAdviceError(null);
    toast({
      title: translate("alerts.emergencyActive"),
      description: translate("text.emergencyActiveToastDesc"),
      variant: "destructive",
      duration: 5000,
    });
  };

  const deactivateEmergencyMode = () => {
    setIsEmergencyActive(false);
    setAiAdviceOutput(null);
    setSituationDescription("");
    toast({
      title: translate("alerts.emergencyDeactivated"),
      description: translate("text.emergencyDeactivatedToastDesc"),
      duration: 3000,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
        title: translate("alerts.promptCopied"),
        description: `"${text.substring(0,30)}..." ${translate("text.copiedToClipboardSuffix")}`,
        duration: 2000,
    });
  }

  const handleGetAIAdvice = async () => {
    if (!situationDescription.trim()) {
        setAdviceError(translate("alerts.noSituationError"));
        return;
    }
    setLoadingAdvice(true);
    setAiAdviceOutput(null);
    setAdviceError(null);
    try {
        const currentLang = language as 'en' | 'fr' | 'ar'; 
        const result = await emergencyAdvisor({ situationDescription, language: currentLang });
        setAiAdviceOutput(result);
    } catch (e: any) {
        setAdviceError(e.message || translate("alerts.analysisError"));
         toast({
            title: translate("alerts.error"),
            description: e.message || translate("alerts.analysisError"),
            variant: "destructive",
        });
    } finally {
        setLoadingAdvice(false);
    }
  };
  
  // This variable is no longer used for rendering the static prompt list directly,
  // as we will now show all languages. It's still used by the AI flow.
  // const currentStaticPrompts = staticLegalPrompts[language as keyof typeof staticLegalPrompts] || staticLegalPrompts.en;


  return (
    <div className="w-full max-w-2xl mx-auto py-8 space-y-6">
      <Card className="shadow-xl bg-destructive/10 border-destructive overflow-hidden">
        <CardHeader className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4 flex-shrink-0" />
          <CardTitle className="font-headline text-2xl sm:text-3xl text-destructive w-full break-words">{translate("pageTitles.emergencyMode")}</CardTitle>
          <CardDescription className="text-destructive/80 w-full break-words">
            {translate("text.emergencyModeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center p-4 md:p-6">
          {!isEmergencyActive ? (
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="lg" className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 min-h-[44px]">
                  <LifeBuoy className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("buttons.activateEmergencyMode")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-background">
                <DialogHeader>
                  <DialogTitle className="font-headline text-primary w-full break-words">{translate("buttons.confirmActivation")}</DialogTitle>
                  <DialogDescription className="text-foreground/80 w-full break-words">
                    {translate("text.emergencyConfirmActivation")}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline" className="min-h-[44px]">{translate("buttons.cancel")}</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={activateEmergencyMode} className="min-h-[44px]">
                    {translate("buttons.yesActivate")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="space-y-6">
              <Alert variant="destructive" className="overflow-hidden">
                <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                <AlertTitle className="w-full break-words">{translate("alerts.emergencyActive")}</AlertTitle>
                <AlertDescription className="w-full break-words">
                  {translate("text.emergencyActiveMessage")}
                </AlertDescription>
              </Alert>

              <Card className="text-left bg-card border-border overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-headline text-lg sm:text-xl flex items-center text-primary w-full break-words">
                    <MessageCircleQuestion className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("labels.describeSituation")}
                  </CardTitle>
                  <CardDescription className="text-card-foreground/80 w-full break-words">{translate("text.describeSituationSubtext")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder={translate("placeholders.situationPlaceholder")}
                    value={situationDescription}
                    onChange={(e) => setSituationDescription(e.target.value)}
                    rows={4}
                    className="border-input focus:ring-primary"
                  />
                  <Button onClick={handleGetAIAdvice} disabled={loadingAdvice || !situationDescription.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
                    {loadingAdvice ? <Loader2 className="mr-2 h-5 w-5 animate-spin flex-shrink-0" /> : <Sparkles className="mr-2 h-5 w-5 flex-shrink-0" />}
                    {translate("buttons.getAIAdvice")}
                  </Button>
                   {adviceError && (
                    <Alert variant="destructive" className="mt-2 overflow-hidden">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <AlertTitle className="w-full break-words">{translate("alerts.error")}</AlertTitle>
                        <AlertDescription className="w-full break-words">{adviceError}</AlertDescription>
                    </Alert>
                    )}
                </CardContent>
              </Card>

              {aiAdviceOutput && !loadingAdvice && (
                <Card className="text-left bg-card border-border mt-4 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg sm:text-xl flex items-center text-primary w-full break-words">
                            <Sparkles className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("labels.aiRecommendations")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-foreground mb-1 w-full break-words">{translate("labels.aiAdvice")}:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap w-full break-words">{aiAdviceOutput.advice}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-1 w-full break-words">{translate("labels.aiSuggestedPrompts")}:</h4>
                            <ul className="space-y-2">
                                {aiAdviceOutput.relevantPrompts.map((prompt, index) => (
                                <li key={`ai-prompt-${index}`} className="text-sm p-3 border rounded-md bg-muted flex justify-between items-center">
                                    <span className="text-muted-foreground flex-1 w-full break-words">{prompt}</span>
                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(prompt)} className="text-primary hover:text-primary/80 ml-2 h-7 w-7 flex-shrink-0" aria-label={`${translate("buttons.copy")} ${prompt.substring(0,15)}`}>
                                        <Copy size={14} />
                                    </Button>
                                </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-foreground mb-1 w-full break-words">{translate("labels.aiImmediateActions")}:</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {aiAdviceOutput.immediateActions.map((action, index) => (
                                 <li key={`ai-action-${index}`} className="w-full break-words">{action}</li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
              )}

              <Card className="text-left bg-card border-border mt-4 overflow-hidden">
                <CardHeader>
                  <CardTitle className="font-headline text-lg sm:text-xl flex items-center text-primary w-full break-words">
                    <ListChecks className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("text.legalResponseTemplates")}
                  </CardTitle>
                  <CardDescription className="text-card-foreground/80 w-full break-words">{translate("text.useTheseResponses")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {staticLegalPrompts.en.map((_, index) => (
                      <li key={`conceptual-prompt-${index}`} className="p-3 border rounded-md bg-muted space-y-2.5">
                        {/* English Prompt */}
                        <div className="flex justify-between items-start text-sm">
                          <div className="flex-1 flex items-start">
                            <span className="mr-2 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded-sm flex-shrink-0">E</span>
                            <span className="text-muted-foreground w-full break-words">{staticLegalPrompts.en[index]}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(staticLegalPrompts.en[index])} className="text-primary hover:text-primary/80 ml-2 h-7 w-7 flex-shrink-0" aria-label={`${translate("buttons.copy")} (English)`}>
                            <Copy size={14} />
                          </Button>
                        </div>

                        {/* French Prompt */}
                        {staticLegalPrompts.fr[index] && (
                          <div className="flex justify-between items-start text-sm">
                            <div className="flex-1 flex items-start">
                              <span className="mr-2 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-1.5 py-0.5 rounded-sm flex-shrink-0">F</span>
                              <span className="text-muted-foreground w-full break-words">{staticLegalPrompts.fr[index]}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(staticLegalPrompts.fr[index])} className="text-primary hover:text-primary/80 ml-2 h-7 w-7 flex-shrink-0" aria-label={`${translate("buttons.copy")} (Français)`}>
                              <Copy size={14} />
                            </Button>
                          </div>
                        )}

                        {/* Arabic Prompt */}
                        {staticLegalPrompts.ar[index] && (
                          <div className="flex justify-between items-start text-sm" dir={LanguageDirection.RTL}>
                            <div className="flex-1 flex items-start">
                              <span className="ml-2 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-1.5 py-0.5 rounded-sm flex-shrink-0">ع</span>
                              <span className="text-muted-foreground w-full break-words">{staticLegalPrompts.ar[index]}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(staticLegalPrompts.ar[index])} className="text-primary hover:text-primary/80 mr-2 h-7 w-7 flex-shrink-0" aria-label={`${translate("buttons.copy")} (العربية)`}>
                              <Copy size={14} />
                            </Button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button variant="outline" size="lg" onClick={deactivateEmergencyMode} className="border-primary text-primary hover:bg-primary/10 min-h-[44px] mt-4">
                {translate("buttons.deactivateEmergencyMode")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    