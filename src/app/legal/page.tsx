// src/app/legal/page.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookUser, Gavel, Scale, Users, Landmark, Briefcase, CarIcon as TrafficIcon, ShieldCheckIcon as SocialSecurityIcon } from "lucide-react";
import React, { useContext } from "react";
import { LanguageContext } from "@/contexts/language-context";

const legalFeatures = [
  { nameKey: "customsHelp", href: "/legal/customs-help", icon: <BookUser className="w-8 h-8 text-primary" />, descriptionKey: "featureDescriptionCustomsHelp" },
  { nameKey: "legalRightsInfo", href: "/legal/legal-rights", icon: <Gavel className="w-8 h-8 text-primary" />, descriptionKey: "featureDescriptionLegalRights" },
];

const quickAccessCategories = [
  { nameKey: "familyLaw", icon: <Users className="w-8 h-8 text-primary" /> },
  { nameKey: "propertyRights", icon: <Landmark className="w-8 h-8 text-primary" /> },
  { nameKey: "businessRegulations", icon: <Briefcase className="w-8 h-8 text-primary" /> },
  { nameKey: "trafficLaws", icon: <TrafficIcon className="w-8 h-8 text-primary" /> },
  { nameKey: "socialSecurity", icon: <SocialSecurityIcon className="w-8 h-8 text-primary" /> },
];

export default function LegalPage() {
  const { translate } = useContext(LanguageContext)!;

  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8 space-y-8">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Scale className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary">{translate("pageTitles.legalResources")}</CardTitle>
          <CardDescription className="text-lg text-foreground/80 mt-2">
            {translate("text.droitBotDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legalFeatures.map((feature) => (
              <Link href={feature.href} key={feature.nameKey} className="block h-full">
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col bg-card hover:bg-card/90">
                  <CardHeader className="items-center text-center pb-2">
                    <div className="p-3 bg-primary/10 rounded-full mb-3 w-fit">
                        {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-headline">{translate(`nav.${feature.nameKey}`)}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center">
                    <p className="text-sm text-muted-foreground">{translate(`text.${feature.descriptionKey}`)}</p>
                  </CardContent>
                  <CardFooter className="pt-2 justify-center">
                     <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 min-h-[44px]">
                        {translate("buttons.accessFeature", {featureName: translate(`nav.${feature.nameKey}`).split(" ")[0]})} <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline font-bold text-primary">{translate("pageTitles.quickAccessCategories")}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickAccessCategories.map((category) => (
              <div key={category.nameKey} className="block h-full">
                  <Card className="w-full h-40 transition-shadow duration-200 flex flex-col items-center justify-center text-center p-3 bg-card">
                    <div className="p-2 bg-primary/10 rounded-full mb-2 flex-shrink-0">
                      {category.icon}
                    </div>
                    <p className="text-sm font-medium text-foreground whitespace-normal break-words w-full">
                      {translate(`nav.${category.nameKey}`)}
                    </p>
                  </Card>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
