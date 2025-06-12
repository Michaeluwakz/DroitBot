// src/app/legal/legal-rights/_components/legal-rights-client.tsx
"use client";

import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Gavel, FileText as FileTextIcon, AlertCircle, Languages } from "lucide-react";
import { legalRightsSummaries, LegalRightsSummariesOutput } from "@/ai/flows/legal-rights-summaries";
import { LanguageContext, LanguageDirection } from '@/contexts/language-context';

type SupportedLanguage = 'en' | 'fr' | 'ar';

export default function LegalRightsClient() {
  const [topic, setTopic] = useState("");
  const [country, setCountry] = useState("Tunisia"); 
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<LegalRightsSummariesOutput | null>(null);
  const { translate, textDirection } = useContext(LanguageContext)!;


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic.trim()) {
      setError(translate("alerts.noTopicError"));
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await legalRightsSummaries({ topic, country: country || "Tunisia", language: selectedLanguage });
      setOutput(result);
    } catch (e: any)      {
      setError(e.message || translate("alerts.analysisError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{translate("pageTitles.legalRightsInfo")}</CardTitle>
          <CardDescription>
             {translate("text.legalRightsDescription")} {translate("text.selectLanguagePrompt")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language-select-legal-rights" className="font-semibold flex items-center">
                <Languages className="mr-2 h-5 w-5 text-primary" /> {translate("labels.languageSelection")}
              </Label>
              <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)} dir={textDirection}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ar">{translate("labels.tunisianArabic")}</TabsTrigger>
                  <TabsTrigger value="fr">{translate("labels.french")}</TabsTrigger>
                  <TabsTrigger value="en">{translate("labels.english")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic-legal" className="font-semibold">{translate("labels.legalTopic")}</Label>
              <Input
                id="topic-legal"
                placeholder={translate("placeholders.legalTopicPlaceholder")}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="border-input focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country-legal" className="font-semibold">{translate("labels.countryOptional")}</Label>
              <Input
                id="country-legal"
                placeholder={translate("placeholders.countryPlaceholder")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
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
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Gavel className="mr-2 h-4 w-4" />}
              {translate("buttons.getSummary")}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {output && !error && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <FileTextIcon className="mr-2 h-6 w-6 text-primary" />
              {translate("results.legalRightsSummaryForTopic")}
            </CardTitle>
            <CardDescription>{translate("labels.legalTopic")}: <span className="text-accent">{topic}</span> {country && `(${translate("labels.countryOptional")}: ${country})`} - {translate("labels.responseIn")} {translate(`labels.${selectedLanguage === 'ar' ? 'tunisianArabic' : selectedLanguage === 'fr' ? 'french' : 'english'}`)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              <p>{output.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
