
// src/components/layout/main-layout.tsx
"use client";
import React, { useContext, useEffect, useState } from "react";
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, useSidebar, SidebarFooter } from "@/components/ui/sidebar";
import Link from "next/link";
import { Home, Shield, PhoneCall, FileText, MessageSquare, BookUser, Gavel, SearchCheck, LifeBuoy, MenuIcon, BotIcon, Scale, Globe, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { LanguageContext, languages, LanguageDirection, Translations } from '@/contexts/language-context';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  labelKey: keyof Translations['nav'];
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItemKeys = {
  dashboard: "dashboard" as keyof Translations['nav'],
  messageScamCheck: "messageScamCheck" as keyof Translations['nav'],
  callShield: "callShield" as keyof Translations['nav'],
  documentFraudCheck: "documentFraudCheck" as keyof Translations['nav'],
  legalAssistant: "legalAssistant" as keyof Translations['nav'],
  legalResources: "legalResources" as keyof Translations['nav'],
  customsHelp: "customsHelp" as keyof Translations['nav'],
  legalRightsInfo: "legalRightsInfo" as keyof Translations['nav'],
  misinfoDebunker: "misinfoDebunker" as keyof Translations['nav'],
  emergencyMode: "emergencyMode" as keyof Translations['nav'],
};

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile, state: sidebarState } = useSidebar(); 
  const [clientHasMounted, setClientHasMounted] = React.useState(false);
  const { language, setLanguage, translate, textDirection } = useContext(LanguageContext)!;

  const navItems: NavItem[] = [
    { href: "/", labelKey: navItemKeys.dashboard, icon: <Home size={20} /> },
    { href: "/scam-protection", labelKey: navItemKeys.messageScamCheck, icon: <Shield size={20} /> },
    { href: "/call-shield", labelKey: navItemKeys.callShield, icon: <PhoneCall size={20} /> },
    { href: "/document-check", labelKey: navItemKeys.documentFraudCheck, icon: <FileText size={20} /> },
    { href: "/legal-assistant", labelKey: navItemKeys.legalAssistant, icon: <MessageSquare size={20} /> },
    { 
      href: "/legal", 
      labelKey: navItemKeys.legalResources, 
      icon: <Scale size={20} />,
      children: [
        { href: "/legal/customs-help", labelKey: navItemKeys.customsHelp, icon: <BookUser size={18} /> },
        { href: "/legal/legal-rights", labelKey: navItemKeys.legalRightsInfo, icon: <Gavel size={18} /> },
      ]
    },
    { href: "/misinformation-debunker", labelKey: navItemKeys.misinfoDebunker, icon: <SearchCheck size={20} /> },
    { href: "/emergency", labelKey: navItemKeys.emergencyMode, icon: <LifeBuoy size={20} /> },
  ];

  useEffect(() => {
    setClientHasMounted(true);
  }, []);

  if (!clientHasMounted || !language) { 
    return null; 
  }
  
  return (
    <>
      <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-sidebar-border shadow-md">
        <SidebarHeader className="p-4 flex items-center justify-between h-[57px]">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <BotIcon className="w-7 h-7 text-sidebar-primary" />
            <h1 className="text-2xl font-headline font-bold text-sidebar-foreground">{translate('droitBot')}</h1>
          </Link>
          <Link href="/" className="hidden items-center gap-2 group-data-[collapsible=icon]:flex">
             <BotIcon className="w-7 h-7 text-sidebar-primary" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton 
                    className={cn(
                        "w-full justify-start text-sm min-h-[44px]",
                        (item.children ? pathname.startsWith(item.href) : pathname === item.href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    tooltip={isMobile || sidebarState === 'collapsed' ? {children: translate(`nav.${item.labelKey}`), side: textDirection === LanguageDirection.RTL ? "left" : "right", align: "center"} : undefined}
                    isActive={item.children ? pathname.startsWith(item.href) : pathname === item.href}
                    >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="group-data-[collapsible=icon]:hidden">{translate(`nav.${item.labelKey}`)}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
                {item.children && (
                  <SidebarMenuSub>
                    {item.children.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.href}>
                        <Link href={subItem.href}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={pathname === subItem.href}
                            className="min-h-[40px]"
                           >
                            <div className="flex items-center gap-2">
                              {subItem.icon}
                              <span className="group-data-[collapsible=icon]:hidden">{translate(`nav.${subItem.labelKey}`)}</span>
                            </div>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <SidebarFooter className="p-2 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 min-h-[44px]">
                  <Globe size={18} className="text-sidebar-foreground/80"/>
                  <span className="group-data-[collapsible=icon]:hidden ml-2 flex-1 text-left">{languages.find(l => l.code === language)?.name || 'Language'}</span>
                  <ChevronDown size={16} className="group-data-[collapsible=icon]:hidden ml-auto text-sidebar-foreground/60"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[--sidebar-width_var] group-data-[collapsible=icon]:w-auto mb-1">
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shadow-sm">
            <SidebarTrigger className="block md:hidden" aria-label={translate('nav.toggleSidebar')}>
                 <MenuIcon />
            </SidebarTrigger>
            <div className={cn("flex-1 flex", textDirection === LanguageDirection.RTL ? "justify-end" : "justify-start")}>
              <h1 className="text-xl font-headline font-semibold md:hidden">
                {navItems.flatMap(i => i.children ? [i, ...i.children] : [i]).find(item => item.href === pathname)?.labelKey ? translate(`nav.${navItems.flatMap(i => i.children ? [i, ...i.children] : [i]).find(item => item.href === pathname)!.labelKey}`) : translate('droitBot')}
              </h1>
            </div>
             <div className="md:hidden">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={translate('nav.changeLanguage')}>
                    <Globe size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map(lang => (
                    <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </header>
        <main className={cn("flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-background")}>
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen> 
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
