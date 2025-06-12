
// src/app/customs-help/_components/customs-help-client.tsx
"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, BookUser, ListChecks, LinkIcon, AlertCircle, Clock, Coins, Languages, Info } from "lucide-react";
import { customsBureaucracyHelp, CustomsBureaucracyHelpOutput } from "@/ai/flows/customs-bureaucracy-help";
import { LanguageContext, LanguageDirection } from '@/contexts/language-context';

type SupportedLanguage = 'en' | 'fr' | 'ar';

export default function CustomsHelpClient() {
  const [procedure, setProcedure] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<CustomsBureaucracyHelpOutput | null>(null);
  const { translate, textDirection } = useContext(LanguageContext)!;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!procedure.trim()) {
      setError(translate("alerts.noProcedureError"));
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await customsBureaucracyHelp({ procedure, language: selectedLanguage });
      setOutput(result);
    } catch (e: any) {
      setError(e.message || translate("alerts.analysisError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{translate("pageTitles.customsHelp")}</CardTitle>
          <CardDescription>
            {translate("text.customsHelpDescription")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language-select" className="font-semibold flex items-center">
                <Languages className="mr-2 h-5 w-5 text-primary" /> {translate("labels.languageSelection")}
              </Label>
              <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)} dir={textDirection}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ar">{translate("labels.tunisianArabic")}</TabsTrigger>
                  <TabsTrigger value="fr">{translate("labels.french")}</TabsTrigger>
                  <TabsTrigger value="en">{translate("labels.english")}</TabsTrigger>
                </TabsList>
              </Tabs>
               <p className="text-xs text-muted-foreground">{translate("text.autoDetectLanguageConcept")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedure" className="font-semibold">{translate("labels.procedureName")}</Label>
              <Input
                id="procedure"
                placeholder={translate("placeholders.procedurePlaceholder")}
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="border-input focus:ring-primary"
              />
            </div>
             {error && !loading && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{translate("alerts.error")}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground min-h-[44px]">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookUser className="mr-2 h-4 w-4" />}
              {translate("buttons.getHelp")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {output && !error && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">{translate("results.procedureGuidance")} <span className="text-accent">{procedure}</span> ({translate(`labels.${selectedLanguage === 'ar' ? 'tunisianArabic' : selectedLanguage === 'fr' ? 'french' : 'english'}`)})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-primary" /> {translate("results.checklist")}:
              </h3>
              {output.checklist.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {output.checklist.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{translate("text.noChecklistFound")}</p>
              )}
            </div>

            {output.costEstimate && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-primary" /> {translate("results.estimatedCost")}:
                </h3>
                <p className="text-sm text-muted-foreground">{output.costEstimate}</p>
              </div>
            )}

            {output.timelineEstimate && (
               <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" /> {translate("results.estimatedTimeline")}:
                </h3>
                <p className="text-sm text-muted-foreground">{output.timelineEstimate}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <LinkIcon className="mr-2 h-5 w-5 text-primary" /> {translate("results.officialLinks")}:
              </h3>
              {output.toolResponseMessage && (
                <Alert variant="default" className="mb-2 bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertDescription>{output.toolResponseMessage}</AlertDescription>
                </Alert>
              )}
              {output.officialLinks.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {output.officialLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-accent/80 break-all">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                 !output.toolResponseMessage && <p className="text-sm text-muted-foreground">{translate("text.noOfficialLinksFound")}</p>
              )}
            </div>
            { (output.costEstimate === undefined || output.costEstimate === "") &&
                <p className="text-sm text-muted-foreground">{translate("text.noCostEstimate")}</p>
            }
            { (output.timelineEstimate === undefined || output.timelineEstimate === "") &&
                 <p className="text-sm text-muted-foreground">{translate("text.noTimelineEstimate")}</p>
            }
          </CardContent>
        </Card>
      )}
    </div>
  );
}

