
// src/app/legal-assistant/_components/legal-assistant-client.tsx
"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageSquare, Send, User, BotIcon as Bot, Mic, FileText as FileTextIcon, ListTree, Languages, Database, Search } from "lucide-react";
import { tunisianLegalAssistant, TunisianLegalAssistantOutput, TunisianLegalAssistantInput } from "@/ai/flows/tunisian-legal-assistant";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { LanguageContext, LanguageDirection } from '@/contexts/language-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  retrievedContextSources?: TunisianLegalAssistantOutput['retrievedContextSources'];
}

// Helper type for Genkit flow history
type FlowChatMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export default function LegalAssistantClient() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const [selectedLangTab, setSelectedLangTab] = useState<string>("ar"); 
  const { translate, language: globalLanguage, textDirection } = useContext(LanguageContext)!;
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
        const viewport = scrollAreaViewportRef.current.querySelector('div[style*="min-width: 100%; display: table;"]') as HTMLDivElement;
        if(viewport) {
             viewport.scrollTop = viewport.scrollHeight;
        } else {
             scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    }
  }, [chatHistory]);


  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!query.trim()) {
      return;
    }

    const currentQuery = query;
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: "user", text: currentQuery };
    
    const historyForApi: FlowChatMessage[] = chatHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    setChatHistory(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setError(null);

    try {
      const result = await tunisianLegalAssistant({ query: currentQuery, chatHistory: historyForApi });
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: result.explanation,
        retrievedContextSources: result.retrievedContextSources,
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (e: any) {
      const errorMessageText = e.message || translate("alerts.analysisError");
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), sender: "bot", text: `${translate("alerts.error")}: ${errorMessageText}` };
      setChatHistory(prev => [...prev, errorMessage]);
      setError(errorMessageText);
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
            {translate("pageTitles.legalAssistant")}
        </h1>
        <p className="text-base sm:text-lg text-foreground/80 w-full break-words">
            {translate("text.pageSubtitleLegalAssistant")}
        </p>
         <p className="text-xs text-muted-foreground mt-1">
            Enhanced with RAG from a Qdrant vector store.
        </p>
      </div>

      <Card className="shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
            <Languages className="mr-2 h-5 w-5 flex-shrink-0"/> {translate("labels.languageSelection")}
          </CardTitle>
           <CardDescription className="w-full break-words">
            {translate("text.autoDetectLanguageConcept")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="ar" value={selectedLangTab} onValueChange={setSelectedLangTab} dir={textDirection}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ar">{translate("labels.tunisianArabic")}</TabsTrigger>
              <TabsTrigger value="fr">{translate("labels.french")}</TabsTrigger>
              <TabsTrigger value="en">{translate("labels.english")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      

      <Card className="shadow-lg h-[500px] flex flex-col overflow-hidden">
        <CardHeader className="border-b">
            <CardTitle className="font-headline text-lg sm:text-xl text-primary flex items-center w-full break-words">
            <MessageSquare className="mr-2 h-5 w-5 flex-shrink-0" /> {translate("pageTitles.legalAssistant")}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4" viewportRef={scrollAreaViewportRef}>
            {chatHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot size={64} className="mb-4 text-primary opacity-70 flex-shrink-0" />
                  <p className="w-full break-words">{translate("text.helloLegalAssistant")}</p>
              </div>
            )}
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex mb-4 ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[85%] shadow-sm ${chat.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  <div className="flex items-start gap-2">
                      {chat.sender === 'bot' && <Bot size={20} className="mt-0.5 text-primary flex-shrink-0" />}
                      {chat.sender === 'user' && <User size={20} className="mt-0.5 text-primary-foreground/90 flex-shrink-0" />}
                      
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap break-words w-full">{chat.text}</p>
                        {chat.sender === 'bot' && chat.retrievedContextSources && chat.retrievedContextSources.length > 0 && (
                           <Accordion type="single" collapsible className="w-full mt-2">
                            <AccordionItem value="item-1" className="border-b-0">
                              <AccordionTrigger className="text-xs py-1 hover:no-underline text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:text-accent-foreground">
                                <div className="flex items-center text-xs">
                                  <Database size={12} className="mr-1.5 flex-shrink-0"/> Referenced Sources ({chat.retrievedContextSources.length})
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-1 pb-0">
                                <ScrollArea className="max-h-32 pr-2">
                                  <ul className="space-y-1.5">
                                    {chat.retrievedContextSources.map((source, index) => (
                                      <li key={index} className="text-xs p-1.5 border rounded-md bg-muted/50">
                                        <p className="font-medium text-foreground/80 truncate" title={source.text}>
                                          {source.text.substring(0, 100)}{source.text.length > 100 ? '...' : ''}
                                        </p>
                                        {source.source && <p className="text-muted-foreground text-[0.7rem]">Source: {source.source}</p>}
                                        {source.score !== undefined && <p className="text-muted-foreground text-[0.7rem]">Score: {source.score.toFixed(3)}</p>}
                                      </li>
                                    ))}
                                  </ul>
                                </ScrollArea>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-4">
                  <div className={`p-3 rounded-lg max-w-[85%] bg-card border`}>
                      <div className="flex items-center gap-2">
                          <Bot size={20} className="mt-0.5 text-primary flex-shrink-0" />
                          <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />
                      </div>
                  </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full items-start space-x-2 rtl:space-x-reverse">
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={() => handleMockAction(translate("text.voiceInputLegalAssistant"))} aria-label={translate("text.voiceInputLegalAssistant")}>
                <Mic className="h-5 w-5"/>
            </Button>
            <Textarea
              placeholder={translate("placeholders.legalAssistantMultilingualPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                  }
              }}
              rows={1}
              className="flex-grow resize-none border-input focus:ring-primary min-h-[40px] text-sm"
            />
            <Button type="submit" disabled={loading || !query.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 flex-shrink-0 p-0" aria-label={translate("buttons.sendMessage")}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>
      {error && !loading && (
          <Alert variant="destructive" className="mt-4 overflow-hidden">
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <AlertTitle className="w-full break-words">{translate("alerts.error")}</AlertTitle>
            <AlertDescription className="w-full break-words">{error}</AlertDescription>
          </Alert>
        )}
    </div>
  );
}
