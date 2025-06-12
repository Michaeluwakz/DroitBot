// src/app/misinformation-debunker/_components/misinformation-debunker-client.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, SearchCheck, LinkIcon, Lightbulb, LightbulbOff, AlertCircle } from "lucide-react";
import { debunkMisinformation, DebunkMisinformationOutput } from "@/ai/flows/misinformation-debunker";

export default function MisinformationDebunkerClient() {
  const [newsContent, setNewsContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<DebunkMisinformationOutput | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsContent.trim()) {
      setError("Please enter the news content to debunk.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const result = await debunkMisinformation({ newsContent });
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "An error occurred during debunking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Misinformation Debunker</CardTitle>
          <CardDescription>
            Paste news content (especially political or health-related) to check if it's viral fake news. The AI will explain why it might be false and provide trusted sources.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="news-content" className="font-semibold">News Content</Label>
              <Textarea
                id="news-content"
                placeholder="Paste the news article or statement here..."
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                rows={8}
                className="border-input focus:ring-primary"
              />
            </div>
             {error && !loading && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchCheck className="mr-2 h-4 w-4" />}
              Debunk
            </Button>
          </CardFooter>
        </form>
      </Card>

      {output && !error && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
                {output.isMisinformation ? <LightbulbOff className="mr-2 h-6 w-6 text-destructive" /> : <Lightbulb className="mr-2 h-6 w-6 text-green-500" />}
                Debunking Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Likely Misinformation:</strong> {output.isMisinformation ? "Yes" : "No"}</p>
            <div>
              <h4 className="font-semibold mb-1">Explanation:</h4>
              <p className="text-sm">{output.explanation}</p>
            </div>
            {output.trustedSources.length > 0 && (
              <div>
                <h4 className="font-semibold mb-1 flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5 text-primary" /> Trusted Sources:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {output.trustedSources.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline hover:text-accent/80 break-all">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
