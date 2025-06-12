import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BotIcon, Shield, PhoneCall, FileText, MessageSquare, BookUser, Gavel, SearchCheck, LifeBuoy, Scale } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  { name: "Message Scam Check", href: "/scam-protection", icon: <Shield className="w-6 h-6 text-primary" />, description: "Analyze messages for potential scams." },
  { name: "Call Shield", href: "/call-shield", icon: <PhoneCall className="w-6 h-6 text-primary" />, description: "Detect scam tactics in phone calls." },
  { name: "Document Fraud Check", href: "/document-check", icon: <FileText className="w-6 h-6 text-primary" />, description: "Scan documents for signs of fraud." },
  { name: "Legal Assistant", href: "/legal-assistant", icon: <MessageSquare className="w-6 h-6 text-primary" />, description: "Ask legal questions in Tunisian Arabic." },
  { 
    name: "Legal Resources", 
    href: "/legal", 
    icon: <Scale className="w-6 h-6 text-primary" />, 
    description: "Access customs help and legal rights information.",
    subFeatures: [
      { name: "Customs Help", href: "/legal/customs-help", icon: <BookUser className="w-5 h-5 text-primary" />, description: "Get checklists for customs procedures." },
      { name: "Legal Rights Info", href: "/legal/legal-rights", icon: <Gavel className="w-5 h-5 text-primary" />, description: "Summaries of your legal rights." },
    ] 
  },
  { name: "Misinfo Debunker", href: "/misinformation-debunker", icon: <SearchCheck className="w-6 h-6 text-primary" />, description: "Verify news and debunk misinformation." },
  { name: "Emergency Mode", href: "/emergency", icon: <LifeBuoy className="w-6 h-6 text-destructive" />, description: "Quick actions for high-risk situations." },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full py-8">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <BotIcon className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary">Welcome to DroitBot</CardTitle>
          <CardDescription className="text-lg text-foreground/80 mt-2">
            Your AI-powered assistant for navigating legal matters and staying safe from scams in Tunisia.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link href={feature.href} key={feature.name} className="block h-full">
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full flex flex-col bg-card hover:bg-card/90">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {feature.icon}
                    <CardTitle className="text-lg font-headline">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    {feature.subFeatures && (
                      <ul className="mt-2 space-y-1">
                        {feature.subFeatures.map(sub => (
                          <li key={sub.name} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            {sub.icon} {sub.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                     <Button variant="link" className="p-0 h-auto text-primary">
                        Go to {feature.name.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="mt-12 text-center w-full max-w-4xl">
        <Image 
          src="https://imageio.forbes.com/specials-images/imageserve/67570107c7d0745491b2ef68/Robot-Hand-AI-Lady-Justice-Statue/960x0.jpg?format=jpg&width=960" 
          alt="Stylized Tunisian landscape or legal symbols"
          width={800} 
          height={300} 
          className="rounded-lg shadow-lg object-cover w-full h-auto" 
        />
      </div>
    </div>
  );
}
