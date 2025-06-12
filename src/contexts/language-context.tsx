
// src/contexts/language-context.tsx
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export enum LanguageDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export interface Language {
  code: string;
  name: string;
  direction: LanguageDirection;
  nativeName?: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', direction: LanguageDirection.LTR, nativeName: 'English' },
  { code: 'fr', name: 'French', direction: LanguageDirection.LTR, nativeName: 'Français' },
  { code: 'ar', name: 'Arabic (Tunisian)', direction: LanguageDirection.RTL, nativeName: 'العربية (تونسية)' },
];

export interface Translations {
  lang: 'en' | 'fr' | 'ar'; // To help with typed objects
  droitBot: string;
  nav: {
    dashboard: string;
    messageScamCheck: string;
    callShield: string;
    documentFraudCheck: string;
    legalAssistant: string;
    legalResources: string;
    customsHelp: string;
    legalRightsInfo: string;
    misinfoDebunker: string;
    emergencyMode: string;
    toggleSidebar: string;
    changeLanguage: string;
    familyLaw: string;
    propertyRights: string;
    businessRegulations: string;
    trafficLaws: string;
    socialSecurity: string;
  };
  pageTitles: {
    dashboard: string;
    messageScamCheck: string;
    callShield: string; // Will be replaced by audioShield
    audioShield: string;
    documentFraudCheck: string;
    legalAssistant: string;
    legalResources: string;
    customsHelp: string;
    legalRightsInfo: string;
    misinfoDebunker: string;
    emergencyMode: string;
    quickAccessCategories: string;
  };
  buttons: {
    activateEmergencyMode: string;
    confirmActivation: string;
    cancel: string;
    yesActivate: string;
    deactivateEmergencyMode: string;
    copy: string;
    analyzeCall: string; // Will be replaced by analyzeAudio
    analyzeAudio: string;
    getHelp: string;
    analyzeDocument: string;
    getSummary: string;
    debunk: string;
    scanNow: string;
    submitQuery: string;
    startRecording: string; // Kept for general recording concept
    recordAudio: string;
    stopRecording: string;
    uploadRecording: string;
    selectFile: string;
    speak: string;
    sendMessage: string;
    clearChat: string;
    reportFalsePositive: string;
    reportToAuthorities: string;
    copyPrewrittenResponse: string;
    educateMe: string;
    textToSpeech: string;
    shareAnonymously: string;
    reportToPolice: string;
    blockNumber: string;
    educateCallScams: string;
    playAudioSample: string;
    scanWithCamera: string;
    uploadFromFile: string;
    saveSecureCopy: string;
    reportToPublicProsecutor: string;
    contactCustoms: string;
    contactJudicialPolice: string;
    downloadPoliceReportTemplate: string;
    downloadSalesContractTemplate: string;
    seeSteps: string;
    getAIAdvice: string;
    close: string;
    accessFeature: string;
    reportContent: string;
    learnMoreAudioRisks: string;
  };
  labels: {
    callRecording: string; // Will be replaced by audioFile
    audioFile: string;
    procedureName: string;
    documentFile: string;
    optionalDescription: string;
    legalTopic: string;
    countryOptional: string;
    newsContent: string;
    messageContent: string;
    messageSource: string;
    selectSource: string;
    audioTranscript: string;
    queryInTunisianArabic: string;
    language: string;
    yourMessage: string;
    voiceInput: string;
    howToScan: string;
    autoScanToggle: string;
    autoScanPrivacy: string;
    recentScamsFeed: string;
    liveCallProtection: string;
    autoScanAllCalls: string;
    callAnalysisReport: string; // Will be replaced by audioAnalysisReport
    audioAnalysisReport: string;
    knownScamsLibrary: string;
    emergencyModeIntegration: string;
    uploadCallRecordingPrompt: string; // Will be replaced by uploadAudioPrompt
    uploadAudioPrompt: string;
    uploadMethods: string;
    aiAnalysis: string;
    commonScamAlerts: string;
    legalActionToolkit: string;
    preventionHub: string;
    technicalSpecs: string;
    accessibilityFeatures: string;
    languageSelection: string;
    tunisianArabic: string;
    french: string;
    english: string;
    responseIn: string;
    visualAids: string;
    officialGazetteSnippet: string;
    describeSituation: string;
    aiRecommendations: string;
    aiAdvice: string;
    aiSuggestedPrompts: string;
    aiImmediateActions: string;
  };
  placeholders: {
    callRecordingPlaceholder: string; // Will be replaced by audioFilePlaceholder
    audioFilePlaceholder: string;
    procedurePlaceholder: string;
    documentDescriptionPlaceholder: string;
    legalTopicPlaceholder: string;
    countryPlaceholder: string;
    newsContentPlaceholder: string;
    messageContentPlaceholder: string;
    selectSourcePlaceholder: string;
    tunisianArabicPlaceholder: string;
    typeYourMessage: string;
    pasteMessageOrSelect: string;
    legalAssistantMultilingualPlaceholder: string;
    frenchResponsePlaceholder: string;
    englishResponsePlaceholder: string;
    situationPlaceholder: string;
  };
  alerts: {
    error: string;
    unsupportedFileType: string;
    fileTooLarge: string;
    cameraPermissionDenied: string;
    micPermissionDenied: string;
    invalidFileTypeAudio: string;
    invalidFileTypeImagePdf: string;
    uploadFileError: string;
    analysisError: string;
    noProcedureError: string;
    noTopicError: string;
    noContentError: string;
    noMessageError: string;
    noQueryError: string;
    emergencyActive: string;
    emergencyDeactivated: string;
    promptCopied: string;
    textCopied: string;
    highScamProbability: string;
    scamDetected: string; // Kept for general scam concept
    suspiciousAudioDetected: string;
    highRiskScamDetected: string;
    documentFraudWarning: string;
    documentVerified: string;
    noSituationError: string;
  };
  results: {
    analysisResult: string;
    likelyScam: string; // Kept for general scam concept
    reason: string;
    procedureGuidance: string;
    checklist: string;
    estimatedCost: string;
    estimatedTimeline: string;
    officialLinks: string;
    legalRightsSummaryForTopic: string;
    debunkingResult: string;
    explanation: string;
    trustedSources: string;
    scamType: string; // Kept for general scam concept
    issueDetected: string;
    confidence: string;
    messageAnalysisResult: string;
    assistantResponse: string;
    scanResultsTitle: string;
    messageSafe: string;
    aiBreakdownTitle: string;
    redFlagsHighlighted: string; // Kept for general use
    analysisDetails: string;
    legalContextTitle: string;
    safeCall: string; // Will be replaced by audioSafe
    audioSafe: string;
    noScamIndicators: string; // Will be replaced by noSuspiciousContent
    noSuspiciousContent: string;
    resultsIn10Seconds: string;
    visualAnnotations: string;
    documentMatchesOfficial: string;
  };
  text: {
    selectedFile: string;
    noChecklistFound: string;
    noOfficialLinksFound: string;
    noCostEstimate: string;
    noTimelineEstimate: string;
    loading: string;
    micActive: string;
    recording: string;
    speakNow: string;
    privacyNoticeCallShield: string; // Will be replaced
    privacyNoticeAudioAnalysis: string;
    privacyNoticeDocumentCheck: string;
    privacyNoticeScamProtection: string;
    legalDisclaimer: string;
    helloLegalAssistant: string;
    welcomeToDroitBot: string;
    droitBotDescription: string;
    featureDescriptionMessageScam: string;
    featureDescriptionCallShield: string; // Will be replaced
    featureDescriptionAudioShield: string;
    featureDescriptionDocumentCheck: string;
    featureDescriptionLegalAssistant: string;
    featureDescriptionLegalResources: string;
    featureDescriptionCustomsHelp: string;
    featureDescriptionLegalRights: string;
    featureDescriptionMisinfoDebunker: string;
    featureDescriptionEmergency: string;
    goToFeature: string;
    recentScamsFeed: string;
    communityShield: string;
    preventionTips: string;
    reportScamAnonymous: string;
    scamsReportedThisMonth: string;
    scamMapFeatureComingSoon: string;
    howToScan: string;
    selectFromConversationsAndroid: string;
    autoScanNewMessages: string;
    exampleScamOoredoo: string;
    exampleScamBank: string;
    feedComingSoon: string;
    tipOtp: string;
    tipBankSms: string;
    tipGovLinks: string;
    tipSenderIdentity: string;
    tipTooGoodToBeTrue: string;
    callShieldDescription: string; // Will be replaced
    audioShieldDescription: string;
    liveCallProtection: string;
    liveProtectionDescription: string;
    orUploadRecording: string; // Will be replaced
    uploadAudioInstruction: string;
    knownScamsLibrary: string;
    knownScamsLibraryDesc: string;
    scamTypePhishing: string;
    scamTypeImpersonation: string;
    scamTypeTechSupport: string;
    libraryComingSoon: string;
    documentCheckDescription: string;
    uploadMethod: string;
    scanWithCamera: string;
    uploadFromFile: string;
    commonDocumentForgeries: string;
    forgeryTypeFakeInvoice: string;
    forgeryTypeAlteredContract: string;
    forgeryTypeForgedSignature: string;
    legalToolkit: string;
    contactAuthorities: string;
    contactLawyer: string;
    customsHelpDescription: string;
    legalRightsDescription: string;
    legalAssistantHubDescription: string;
    selectLanguagePrompt: string;
    misinfoDebunkerDescription: string;
    emergencyModeDescription: string;
    emergencyModeActiveMessage: string;
    legalResponseTemplates: string;
    useTheseResponses: string;
    legalPromptVerifyOfficial: string;
    legalPromptNotAuthorizedShare: string;
    legalPromptConsultAdvisor: string;
    legalPromptProvideOfficialDoc: string;
    legalPromptNoFinancialPressure: string;
    legalPromptTunisianLawFraud: string;
    legalPromptReportSuspicious: string;
    pageSubtitleScamProtection: string;
    voiceInputDisclaimer: string;
    legalContextArticle254: string;
    quickActionsTitle: string;
    prewrittenScamResponse: string;
    communityShieldDescription: string;
    noResultsYet: string;
    noResultsYetAudio: string;
    pageSubtitleCallShield: string; // Will be replaced
    pageSubtitleAudioShield: string;
    liveCallPrivacyDisclaimer: string;
    realTimeAlertsTitle: string;
    voicePatternDetection: string;
    voicePatternDetectionExample: string;
    numberCheck: string;
    numberCheckExample: string;
    callAnalysisReportTitle: string; // Will be replaced
    audioAnalysisReportTitle: string;
    fakeBankScam: string; // Example, may or may not be relevant for general audio
    potentialMisinformation: string; // Example for general audio
    callerRequestedSensitiveInfo: string;
    unknownSuspiciousNumber: string;
    legalArticle201Bis: string;
    callScamExampleTT: string;
    callScamExampleJudiciary: string;
    callScamExampleFakeJob: string;
    sampleAudioClip: string;
    scriptBreakdown: string;
    howToRespond: string;
    emergencyModeIntegrationDesc: string;
    emergencyFlashAlert: string;
    emergencyActionLocation: string;
    emergencyActionPoliceCall: string;
    callRecordingUploadInstruction: string; // Will be replaced
    defaultScamReason: string; // Will be replaced
    defaultSuspiciousReason: string;
    pageSubtitleDocumentCheck: string;
    voiceGuidanceDocumentCheck: string;
    fakeStamp: string;
    fakeStampDesc: string;
    mismatchedFont: string;
    mismatchedFontDesc: string;
    alteredDate: string;
    alteredDateDesc: string;
    saveSecureCopyDesc: string;
    fakePoliceReport: string;
    fakePoliceReportDesc: string;
    propertyScam: string;
    propertyScamDesc: string;
    customsDutyFraud: string;
    customsDutyFraudDesc: string;
    sideBySideComparison: string;
    redCircleIndicators: string;
    reportToPublicProsecutorDesc: string;
    penalCodeArticle96: string;
    scamMapDocCheck: string;
    officialTemplates: string;
    howToVerifyYourself: string;
    qrCodeCheck: string;
    hotlineNumbers: string;
    localProcessing: string;
    tunisianDocDatabase: string;
    offlineMode: string;
    userScenarioDocCheck: string;
    elderMode: string;
    magnifyingGlass: string;
    audioExplanation: string;
    notaryMode: string;
    batchScan: string;
    threeIndicators: string;
    documentUsedInScams: string;
    localProcessingDesc: string;
    tunisianDocDatabaseDesc: string;
    offlineModeDesc: string;
    templatePoliceReport: string;
    templateSalesContract: string;
    verificationStepQr: string;
    verificationStepHotline: string;
    elderModeDesc: string;
    magnifyingGlassDesc: string;
    audioExplanationDesc: string;
    notaryModeDesc: string;
    batchScanDesc: string;
    pageSubtitleLegalAssistant: string;
    autoDetectLanguageConcept: string;
    voiceInputLegalAssistant: string;
    emergencyConfirmActivation: string;
    emergencyActiveToastDesc: string;
    emergencyDeactivatedToastDesc: string;
    copiedToClipboardSuffix: string;
    describeSituationSubtext: string;
    scamTacticsExplanation: string;
    videoPlaceholderDesc: string;
    recordAudioDisclaimer: string;
  };
  dialogTitles: {
    educationalResources: string;
  };
  dialogDescriptions: {
    learnMoreAboutScams: string;
  };
  headings: {
    understandingScamTactics: string;
    watchOurVideoGuide: string;
  };
  locales: {
    tunis: string;
  }
}

const defaultTranslations: Record<string, Translations> = {
  en: {
    lang: "en",
    droitBot: "DroitBot",
    nav: {
      dashboard: "Dashboard",
      messageScamCheck: "Message Scam Check",
      callShield: "Audio Shield", // Updated
      documentFraudCheck: "Document Fraud Check",
      legalAssistant: "Legal Assistant",
      legalResources: "Legal Resources",
      customsHelp: "Customs Help",
      legalRightsInfo: "Legal Rights Info",
      misinfoDebunker: "Misinfo Debunker",
      emergencyMode: "Emergency Mode",
      toggleSidebar: "Toggle Sidebar",
      changeLanguage: "Change Language",
      familyLaw: "Family Law",
      propertyRights: "Property Rights",
      businessRegulations: "Business Regulations",
      trafficLaws: "Traffic Laws",
      socialSecurity: "Social Security",
    },
    pageTitles: {
      dashboard: "Welcome to DroitBot",
      messageScamCheck: "Message Scam Check",
      callShield: "Call Protection", // Kept for historical consistency if needed, but audioShield is primary
      audioShield: "Audio Shield", // New
      documentFraudCheck: "Document Fraud Check",
      legalAssistant: "Tunisian Legal Assistant",
      legalResources: "Legal Resources",
      customsHelp: "Customs & Bureaucracy Help",
      legalRightsInfo: "Legal Rights Summaries",
      misinfoDebunker: "Misinformation Debunker",
      emergencyMode: "Emergency Mode",
      quickAccessCategories: "Quick Access Categories",
    },
    buttons: {
        activateEmergencyMode: "Activate Emergency Mode",
        confirmActivation: "Confirm Activation",
        cancel: "Cancel",
        yesActivate: "Yes, Activate",
        deactivateEmergencyMode: "Deactivate Emergency Mode",
        copy: "Copy",
        analyzeCall: "Analyze Call", // Kept for historical consistency
        analyzeAudio: "Analyze Audio", // New
        getHelp: "Get Help",
        analyzeDocument: "Analyze Document",
        getSummary: "Get Summary",
        debunk: "Debunk",
        scanNow: "Scan Now",
        submitQuery: "Submit Query",
        startRecording: "Start Recording",
        recordAudio: "Record Audio", // New
        stopRecording: "Stop Recording",
        uploadRecording: "Upload Recording",
        selectFile: "Select File",
        speak: "Speak",
        sendMessage: "Send",
        clearChat: "Clear Chat",
        reportFalsePositive: "False Positive? Report it!",
        reportToAuthorities: "Report to Authorities",
        copyPrewrittenResponse: "Copy Pre-written Response",
        educateMe: "Educate Me",
        textToSpeech: "Read Aloud",
        shareAnonymously: "Share this scam (anonymously)",
        reportToPolice: "Report to Police",
        blockNumber: "Block Number",
        educateCallScams: "How to recognize call scams?",
        playAudioSample: "Play Audio Sample",
        scanWithCamera: "Scan with Camera",
        uploadFromFile: "Upload from File",
        saveSecureCopy: "Save Secure Copy",
        reportToPublicProsecutor: "Report to Public Prosecutor",
        contactCustoms: "Contact Customs",
        contactJudicialPolice: "Contact Judicial Police",
        downloadPoliceReportTemplate: "Download Police Report Template",
        downloadSalesContractTemplate: "Download Sales Contract Template",
        seeSteps: "See steps",
        getAIAdvice: "Get AI Advice",
        close: "Close",
        accessFeature: "Access {{featureName}}",
        reportContent: "Report Content", // New
        learnMoreAudioRisks: "Learn About Audio Risks", // New
    },
    labels: {
        callRecording: "Call Recording (audio file)", // Kept for historical consistency
        audioFile: "Audio File", // New
        procedureName: "Procedure Name",
        documentFile: "Document (Image or PDF)",
        optionalDescription: "Optional Description",
        legalTopic: "Legal Topic",
        countryOptional: "Country (Optional)",
        newsContent: "News Content",
        messageContent: "Message Content",
        messageSource: "Message Source",
        selectSource: "Select source (e.g., WhatsApp)",
        audioTranscript: "Audio Transcript",
        queryInTunisianArabic: "Your query in Tunisian Arabic",
        language: "Language",
        yourMessage: "Your message...",
        voiceInput: "Voice Input",
        howToScan: "How to Scan?",
        autoScanToggle: "Auto-scan new messages",
        autoScanPrivacy: "(Requires notification access with clear privacy disclaimer - Feature concept)",
        recentScamsFeed: "Recent Scams Feed (Live Examples)",
        liveCallProtection: "Live Call Protection",
        autoScanAllCalls: "Auto-scan all calls",
        callAnalysisReport: "Call Analysis Report", // Kept for historical consistency
        audioAnalysisReport: "Audio Analysis Report", // New
        knownScamsLibrary: "Known Scams Library",
        emergencyModeIntegration: "Emergency Mode Integration",
        uploadCallRecordingPrompt: "Or, Upload a Call Recording for Analysis", // Kept for historical consistency
        uploadAudioPrompt: "Upload Audio for Analysis", // New
        uploadMethods: "Upload Methods",
        aiAnalysis: "AI Analysis",
        commonScamAlerts: "Common Tunisian Scam Alerts",
        legalActionToolkit: "Legal Action Toolkit",
        preventionHub: "Prevention Hub",
        technicalSpecs: "Technical Specs",
        accessibilityFeatures: "Accessibility Features",
        languageSelection: "Language Selection",
        tunisianArabic: "Tunisian Arabic",
        french: "French",
        english: "English",
        responseIn: "Response in",
        visualAids: "Visual Aids",
        officialGazetteSnippet: "Official Gazette Snippet (Concept)",
        describeSituation: "Describe Your Situation",
        aiRecommendations: "AI Recommendations",
        aiAdvice: "AI Advice",
        aiSuggestedPrompts: "AI Suggested Prompts",
        aiImmediateActions: "AI Immediate Actions",
    },
    placeholders: {
        callRecordingPlaceholder: "e.g., call_recording.mp3", // Kept for historical consistency
        audioFilePlaceholder: "e.g., audio_file.mp3, recording.wav", // New
        procedurePlaceholder: "e.g., Car import, Passport renewal",
        documentDescriptionPlaceholder: "Briefly describe the document or your concerns (optional)...",
        legalTopicPlaceholder: "e.g., Tenant rights, Employee rights",
        countryPlaceholder: "Defaults to Tunisia if left blank",
        newsContentPlaceholder: "Paste the news article or statement here...",
        messageContentPlaceholder: "Paste the suspicious message here...",
        selectSourcePlaceholder: "Select source",
        tunisianArabicPlaceholder: "أكتب سؤالك هنا باللهجة التونسية...",
        typeYourMessage: "Type your message in {{language}}...",
        pasteMessageOrSelect: "Paste suspicious message here or choose from conversations...",
        legalAssistantMultilingualPlaceholder: "Ask your question in Tunisian Arabic, French, or English...",
        frenchResponsePlaceholder: "[French explanation will appear here]",
        englishResponsePlaceholder: "[English explanation will appear here]",
        situationPlaceholder: "Describe what is happening in detail...",
    },
    alerts: {
        error: "Error",
        unsupportedFileType: "Unsupported file type.",
        fileTooLarge: "File is too large.",
        cameraPermissionDenied: "Camera permission denied. Please enable in browser settings.",
        micPermissionDenied: "Microphone permission denied. Please enable in browser settings.",
        invalidFileTypeAudio: "Invalid file type. Please upload an audio recording.",
        invalidFileTypeImagePdf: "Invalid file type. Please upload an image or PDF document.",
        uploadFileError: "Please upload a file.",
        analysisError: "An error occurred during analysis.",
        noProcedureError: "Please enter the procedure you need help with.",
        noTopicError: "Please enter a legal topic.",
        noContentError: "Please enter the news content to debunk.",
        noMessageError: "Please enter a message and select a source.",
        noQueryError: "Please enter your query.",
        emergencyActive: "Emergency Mode is ACTIVE",
        emergencyDeactivated: "Emergency Mode Deactivated",
        promptCopied: "Prompt Copied!",
        textCopied: "Text Copied!",
        highScamProbability: "Warning: High scam probability!",
        scamDetected: "Scam Detected",
        suspiciousAudioDetected: "Suspicious Audio Detected", // New
        highRiskScamDetected: "High-Risk Scam Detected!",
        documentFraudWarning: "Attention! 3 indicators of forgery!",
        documentVerified: "Document matches official templates.",
        noSituationError: "Please describe your situation to get AI advice.",
    },
    results: {
        analysisResult: "Analysis Result",
        likelyScam: "Likely a Scam",
        reason: "Reason",
        procedureGuidance: "Procedure Guidance for",
        checklist: "Checklist",
        estimatedCost: "Estimated Cost",
        estimatedTimeline: "Estimated Timeline",
        officialLinks: "Official Links",
        legalRightsSummaryForTopic: "Legal Rights Summary for",
        debunkingResult: "Debunking Result",
        explanation: "Explanation",
        trustedSources: "Trusted Sources",
        scamType: "Scam Type",
        issueDetected: "Issue Detected", // New
        confidence: "Confidence",
        messageAnalysisResult: "Message Analysis Result",
        assistantResponse: "Assistant Response",
        scanResultsTitle: "Scan Results",
        messageSafe: "This message looks safe.",
        aiBreakdownTitle: "AI Breakdown",
        redFlagsHighlighted: "Red Flags Highlighted",
        analysisDetails: "Analysis Details", // New
        legalContextTitle: "Legal Context",
        safeCall: "Safe Call", // Kept for historical consistency
        audioSafe: "Audio Appears Safe", // New
        noScamIndicators: "No scam indicators detected.", // Kept
        noSuspiciousContent: "No suspicious content detected.", // New
        resultsIn10Seconds: "Results within 10 seconds",
        visualAnnotations: "Visual Annotations",
        documentMatchesOfficial: "Document matches official templates.",
    },
    text: {
        selectedFile: "Selected",
        noChecklistFound: "No checklist items found for this procedure.",
        noOfficialLinksFound: "No official links found for this procedure.",
        noCostEstimate: "No cost estimate available.",
        noTimelineEstimate: "No timeline estimate available.",
        loading: "Loading...",
        micActive: "Microphone Active",
        recording: "Recording...",
        speakNow: "Speak now...",
        privacyNoticeCallShield: "Your privacy is our priority. Call analysis is processed on your device and recordings are not stored.", // Kept
        privacyNoticeAudioAnalysis: "Your privacy is our priority. Audio analysis is processed on your device and files are not stored long-term.", // New
        privacyNoticeDocumentCheck: "Your privacy is our priority. Document analysis is processed locally on your device when you upload the file and is not stored.",
        privacyNoticeScamProtection: "Scan happens locally on your device. We do not store your messages. Your privacy is our priority.",
        legalDisclaimer: "Disclaimer: This AI provides general information and is not a substitute for professional legal advice. Consult a qualified lawyer for your specific situation.",
        helloLegalAssistant: "Hello! How can I help you today?",
        welcomeToDroitBot: "Welcome to DroitBot",
        droitBotDescription: "Your AI-powered assistant for navigating legal matters and staying safe from scams in Tunisia.",
        featureDescriptionMessageScam: "Analyze messages for potential scams.",
        featureDescriptionCallShield: "Detect scam tactics in phone calls.", // Kept
        featureDescriptionAudioShield: "Analyze audio files for suspicious content.", // New
        featureDescriptionDocumentCheck: "Scan documents for signs of fraud.",
        featureDescriptionLegalAssistant: "Ask legal questions in Tunisian Arabic.",
        featureDescriptionLegalResources: "Access customs help and legal rights information.",
        featureDescriptionCustomsHelp: "Get checklists for customs procedures.",
        featureDescriptionLegalRights: "Summaries of your legal rights.",
        featureDescriptionMisinfoDebunker: "Verify news and debunk misinformation.",
        featureDescriptionEmergency: "Quick actions for high-risk situations.",
        goToFeature: "Go to {{featureName}}",
        recentScamsFeed: "Recent Scams Feed (Tunisia)",
        communityShield: "Community Shield: Report & Alert",
        preventionTips: "Prevention Tips",
        reportScamAnonymous: "Help others by reporting this scam (anonymously)",
        scamsReportedThisMonth: "{{count}} reports this month in {{location}}.",
        scamMapFeatureComingSoon: "(Scam Hotspot Map Feature - Coming Soon)",
        howToScan: "How to Scan?",
        selectFromConversationsAndroid: "Select from conversations (Android only)",
        autoScanNewMessages: "Auto-scan new messages?",
        exampleScamOoredoo: "Warning: 'Free Ooredoo Gift' scam circulating today!",
        exampleScamBank: "Alert: Fake bank account closure SMS reported.",
        feedComingSoon: "(Live feed of user-reported scams - Coming Soon)",
        tipOtp: "Never share OTP codes!",
        tipBankSms: "Banks don't use SMS/WhatsApp for sensitive info requests.",
        tipGovLinks: "Official links end in .gov.tn or .tn.",
        tipSenderIdentity: "Always verify sender identity before replying.",
        tipTooGoodToBeTrue: "If an offer sounds too good to be true, it probably is.",
        callShieldDescription: "Upload a call recording to analyze it for known scam tactics, like requests for OTPs, and get instant warnings.", // Kept
        audioShieldDescription: "Upload an audio file to analyze it for suspicious content, scam tactics, or misinformation.", // New
        liveCallProtection: "Live Call Protection",
        liveProtectionDescription: "Real-time AI analysis of ongoing calls to detect scams. (Feature under development)",
        orUploadRecording: "Or, Upload a Call Recording", // Kept
        uploadAudioInstruction: "Upload any audio file to analyze it for suspicious or harmful content.", // New
        knownScamsLibrary: "Known Scams Library (Audio Examples)",
        knownScamsLibraryDesc: "Learn about common phone scam tactics with audio examples and response tips.", // New
        scamTypePhishing: "Phishing Attempt",
        scamTypeImpersonation: "Impersonation Scam",
        scamTypeTechSupport: "Tech Support Scam",
        libraryComingSoon: "(Library of scam call examples - Coming Soon)",
        documentCheckDescription: "Upload suspicious 'official documents' (e.g., images of court orders, PDF contracts) to scan them for potential fraud.",
        uploadMethod: "Upload Method",
        scanWithCamera: "Scan with Camera",
        uploadFromFile: "Upload from File",
        commonDocumentForgeries: "Common Document Forgeries",
        forgeryTypeFakeInvoice: "Fake Invoice",
        forgeryTypeAlteredContract: "Altered Contract",
        forgeryTypeForgedSignature: "Forged Signature/Seal",
        legalToolkit: "Legal Toolkit",
        contactAuthorities: "Contact Authorities",
        contactLawyer: "Consult a Lawyer",
        customsHelpDescription: "Get checklists, links, and estimates for common customs and bureaucratic procedures in Tunisia.",
        legalRightsDescription: "Quick summaries of legal rights on various topics (e.g., employment, housing) for Tunisia.",
        legalAssistantHubDescription: "Select your preferred language to interact with the Legal Assistant. Ask your legal or customs questions; the AI will explain the steps in simple terms.",
        selectLanguagePrompt: "Please select your preferred language for the Legal Assistant:",
        misinfoDebunkerDescription: "Paste news content (especially political or health-related) to check if it's viral fake news. The AI will explain why it might be false and provide trusted sources.",
        emergencyModeDescription: "If you are in a high-risk scam situation (e.g., being pressured to send money), activate this mode.",
        emergencyModeActiveMessage: "Trusted contacts have been alerted (simulation). Stay calm. Use the prompts below.",
        legalResponseTemplates: "Pre-written Legal Response Templates",
        useTheseResponses: "Use these responses if you are being pressured.",
        legalPromptVerifyOfficial: "I need to verify this information with official sources before proceeding.",
        legalPromptNotAuthorizedShare: "I am not authorized to share that information over the phone/message.",
        legalPromptConsultAdvisor: "I will consult with a legal advisor before taking any action.",
        legalPromptProvideOfficialDoc: "Please provide official documentation that I can verify independently.",
        legalPromptNoFinancialPressure: "I do not make financial decisions under pressure.",
        legalPromptTunisianLawFraud: "This request may be inconsistent with Tunisian law, for example, Article 291 of the Penal Code regarding fraud. I need to verify its legality.",
        legalPromptReportSuspicious: "I will report any suspicious activity to the relevant authorities.",
        pageSubtitleScamProtection: "Protect yourself from scams in seconds",
        voiceInputDisclaimer: "(Feature concept: Click to speak the message)",
        legalContextArticle254: "Article 254 of the Penal Code: Electronic fraud is punishable by imprisonment.",
        quickActionsTitle: "Quick Actions",
        prewrittenScamResponse: "This is a scam message. You have been reported.",
        communityShieldDescription: "Want to warn others?",
        noResultsYet: "Scan results will appear here once you submit a message.",
        noResultsYetAudio: "Analysis results will appear here once you submit an audio file.", // New
        pageSubtitleCallShield: "Trap scammers before they trick you!", // Kept
        pageSubtitleAudioShield: "Detect harmful content in any audio.", // New
        liveCallPrivacyDisclaimer: "We don't record calls. Analysis happens during the call only.",
        realTimeAlertsTitle: "Real-Time Alerts (Conceptual)",
        voicePatternDetection: "Voice Pattern Detection",
        voicePatternDetectionExample: "AI interrupts if caller uses scam scripts (e.g., 'I need your OTP code').",
        numberCheck: "Number Check",
        numberCheckExample: "Cross-references crowdsourced scam database (e.g., '+216 XX XXX XXX: 42 reports as Tunisie Telecom scam').",
        callAnalysisReportTitle: "Call Analysis Report", // Kept
        audioAnalysisReportTitle: "Audio Analysis Report", // New
        fakeBankScam: "Fake Bank Scam", // Example
        potentialMisinformation: "Potential Misinformation", // New example
        callerRequestedSensitiveInfo: "Caller requested sensitive information.",
        unknownSuspiciousNumber: "Unknown/suspicious number.",
        legalArticle201Bis: "Legal Context: Article 201 bis of the Penal Code - Cyber threat is a crime.",
        callScamExampleTT: "Unpaid bill from Tunisie Télécom",
        callScamExampleJudiciary: "Call from 'judiciary' demanding immediate fine",
        callScamExampleFakeJob: "Fake job offers by phone",
        sampleAudioClip: "Sample Audio Clip",
        scriptBreakdown: "Script Breakdown",
        howToRespond: "How to Respond",
        emergencyModeIntegrationDesc: "If AI detects a high-pressure scam (e.g., 'Your son is in danger! Send money now!'):",
        emergencyFlashAlert: "⚠️ Danger! The scammer is trying to scare you!",
        emergencyActionLocation: "Auto-send live location to trusted contact.",
        emergencyActionPoliceCall: "Auto-play pre-recorded message: 'This is a suspicious call. I will contact the police.'",
        callRecordingUploadInstruction: "Upload a call recording to analyze it for known scam tactics.", // Kept
        defaultScamReason: "The call exhibits patterns consistent with known scam tactics.", // Kept
        defaultSuspiciousReason: "The audio exhibits patterns consistent with potentially suspicious or harmful content.", // New
        pageSubtitleDocumentCheck: "Even official-looking papers can be scams!",
        voiceGuidanceDocumentCheck: "Scan the report or contract and let's check it.",
        fakeStamp: "Fake Stamp",
        fakeStampDesc: "Stamp doesn't match official template.",
        mismatchedFont: "Mismatched Font",
        mismatchedFontDesc: "Font differs from Ministry of Interior documents.",
        alteredDate: "Altered Date",
        alteredDateDesc: "Date appears digitally altered.",
        saveSecureCopyDesc: "(Local storage only)",
        fakePoliceReport: "Fake police reports",
        fakePoliceReportDesc: "Fraudulent summons or fine notices.",
        propertyScam: "Property sale scams",
        propertyScamDesc: "Fake contracts for non-existent properties.",
        customsDutyFraud: "Customs duty fraud",
        customsDutyFraudDesc: "Fake invoices for customs payments.",
        sideBySideComparison: "Side-by-Side Comparison with real documents.",
        redCircleIndicators: "Red Circle Indicators of differences.",
        reportToPublicProsecutorDesc: "Generates prefilled report with document photos, AI-detected fraud points.",
        penalCodeArticle96: "Relevant penal code articles (e.g., Article 96 for forgery).",
        scamMapDocCheck: "{{count}} forged documents reported this way in your governorate.",
        officialTemplates: "Official Templates",
        howToVerifyYourself: "How to verify a document yourself?",
        qrCodeCheck: "QR code check for e-documents.",
        hotlineNumbers: "Hotline numbers for ministries.",
        localProcessing: "Local Processing (Privacy-First)",
        tunisianDocDatabase: "Tunisian Document Database",
        offlineMode: "Offline Mode",
        userScenarioDocCheck: "This document was used in 7 previous scams.",
        elderMode: "Elder Mode",
        magnifyingGlass: "Magnifying glass tool to inspect details.",
        audioExplanation: "Audio explanation of red flags.",
        notaryMode: "Notary Mode",
        batchScan: "For professionals to batch-scan documents.",
        threeIndicators: "3 indicators of forgery!",
        documentUsedInScams: "This document was used in {{count}} previous scams.",
        localProcessingDesc: "No cloud upload.",
        tunisianDocDatabaseDesc: "1000+ certified templates (partnered with Ministry of Justice), crowdsourced scam patterns.",
        offlineModeDesc: "Basic checks available without internet.",
        templatePoliceReport: "Real police report template",
        templateSalesContract: "Notarized sales contract template",
        verificationStepQr: "Check QR codes on e-documents.",
        verificationStepHotline: "Call ministry hotlines to verify authenticity.",
        elderModeDesc: "Simplified interface for seniors.",
        magnifyingGlassDesc: "Zoom in on document details.",
        audioExplanationDesc: "Listen to forgery indicators in Tunisian Arabic.",
        notaryModeDesc: "Professional tools for notaries.",
        batchScanDesc: "Scan multiple documents quickly.",
        pageSubtitleLegalAssistant: "Ask your legal questions in Tunisian Arabic, French, or English. The AI will provide clear explanations and relevant legal articles.",
        autoDetectLanguageConcept: "(AI will attempt to auto-detect input language)",
        voiceInputLegalAssistant: "Ask with your voice",
        emergencyConfirmActivation: "Activating Emergency Mode will simulate alerting your trusted contacts and provide you with AI-driven advice and pre-written legal responses. Are you sure you want to proceed?",
        emergencyActiveToastDesc: "Trusted contacts are being alerted (simulation). Describe your situation for AI advice or use the static prompts.",
        emergencyDeactivatedToastDesc: "You have exited emergency mode.",
        copiedToClipboardSuffix: "copied to clipboard.",
        describeSituationSubtext: "Provide details for personalized AI advice and suggested responses.",
        scamTacticsExplanation: "Scammers often use urgency, authority, or enticing offers to trick you. They might ask for personal information, OTP codes, or direct money transfers. Always be skeptical of unsolicited requests and verify information independently through official channels.",
        videoPlaceholderDesc: "(Concept: A short video explaining common scams and how to avoid them would be embedded here.)",
        recordAudioDisclaimer: "(Feature concept: Click to record audio for analysis)" // New
    },
    dialogTitles: {
        educationalResources: "Educational Resources",
    },
    dialogDescriptions: {
        learnMoreAboutScams: "Learn more about common scams and how to protect yourself.",
    },
    headings: {
        understandingScamTactics: "Understanding Scam Tactics",
        watchOurVideoGuide: "Watch Our Video Guide",
    },
    locales: {
        tunis: "Tunis",
    }
  },
  fr: {
    lang: "fr",
    droitBot: "DroitBot",
    nav: {
      dashboard: "Tableau de bord",
      messageScamCheck: "Vérif. Arnaques Messages",
      callShield: "Bouclier Audio", // Updated
      documentFraudCheck: "Vérif. Fraude Documents",
      legalAssistant: "Assistant Juridique",
      legalResources: "Ressources Juridiques",
      customsHelp: "Aide Douanes & Admin.",
      legalRightsInfo: "Infos Droits Juridiques",
      misinfoDebunker: "Déboulonneur d'Infaux",
      emergencyMode: "Mode Urgence",
      toggleSidebar: "Basculer la barre latérale",
      changeLanguage: "Changer de langue",
      familyLaw: "Droit de la Famille",
      propertyRights: "Droits de Propriété",
      businessRegulations: "Réglementations Commerciales",
      trafficLaws: "Code de la Route",
      socialSecurity: "Sécurité Sociale",
    },
    pageTitles: {
        dashboard: "Bienvenue à DroitBot",
        messageScamCheck: "Vérification des Arnaques par Message",
        callShield: "Protection des Appels",
        audioShield: "Bouclier Audio", // New
        documentFraudCheck: "Vérification de Fraude Documentaire",
        legalAssistant: "Assistant Juridique Tunisien",
        legalResources: "Ressources Juridiques",
        customsHelp: "Aide Douanes et Administration",
        legalRightsInfo: "Résumé des Droits Juridiques",
        misinfoDebunker: "Déboulonneur de Fausses Informations",
        emergencyMode: "Mode Urgence",
        quickAccessCategories: "Catégories d'Accès Rapide",
    },
    buttons: {
        activateEmergencyMode: "Activer le Mode Urgence",
        confirmActivation: "Confirmer l'activation",
        cancel: "Annuler",
        yesActivate: "Oui, Activer",
        deactivateEmergencyMode: "Désactiver le Mode Urgence",
        copy: "Copier",
        analyzeCall: "Analyser l'appel",
        analyzeAudio: "Analyser l'Audio", // New
        getHelp: "Obtenir de l'aide",
        analyzeDocument: "Analyser le document",
        getSummary: "Obtenir le résumé",
        debunk: "Déboulonner",
        scanNow: "Scanner maintenant",
        submitQuery: "Soumettre la requête",
        startRecording: "Démarrer l'enregistrement",
        recordAudio: "Enregistrer Audio", // New
        stopRecording: "Arrêter l'enregistrement",
        uploadRecording: "Télécharger l'enregistrement",
        selectFile: "Choisir un fichier",
        speak: "Parler",
        sendMessage: "Envoyer",
        clearChat: "Effacer la discussion",
        reportFalsePositive: "Faux positif ? Signalez-le !",
        reportToAuthorities: "Signaler aux autorités",
        copyPrewrittenResponse: "Copier la réponse pré-rédigée",
        educateMe: "M'informer",
        textToSpeech: "Lire à voix haute",
        shareAnonymously: "Partager cette arnaque (anonymement)",
        reportToPolice: "Signaler à la Police",
        blockNumber: "Bloquer le Numéro",
        educateCallScams: "Comment reconnaître les arnaques téléphoniques ?",
        playAudioSample: "Écouter l'extrait audio",
        scanWithCamera: "Scanner avec l'appareil photo",
        uploadFromFile: "Télécharger depuis un fichier",
        saveSecureCopy: "Enregistrer une copie sécurisée",
        reportToPublicProsecutor: "Signaler au Procureur de la République",
        contactCustoms: "Contacter la Douane",
        contactJudicialPolice: "Contacter la Police Judiciaire",
        downloadPoliceReportTemplate: "Télécharger modèle de PV de police",
        downloadSalesContractTemplate: "Télécharger modèle de contrat de vente",
        seeSteps: "Voir étapes",
        getAIAdvice: "Obtenir Conseil IA",
        close: "Fermer",
        accessFeature: "Accéder à {{featureName}}",
        reportContent: "Signaler le Contenu", // New
        learnMoreAudioRisks: "En Savoir Plus sur les Risques Audio", // New
    },
    labels: {
        callRecording: "Enregistrement de l'appel (fichier audio)",
        audioFile: "Fichier Audio", // New
        procedureName: "Nom de la procédure",
        documentFile: "Document (Image ou PDF)",
        optionalDescription: "Description facultative",
        legalTopic: "Sujet juridique",
        countryOptional: "Pays (Facultatif)",
        newsContent: "Contenu de l'actualité",
        messageContent: "Contenu du message",
        messageSource: "Source du message",
        selectSource: "Sélectionnez la source (ex: WhatsApp)",
        audioTranscript: "Transcription Audio",
        queryInTunisianArabic: "Votre requête en arabe tunisien",
        language: "Langue",
        yourMessage: "Votre message...",
        voiceInput: "Entrée Vocale",
        howToScan: "Comment Scanner ?",
        autoScanToggle: "Analyse auto. des nouveaux messages",
        autoScanPrivacy: "(Nécessite accès notifications avec info confidentialité claire - Concept)",
        recentScamsFeed: "Flux d'Arnaques Récentes (Exemples en direct)",
        liveCallProtection: "Protection des Appels en Direct",
        autoScanAllCalls: "Analyse auto. de tous les appels",
        callAnalysisReport: "Rapport d'Analyse d'Appel",
        audioAnalysisReport: "Rapport d'Analyse Audio", // New
        knownScamsLibrary: "Bibliothèque d'Arnaques Connues",
        emergencyModeIntegration: "Intégration du Mode Urgence",
        uploadCallRecordingPrompt: "Ou, téléchargez un enregistrement d'appel pour analyse",
        uploadAudioPrompt: "Télécharger un fichier audio pour analyse", // New
        uploadMethods: "Méthodes de Téléchargement",
        aiAnalysis: "Analyse IA",
        commonScamAlerts: "Alertes Arnaques Courantes en Tunisie",
        legalActionToolkit: "Boîte à Outils Juridique",
        preventionHub: "Pôle Prévention",
        technicalSpecs: "Spécifications Techniques",
        accessibilityFeatures: "Fonctionnalités d'Accessibilité",
        languageSelection: "Sélection de la langue",
        tunisianArabic: "Arabe Tunisien",
        french: "Français",
        english: "Anglais",
        responseIn: "Réponse en",
        visualAids: "Aides Visuelles",
        officialGazetteSnippet: "Extrait du Journal Officiel (Concept)",
        describeSituation: "Décrivez Votre Situation",
        aiRecommendations: "Recommandations IA",
        aiAdvice: "Conseil IA",
        aiSuggestedPrompts: "Messages Suggérés par l'IA",
        aiImmediateActions: "Actions Immédiates IA",
    },
    placeholders: {
        callRecordingPlaceholder: "ex: enregistrement_appel.mp3",
        audioFilePlaceholder: "ex: fichier_audio.mp3, enregistrement.wav", // New
        procedurePlaceholder: "ex: Importation voiture, Renouvellement passeport",
        documentDescriptionPlaceholder: "Décrivez brièvement le document ou vos préoccupations (facultatif)...",
        legalTopicPlaceholder: "ex: Droits des locataires, Droits des employés",
        countryPlaceholder: "Par défaut la Tunisie si laissé vide",
        newsContentPlaceholder: "Collez l'article de presse ou la déclaration ici...",
        messageContentPlaceholder: "Collez le message suspect ici...",
        selectSourcePlaceholder: "Sélectionner la source",
        tunisianArabicPlaceholder: "أكتب سؤالك هنا باللهجة التونسية...",
        typeYourMessage: "Écrivez votre message en {{language}}...",
        pasteMessageOrSelect: "Collez le message suspect ici ou choisissez parmi les conversations...",
        legalAssistantMultilingualPlaceholder: "Posez votre question en arabe tunisien, français ou anglais...",
        frenchResponsePlaceholder: "[L'explication en français apparaîtra ici]",
        englishResponsePlaceholder: "[English explanation will appear here]",
        situationPlaceholder: "Décrivez ce qui se passe en détail...",
    },
    alerts: {
        error: "Erreur",
        unsupportedFileType: "Type de fichier non supporté.",
        fileTooLarge: "Le fichier est trop volumineux.",
        cameraPermissionDenied: "Permission de caméra refusée. Veuillez l'activer dans les paramètres du navigateur.",
        micPermissionDenied: "Permission de microphone refusée. Veuillez l'activer dans les paramètres du navigateur.",
        invalidFileTypeAudio: "Type de fichier invalide. Veuillez télécharger un enregistrement audio.",
        invalidFileTypeImagePdf: "Type de fichier invalide. Veuillez télécharger une image ou un document PDF.",
        uploadFileError: "Veuillez télécharger un fichier.",
        analysisError: "Une erreur est survenue lors de l'analyse.",
        noProcedureError: "Veuillez entrer la procédure pour laquelle vous avez besoin d'aide.",
        noTopicError: "Veuillez entrer un sujet juridique.",
        noContentError: "Veuillez entrer le contenu de l'actualité à déboulonner.",
        noMessageError: "Veuillez entrer un message et sélectionner une source.",
        noQueryError: "Veuillez entrer votre requête.",
        emergencyActive: "Le Mode Urgence est ACTIF",
        emergencyDeactivated: "Mode Urgence Désactivé",
        promptCopied: "Message Copié !",
        textCopied: "Texte Copié !",
        highScamProbability: "Attention : Forte probabilité d'arnaque !",
        scamDetected: "Arnaque Détectée",
        suspiciousAudioDetected: "Audio Suspect Détecté", // New
        highRiskScamDetected: "Arnaque à Haut Risque Détectée !",
        documentFraudWarning: "Attention ! 3 indices de falsification !",
        documentVerified: "Le document correspond aux modèles officiels.",
        noSituationError: "Veuillez décrire votre situation pour obtenir un conseil de l'IA.",
    },
    results: {
        analysisResult: "Résultat de l'Analyse",
        likelyScam: "Probablement une Arnaque",
        reason: "Raison",
        procedureGuidance: "Guide de Procédure pour",
        checklist: "Liste de Contrôle",
        estimatedCost: "Coût Estimé",
        estimatedTimeline: "Délai Estimé",
        officialLinks: "Liens Officiels",
        legalRightsSummaryForTopic: "Résumé des Droits Juridiques pour",
        debunkingResult: "Résultat du Déboulonnage",
        explanation: "Explication",
        trustedSources: "Sources Fiables",
        scamType: "Type d'Arnaque",
        issueDetected: "Problème Détecté", // New
        confidence: "Confiance",
        messageAnalysisResult: "Résultat de l'Analyse du Message",
        assistantResponse: "Réponse de l'Assistant",
        scanResultsTitle: "Résultats de l'Analyse",
        messageSafe: "Ce message semble sûr.",
        aiBreakdownTitle: "Analyse IA",
        redFlagsHighlighted: "Signaux d'Alerte Mis en Évidence",
        analysisDetails: "Détails de l'Analyse", // New
        legalContextTitle: "Contexte Juridique",
        safeCall: "Appel Sûr",
        audioSafe: "L'Audio Semble Sûr", // New
        noScamIndicators: "Aucun indice d'arnaque détecté.",
        noSuspiciousContent: "Aucun contenu suspect détecté.", // New
        resultsIn10Seconds: "Résultats en 10 secondes",
        visualAnnotations: "Annotations Visuelles",
        documentMatchesOfficial: "Le document correspond aux modèles officiels.",
    },
    text: {
        selectedFile: "Sélectionné",
        noChecklistFound: "Aucun élément de liste de contrôle trouvé pour cette procédure.",
        noOfficialLinksFound: "Aucun lien officiel trouvé pour cette procédure.",
        noCostEstimate: "Aucune estimation de coût disponible.",
        noTimelineEstimate: "Aucune estimation de délai disponible.",
        loading: "Chargement...",
        micActive: "Microphone Actif",
        recording: "Enregistrement...",
        speakNow: "Parlez maintenant...",
        privacyNoticeCallShield: "Votre vie privée est notre priorité. L'analyse des appels est traitée sur votre appareil et les enregistrements ne sont pas stockés.",
        privacyNoticeAudioAnalysis: "Votre vie privée est notre priorité. L'analyse audio est traitée sur votre appareil et les fichiers ne sont pas stockés à long terme.", // New
        privacyNoticeDocumentCheck: "Votre vie privée est notre priorité. L'analyse des documents est traitée localement sur votre appareil lors du téléchargement du fichier et n'est pas stockée.",
        privacyNoticeScamProtection: "L'analyse se fait sur votre appareil. Nous ne stockons pas vos messages. Votre vie privée est notre priorité.",
        legalDisclaimer: "Avertissement : Cette IA fournit des informations générales et ne remplace pas un conseil juridique professionnel. Consultez un avocat qualifié pour votre situation spécifique.",
        helloLegalAssistant: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        welcomeToDroitBot: "Bienvenue à DroitBot",
        droitBotDescription: "Votre assistant IA pour naviguer les questions juridiques et vous protéger des arnaques en Tunisie.",
        featureDescriptionMessageScam: "Analysez les messages pour détecter les arnaques potentielles.",
        featureDescriptionCallShield: "Détectez les tactiques d'arnaque dans les appels téléphoniques.",
        featureDescriptionAudioShield: "Analysez les fichiers audio pour du contenu suspect.", // New
        featureDescriptionDocumentCheck: "Scannez les documents à la recherche de signes de fraude.",
        featureDescriptionLegalAssistant: "Posez des questions juridiques en arabe tunisien.",
        featureDescriptionLegalResources: "Accédez à l'aide douanière et aux informations sur les droits juridiques.",
        featureDescriptionCustomsHelp: "Obtenez des listes de contrôle pour les procédures douanières.",
        featureDescriptionLegalRights: "Résumés de vos droits légaux.",
        featureDescriptionMisinfoDebunker: "Vérifiez les actualités et démystifiez la désinformation.",
        featureDescriptionEmergency: "Actions rapides pour les situations à haut risque.",
        goToFeature: "Aller à {{featureName}}",
        recentScamsFeed: "Flux d'Arnaques Récentes (Tunisie)",
        communityShield: "Bouclier Communautaire : Signaler & Alerter",
        preventionTips: "Conseils de Prévention",
        reportScamAnonymous: "Aidez les autres en signalant cette arnaque (anonymement)",
        scamsReportedThisMonth: "{{count}} signalements ce mois-ci à {{location}}.",
        scamMapFeatureComingSoon: "(Carte des Points Chauds d'Arnaques - Bientôt disponible)",
        howToScan: "Comment Scanner ?",
        selectFromConversationsAndroid: "Sélectionner depuis les conversations (Android uniquement)",
        autoScanNewMessages: "Scanner automatiquement les nouveaux messages ?",
        exampleScamOoredoo: "Attention : Arnaque 'Cadeau Gratuit Ooredoo' en circulation !",
        exampleScamBank: "Alerte : Faux SMS de fermeture de compte bancaire signalé.",
        feedComingSoon: "(Flux en direct des arnaques signalées par les utilisateurs - Bientôt disponible)",
        tipOtp: "Ne partagez jamais les codes OTP !",
        tipBankSms: "Les banques n'utilisent pas SMS/WhatsApp pour les demandes d'informations sensibles.",
        tipGovLinks: "Les liens officiels se terminent par .gov.tn ou .tn.",
        tipSenderIdentity: "Vérifiez toujours l'identité de l'expéditeur avant de répondre.",
        tipTooGoodToBeTrue: "Si une offre semble trop belle pour être vraie, c'est probablement le cas.",
        callShieldDescription: "Téléchargez un enregistrement d'appel pour l'analyser à la recherche de tactiques d'arnaque connues, comme les demandes d'OTP, et recevez des avertissements instantanés.",
        audioShieldDescription: "Téléchargez un fichier audio pour l'analyser à la recherche de contenu suspect, de tactiques d'arnaque ou de désinformation.", // New
        liveCallProtection: "Protection des Appels en Direct",
        liveProtectionDescription: "Analyse IA en temps réel des appels en cours pour détecter les arnaques. (Fonctionnalité en développement)",
        orUploadRecording: "Ou, Télécharger un Enregistrement d'Appel",
        uploadAudioInstruction: "Téléchargez n'importe quel fichier audio pour l'analyser à la recherche de contenu suspect ou nuisible.", // New
        knownScamsLibrary: "Bibliothèque d'Arnaques Connues (Exemples Audio)",
        knownScamsLibraryDesc: "Apprenez les tactiques courantes d'arnaques téléphoniques avec des exemples audio et des conseils de réponse.", // New
        scamTypePhishing: "Tentative de Hameçonnage",
        scamTypeImpersonation: "Usurpation d'Identité",
        scamTypeTechSupport: "Arnaque au Support Technique",
        libraryComingSoon: "(Bibliothèque d'exemples d'appels frauduleux - Bientôt disponible)",
        documentCheckDescription: "Téléchargez des 'documents officiels' suspects (ex: images d'ordonnances judiciaires, contrats PDF) pour les scanner à la recherche de fraudes potentielles.",
        uploadMethod: "Méthode de Téléchargement",
        scanWithCamera: "Scanner avec l'Appareil Photo",
        uploadFromFile: "Télécharger depuis un Fichier",
        commonDocumentForgeries: "Falsifications Courantes de Documents",
        forgeryTypeFakeInvoice: "Fausse Facture",
        forgeryTypeAlteredContract: "Contrat Modifié",
        forgeryTypeForgedSignature: "Signature/Sceau Falsifié",
        legalToolkit: "Boîte à Outils Juridique",
        contactAuthorities: "Contacter les Autorités",
        contactLawyer: "Consulter un Avocat",
        customsHelpDescription: "Obtenez des listes de contrôle, des liens et des estimations pour les procédures douanières et bureaucratiques courantes en Tunisie.",
        legalRightsDescription: "Des résumés rapides des droits légaux sur divers sujets (par exemple, l'emploi, le logement) pour la Tunisie.",
        legalAssistantHubDescription: "Sélectionnez votre langue préférée pour interagir avec l'Assistant Juridique. Posez vos questions juridiques ou douanières ; l'IA expliquera les étapes en termes simples.",
        selectLanguagePrompt: "Veuillez sélectionner votre langue préférée pour l'Assistant Juridique :",
        misinfoDebunkerDescription: "Collez le contenu d'une actualité (surtout politique ou sanitaire) pour vérifier s'il s'agit d'une fausse nouvelle virale. L'IA expliquera pourquoi elle pourrait être fausse et fournira des sources fiables.",
        emergencyModeDescription: "Si vous êtes dans une situation d'arnaque à haut risque (ex: pression pour envoyer de l'argent), activez ce mode.",
        emergencyModeActiveMessage: "Les contacts de confiance ont été alertés (simulation). Restez calme. Utilisez les messages ci-dessous.",
        legalResponseTemplates: "Modèles de Réponses Juridiques Pré-rédigés",
        useTheseResponses: "Utilisez ces réponses si vous subissez des pressions.",
        legalPromptVerifyOfficial: "Je dois vérifier ces informations auprès de sources officielles avant de continuer.",
        legalPromptNotAuthorizedShare: "Je ne suis pas autorisé(e) à partager ces informations par téléphone/message.",
        legalPromptConsultAdvisor: "Je consulterai un conseiller juridique avant de prendre toute mesure.",
        legalPromptProvideOfficialDoc: "Veuillez fournir une documentation officielle que je peux vérifier indépendamment.",
        legalPromptNoFinancialPressure: "Je ne prends pas de décisions financières sous pression.",
        legalPromptTunisianLawFraud: "Cette demande pourrait être contraire à la loi tunisienne, par exemple l'Article 291 du Code Pénal concernant la fraude. Je dois vérifier sa légalité.",
        legalPromptReportSuspicious: "Je signalerai toute activité suspecte aux autorités compétentes.",
        pageSubtitleScamProtection: "Protégez-vous des arnaques en quelques secondes",
        voiceInputDisclaimer: "(Concept : Cliquez pour dicter le message)",
        legalContextArticle254: "Article 254 du Code Pénal : L'escroquerie électronique est passible d'emprisonnement.",
        quickActionsTitle: "Actions Rapides",
        prewrittenScamResponse: "Ceci est un message d'arnaque. Vous avez été signalé.",
        communityShieldDescription: "Vous voulez avertir les autres ?",
        noResultsYet: "Les résultats de l'analyse apparaîtront ici une fois que vous aurez soumis un message.",
        noResultsYetAudio: "Les résultats de l'analyse apparaîtront ici une fois que vous aurez soumis un fichier audio.", // New
        pageSubtitleCallShield: "Piégez les arnaqueurs avant qu'ils ne vous piègent !",
        pageSubtitleAudioShield: "Détectez le contenu nuisible dans n'importe quel audio.", // New
        liveCallPrivacyDisclaimer: "Nous n'enregistrons pas les appels. L'analyse se fait uniquement pendant l'appel.",
        realTimeAlertsTitle: "Alertes en Temps Réel (Conceptuel)",
        voicePatternDetection: "Détection de Schéma Vocal",
        voicePatternDetectionExample: "L'IA interrompt si l'appelant utilise des scripts d'arnaque (ex: 'J'ai besoin de votre code OTP').",
        numberCheck: "Vérification du Numéro",
        numberCheckExample: "Croise les références avec une base de données collaborative d'arnaques (ex: '+216 XX XXX XXX: 42 signalements comme arnaque Tunisie Telecom').",
        callAnalysisReportTitle: "Rapport d'Analyse d'Appel",
        audioAnalysisReportTitle: "Rapport d'Analyse Audio", // New
        fakeBankScam: "Arnaque à la Fausse Banque", // Example
        potentialMisinformation: "Désinformation Potentielle", // New Example
        callerRequestedSensitiveInfo: "L'appelant a demandé des informations sensibles.",
        unknownSuspiciousNumber: "Numéro inconnu/suspect.",
        legalArticle201Bis: "Contexte Juridique : Article 201 bis du Code Pénal - La cybermenace est un délit.",
        callScamExampleTT: "Facture impayée de Tunisie Télécom",
        callScamExampleJudiciary: "Appel du 'judiciaire' exigeant une amende immédiate",
        callScamExampleFakeJob: "Fausses offres d'emploi par téléphone",
        sampleAudioClip: "Extrait Audio d'Exemple",
        scriptBreakdown: "Analyse du Script",
        howToRespond: "Comment Répondre",
        emergencyModeIntegrationDesc: "Si l'IA détecte une arnaque à haute pression (ex: 'Votre fils est en danger ! Envoyez de l'argent maintenant !'):",
        emergencyFlashAlert: "⚠️ Danger ! L'arnaqueur essaie de vous faire peur !",
        emergencyActionLocation: "Envoi automatique de la position en direct au contact de confiance.",
        emergencyActionPoliceCall: "Lecture automatique du message préenregistré : 'Ceci est un appel suspect. Je vais contacter la police.'",
        callRecordingUploadInstruction: "Téléchargez un enregistrement d'appel pour l'analyser à la recherche de tactiques d'arnaque connues.",
        defaultScamReason: "L'appel présente des caractéristiques conformes aux tactiques d'arnaque connues.",
        defaultSuspiciousReason: "L'audio présente des caractéristiques conformes à un contenu potentiellement suspect ou nuisible.", // New
        pageSubtitleDocumentCheck: "Même les papiers officiels peuvent être des arnaques !",
        voiceGuidanceDocumentCheck: "Scannez le PV ou le contrat et laissez-nous vérifier.",
        fakeStamp: "Faux Tampon",
        fakeStampDesc: "Le tampon ne correspond pas au modèle officiel.",
        mismatchedFont: "Police de Caractères Différente",
        mismatchedFontDesc: "La police diffère de celle des documents du Ministère de l'Intérieur.",
        alteredDate: "Date Modifiée",
        alteredDateDesc: "La date semble modifiée numériquement.",
        saveSecureCopyDesc: "(Stockage local uniquement)",
        fakePoliceReport: "Faux procès-verbaux de police",
        fakePoliceReportDesc: "Fausses convocations ou amendes.",
        propertyScam: "Arnaques à la vente immobilière",
        propertyScamDesc: "Faux contrats pour des biens inexistants.",
        customsDutyFraud: "Fraude aux droits de douane",
        customsDutyFraudDesc: "Fausses factures pour paiements douaniers.",
        sideBySideComparison: "Comparaison côte à côte avec des documents réels.",
        redCircleIndicators: "Indicateurs en cercle rouge des différences.",
        reportToPublicProsecutorDesc: "Génère un signalement pré-rempli avec photos du document, points de fraude détectés par l'IA.",
        penalCodeArticle96: "Articles pertinents du code pénal (ex: Article 96 pour faux et usage de faux).",
        scamMapDocCheck: "{{count}} documents falsifiés signalés de cette manière dans votre gouvernorat.",
        officialTemplates: "Modèles Officiels",
        howToVerifyYourself: "Comment vérifier un document soi-même ?",
        qrCodeCheck: "Vérification par code QR pour les e-documents.",
        hotlineNumbers: "Numéros d'urgence des ministères.",
        localProcessing: "Traitement Local (Priorité à la Confidentialité)",
        tunisianDocDatabase: "Base de Données de Documents Tunisiens",
        offlineMode: "Mode Hors Ligne",
        userScenarioDocCheck: "Ce document a été utilisé dans 7 arnaques précédentes.",
        elderMode: "Mode Senior",
        magnifyingGlass: "Loupe pour inspecter les détails.",
        audioExplanation: "Explication audio des signaux d'alerte.",
        notaryMode: "Mode Notaire",
        batchScan: "Pour les professionnels, scanner des documents par lots.",
        threeIndicators: "3 indices de falsification !",
        documentUsedInScams: "Ce document a été utilisé dans {{count}} arnaques précédentes.",
        localProcessingDesc: "Aucun téléversement sur le cloud.",
        tunisianDocDatabaseDesc: "Plus de 1000 modèles certifiés (en partenariat avec le Ministère de la Justice), modèles d'arnaques participatifs.",
        offlineModeDesc: "Vérifications de base disponibles sans internet.",
        templatePoliceReport: "Modèle de PV de police réel",
        templateSalesContract: "Modèle de contrat de vente notarié",
        verificationStepQr: "Vérifiez les codes QR sur les e-documents.",
        verificationStepHotline: "Appelez les numéros verts des ministères pour vérifier l'authenticité.",
        elderModeDesc: "Interface simplifiée pour les seniors.",
        magnifyingGlassDesc: "Zoomez sur les détails du document.",
        audioExplanationDesc: "Écoutez les indicateurs de falsification en dialecte tunisien.",
        notaryModeDesc: "Outils professionnels pour les notaires.",
        batchScanDesc: "Scannez plusieurs documents rapidement.",
        pageSubtitleLegalAssistant: "Posez vos questions juridiques en arabe tunisien, français ou anglais. L'IA fournira des explications claires et les articles de loi pertinents.",
        autoDetectLanguageConcept: "(L'IA essaiera de détecter automatiquement la langue de saisie)",
        voiceInputLegalAssistant: "Posez votre question oralement",
        emergencyConfirmActivation: "L'activation du Mode Urgence simulera une alerte à vos contacts de confiance et vous fournira des conseils basés sur l'IA ainsi que des réponses juridiques pré-rédigées. Êtes-vous sûr de vouloir continuer ?",
        emergencyActiveToastDesc: "Les contacts de confiance sont alertés (simulation). Décrivez votre situation pour obtenir des conseils de l'IA ou utilisez les messages statiques.",
        emergencyDeactivatedToastDesc: "Vous avez quitté le mode urgence.",
        copiedToClipboardSuffix: "copié dans le presse-papiers.",
        describeSituationSubtext: "Fournissez des détails pour des conseils IA personnalisés et des réponses suggérées.",
        scamTacticsExplanation: "Les fraudeurs utilisent souvent l'urgence, l'autorité ou des offres alléchantes pour vous piéger. Ils peuvent demander des informations personnelles, des codes OTP ou des virements directs. Soyez toujours sceptique face aux demandes non sollicitées et vérifiez les informations de manière indépendante via les canaux officiels.",
        videoPlaceholderDesc: "(Concept : Une courte vidéo expliquant les arnaques courantes et comment les éviter serait intégrée ici.)",
        recordAudioDisclaimer: "(Concept de fonctionnalité : Cliquez pour enregistrer de l'audio pour analyse)" // New
    },
    dialogTitles: {
        educationalResources: "Ressources Éducatives",
    },
    dialogDescriptions: {
        learnMoreAboutScams: "Apprenez-en plus sur les arnaques courantes et comment vous protéger.",
    },
    headings: {
        understandingScamTactics: "Comprendre les Tactiques d'Arnaque",
        watchOurVideoGuide: "Regardez Notre Guide Vidéo",
    },
    locales: {
        tunis: "Tunis",
    }
  },
  ar: {
    lang: "ar",
    droitBot: "درويت-بوت",
    nav: {
      dashboard: "لوحة التحكم",
      messageScamCheck: "فحص الرسائل المشبوهة",
      callShield: "درع الصوت", // Updated
      documentFraudCheck: "فحص الوثائق المزورة",
      legalAssistant: "المساعد القانوني",
      legalResources: "المصادر القانونية",
      customsHelp: "مساعدة جمركية وإدارية",
      legalRightsInfo: "معلومات الحقوق القانونية",
      misinfoDebunker: "كاشف المعلومات المضللة",
      emergencyMode: "وضع الطوارئ",
      toggleSidebar: "تبديل الشريط الجانبي",
      changeLanguage: "تغيير اللغة",
      familyLaw: "قانون الأسرة",
      propertyRights: "حقوق الملكية",
      businessRegulations: "قوانين الأعمال",
      trafficLaws: "قانون المرور",
      socialSecurity: "الضمان الاجتماعي",
    },
     pageTitles: {
        dashboard: "أهلاً بك في درويت-بوت",
        messageScamCheck: "فحص الرسائل المشبوهة",
        callShield: "حماية المكالمات",
        audioShield: "درع الصوت", // New
        documentFraudCheck: "فحص الوثائق المزورة",
        legalAssistant: "المساعد القانوني التونسي",
        legalResources: "المصادر القانونية",
        customsHelp: "مساعدة جمركية وإدارية",
        legalRightsInfo: "ملخصات الحقوق القانونية",
        misinfoDebunker: "كاشف المعلومات المضللة",
        emergencyMode: "وضع الطوارئ",
        quickAccessCategories: "فئات الوصول السريع",
    },
    buttons: {
        activateEmergencyMode: "تفعيل وضع الطوارئ",
        confirmActivation: "تأكيد التفعيل",
        cancel: "إلغاء",
        yesActivate: "نعم، تفعيل",
        deactivateEmergencyMode: "إلغاء تفعيل وضع الطوارئ",
        copy: "نسخ",
        analyzeCall: "تحليل المكالمة",
        analyzeAudio: "تحليل الصوت", // New
        getHelp: "الحصول على مساعدة",
        analyzeDocument: "تحليل الوثيقة",
        getSummary: "الحصول على الملخص",
        debunk: "كشف التضليل",
        scanNow: "إفحص الآن",
        submitQuery: "إرسال الإستفسار",
        startRecording: "بدء التسجيل",
        recordAudio: "تسجيل صوتي", // New
        stopRecording: "إيقاف التسجيل",
        uploadRecording: "تحميل التسجيل",
        selectFile: "إختر ملف",
        speak: "تكلم",
        sendMessage: "إرسال",
        clearChat: "مسح المحادثة",
        reportFalsePositive: "هل تعتقد أنها نصابة؟ أبلغنا!",
        reportToAuthorities: "بلّغ السلطات",
        copyPrewrittenResponse: "انسخ رد جاهز",
        educateMe: "كيف تعمل هذه النصبة؟",
        textToSpeech: "اقرأ بصوت عالٍ",
        shareAnonymously: "هل تريد تحذير الآخرين؟ شارك هذه النصبة (مع إخفاء هويتك)",
        reportToPolice: "بلّغ الشرطة",
        blockNumber: "حظر الرقم",
        educateCallScams: "كيف تتعرف على نصابة المكالمات؟",
        playAudioSample: "تشغيل عينة صوتية",
        scanWithCamera: "مسح بالكاميرا",
        uploadFromFile: "تحميل من ملف",
        saveSecureCopy: "احفظ نسخة آمنة",
        reportToPublicProsecutor: "بلاغ للنائب العام",
        contactCustoms: "اتصل بالديوانة",
        contactJudicialPolice: "اتصل بالشرطة القضائية",
        downloadPoliceReportTemplate: "تحميل نموذج محضر شرطة",
        downloadSalesContractTemplate: "تحميل نموذج عقد بيع",
        seeSteps: "شوف الخطوات",
        getAIAdvice: "احصل على نصيحة الذكاء الاصطناعي",
        close: "إغلاق",
        accessFeature: "الوصول إلى {{featureName}}",
        reportContent: "الإبلاغ عن المحتوى", // New
        learnMoreAudioRisks: "تعرف على مخاطر الصوت", // New
    },
    labels: {
        callRecording: "تسجيل المكالمة (ملف صوتي)",
        audioFile: "ملف صوتي", // New
        procedureName: "إسم الإجراء",
        documentFile: "الوثيقة (صورة أو PDF)",
        optionalDescription: "وصف إختياري",
        legalTopic: "الموضوع القانوني",
        countryOptional: "البلد (إختياري)",
        newsContent: "محتوى الخبر",
        messageContent: "محتوى الرسالة",
        messageSource: "مصدر الرسالة",
        selectSource: "اختر المصدر (مثال: واتساب)",
        audioTranscript: "النص الصوتي",
        queryInTunisianArabic: "سؤالك باللهجة التونسية",
        language: "اللغة",
        yourMessage: "رسالتك...",
        voiceInput: "الإدخال الصوتي",
        howToScan: "كيفية الفحص؟",
        autoScanToggle: "فحص تلقائي للرسائل الجديدة",
        autoScanPrivacy: "(يتطلب صلاحية الوصول للإشعارات مع توضيح سياسة الخصوصية - فكرة مبدئية)",
        recentScamsFeed: "آخر عمليات النصب (أمثلة حية)",
        liveCallProtection: "الحماية المباشرة للمكالمات",
        autoScanAllCalls: "التشغيل التلقائي (فحص كل المكالمات)",
        callAnalysisReport: "تقرير تحليل المكالمة",
        audioAnalysisReport: "تقرير تحليل الصوت", // New
        knownScamsLibrary: "مكتبة النصب المعروفة",
        emergencyModeIntegration: "تكامل وضع الطوارئ",
        uploadCallRecordingPrompt: "أو، قم بتحميل تسجيل مكالمة للتحليل",
        uploadAudioPrompt: "تحميل ملف صوتي للتحليل", // New
        uploadMethods: "طريقة التحميل",
        aiAnalysis: "تحليل الذكاء الاصطناعي",
        commonScamAlerts: "تنبيهات النصب الشائعة في تونس",
        legalActionToolkit: "مجموعة الأدوات القانونية",
        preventionHub: "مركز الوقاية",
        technicalSpecs: "المواصفات الفنية",
        accessibilityFeatures: "ميزات الوصول",
        languageSelection: "اختيار اللغة",
        tunisianArabic: "دارجة تونسية",
        french: "فرنسية",
        english: "إنجليزية",
        responseIn: "الرد بـ",
        visualAids: "وسائل بصرية",
        officialGazetteSnippet: "مقتطف من الرائد الرسمي (تصور)",
        describeSituation: "صف الوضع",
        aiRecommendations: "توصيات الذكاء الاصطناعي",
        aiAdvice: "نصيحة الذكاء الاصطناعي",
        aiSuggestedPrompts: "رسائل مقترحة من الذكاء الاصطناعي",
        aiImmediateActions: "إجراءات فورية مقترحة من الذكاء الاصطناعي",
    },
    placeholders: {
        callRecordingPlaceholder: "مثال: recording.mp3",
        audioFilePlaceholder: "مثال: audio_file.mp3, recording.wav", // New
        procedurePlaceholder: "مثال: توريد سيارة، تجديد جواز سفر",
        documentDescriptionPlaceholder: "صف بإيجاز الوثيقة أو مخاوفك (اختياري)...",
        legalTopicPlaceholder: "مثال: حقوق المستأجر، حقوق الموظف",
        countryPlaceholder: "تونس تلقائياً إذا تركت فارغة",
        newsContentPlaceholder: "ألصق المقال الإخباري أو البيان هنا...",
        messageContentPlaceholder: "ألصق الرسالة المشبوهة هنا...",
        selectSourcePlaceholder: "اختر المصدر",
        tunisianArabicPlaceholder: "أكتب سؤالك هنا باللهجة التونسية...",
        typeYourMessage: "أكتب رسالتك بالـ {{language}}...",
        pasteMessageOrSelect: "الصق رسالة مشبوهة هنا أو اختر من المحادثات...",
        legalAssistantMultilingualPlaceholder: "اطرح سؤالك بالدارجة، الفرنسية أو الإنجليزية...",
        frenchResponsePlaceholder: "[الشرح بالفرنسية سيظهر هنا]",
        englishResponsePlaceholder: "[الشرح بالإنجليزية سيظهر هنا]",
        situationPlaceholder: "صف ماذا يحدث بالتفصيل...",
    },
    alerts: {
        error: "خطأ",
        unsupportedFileType: "نوع الملف غير مدعوم.",
        fileTooLarge: "الملف كبير جدًا.",
        cameraPermissionDenied: "تم رفض إذن الكاميرا. يرجى التمكين في إعدادات المتصفح.",
        micPermissionDenied: "تم رفض إذن الميكروفون. يرجى التمكين في إعدادات المتصفح.",
        invalidFileTypeAudio: "نوع الملف غير صالح. الرجاء تحميل تسجيل صوتي.",
        invalidFileTypeImagePdf: "نوع الملف غير صالح. الرجاء تحميل صورة أو وثيقة PDF.",
        uploadFileError: "الرجاء تحميل ملف.",
        analysisError: "حدث خطأ أثناء التحليل.",
        noProcedureError: "الرجاء إدخال الإجراء الذي تحتاج إلى مساعدة بشأنه.",
        noTopicError: "الرجاء إدخال موضوع قانوني.",
        noContentError: "الرجاء إدخال محتوى الخبر لكشف التضليل.",
        noMessageError: "الرجاء إدخال رسالة وتحديد مصدر.",
        noQueryError: "الرجاء إدخال إستفسارك.",
        emergencyActive: "وضع الطوارئ مُفعّل",
        emergencyDeactivated: "تم إلغاء تفعيل وضع الطوارئ",
        promptCopied: "تم نسخ النص!",
        textCopied: "تم نسخ النص!",
        highScamProbability: "تحذير: احتمال نصب عالي!",
        scamDetected: "تم كشف عملية نصب",
        suspiciousAudioDetected: "تم اكتشاف صوت مشبوه", // New
        highRiskScamDetected: "⚠️ خطر! النصّاب يحاول تخويفك!",
        documentFraudWarning: "انتبه! 3 مؤشرات تزوير!",
        documentVerified: "الوثيقة مطابقة للنماذج الرسمية.",
        noSituationError: "الرجاء وصف وضعك للحصول على نصيحة الذكاء الاصطناعي.",
    },
    results: {
        analysisResult: "نتيجة التحليل",
        likelyScam: "إحتمال أن تكون عملية نصب",
        reason: "السبب",
        procedureGuidance: "دليل الإجراءات لـ",
        checklist: "قائمة تحقق",
        estimatedCost: "التكلفة التقديرية",
        estimatedTimeline: "الجدول الزمني التقديري",
        officialLinks: "روابط رسمية",
        legalRightsSummaryForTopic: "ملخص الحقوق القانونية لـ",
        debunkingResult: "نتيجة كشف التضليل",
        explanation: "التفسير",
        trustedSources: "مصادر موثوقة",
        scamType: "نوع النصبة",
        issueDetected: "تم اكتشاف مشكلة", // New
        confidence: "الثقة",
        messageAnalysisResult: "نتيجة تحليل الرسالة",
        assistantResponse: "رد المساعد",
        scanResultsTitle: "النتائج",
        messageSafe: "هذه الرسالة تبدو آمنة.",
        aiBreakdownTitle: "تحليل الذكاء الاصطناعي",
        redFlagsHighlighted: "العلامات الحمراء المحددة",
        analysisDetails: "تفاصيل التحليل", // New
        legalContextTitle: "السياق القانوني",
        safeCall: "مكالمة آمنة",
        audioSafe: "الصوت يبدو آمناً", // New
        noScamIndicators: "لا مؤشرات نصب",
        noSuspiciousContent: "لم يتم اكتشاف محتوى مشبوه", // New
        resultsIn10Seconds: "النتائج خلال 10 ثواني",
        visualAnnotations: "ملاحظات مرئية",
        documentMatchesOfficial: "الوثيقة مطابقة للنماذج الرسمية.",
    },
    text: {
        selectedFile: "الملف المختار",
        noChecklistFound: "لم يتم العثور على قائمة تحقق لهذا الإجراء.",
        noOfficialLinksFound: "لم يتم العثور على روابط رسمية لهذا الإجراء.",
        noCostEstimate: "لا توجد تكلفة تقديرية متاحة.",
        noTimelineEstimate: "لا يوجد جدول زمني تقديري متاح.",
        loading: "جاري التحميل...",
        micActive: "الميكروفون نشط",
        recording: "يسجل...",
        speakNow: "تكلم الآن...",
        privacyNoticeCallShield: "خصوصيتك هي أولويتنا. يتم تحليل المكالمات على جهازك ولا يتم تخزين التسجيلات.",
        privacyNoticeAudioAnalysis: "خصوصيتك هي أولويتنا. يتم تحليل الصوت على جهازك ولا يتم تخزين الملفات على المدى الطويل.", // New
        privacyNoticeDocumentCheck: "خصوصيتك هي أولويتنا. يتم تحليل الوثائق محليًا على جهازك عند تحميل الملف ولا يتم تخزينها.",
        privacyNoticeScamProtection: "الفحص يتم على جهازك فقط. لا نخزن رسائلك. خصوصيتك هي أولويتنا.",
        legalDisclaimer: "تنويه: هذه الأداة تقدم معلومات عامة ولا تغني عن الاستشارة القانونية المتخصصة. استشر محاميًا مؤهلاً لحالتك الخاصة.",
        helloLegalAssistant: "مرحبا! كيفاش نجم نعاونك اليوم؟",
        welcomeToDroitBot: "مرحباً بك في درويت-بوت",
        droitBotDescription: "مساعدك الذكي للتنقل في المسائل القانونية والبقاء آمناً من عمليات النصب في تونس.",
        featureDescriptionMessageScam: "تحليل الرسائل لكشف عمليات النصب المحتملة.",
        featureDescriptionCallShield: "كشف أساليب النصب في المكالمات الهاتفية.",
        featureDescriptionAudioShield: "تحليل الملفات الصوتية بحثًا عن محتوى مشبوه.", // New
        featureDescriptionDocumentCheck: "فحص الوثائق بحثاً عن علامات التزوير.",
        featureDescriptionLegalAssistant: "اطرح أسئلة قانونية باللهجة التونسية.",
        featureDescriptionLegalResources: "الوصول إلى مساعدة جمركية ومعلومات الحقوق القانونية.",
        featureDescriptionCustomsHelp: "احصل على قوائم مرجعية للإجراءات الجمركية.",
        featureDescriptionLegalRights: "ملخصات لحقوقك القانونية.",
        featureDescriptionMisinfoDebunker: "تحقق من الأخبار وكشف المعلومات المضللة.",
        featureDescriptionEmergency: "إجراءات سريعة للحالات عالية الخطورة.",
        goToFeature: "الذهاب إلى {{featureName}}",
        recentScamsFeed: "آخر عمليات النصب المنتشرة (تونس)",
        communityShield: "الحماية الجماعية",
        preventionTips: "نصائح وقائية",
        reportScamAnonymous: "Help others by reporting this scam (anonymously)",
        scamsReportedThisMonth: "{{count}} بلاغًا هذا الشهر في {{location}}.",
        scamMapFeatureComingSoon: "(خريطة انتشار النصب - قريباً)",
        howToScan: "كيفية الفحص؟",
        selectFromConversationsAndroid: "اختر من محادثاتك (Android فقط)",
        autoScanNewMessages: "فحص تلقائي للرسائل الجديدة؟",
        exampleScamOoredoo: "تحذير: نصابة 'هدية مجانية من Ooredoo' تنتشر اليوم!",
        exampleScamBank: "تنبيه: رسائل احتيالية تدعي غلق حساب بنكي تنتشر بكثرة.",
        feedComingSoon: "(موجز حي للبلاغات عن النصب من المستخدمين - قريباً)",
        tipOtp: "لا تشارك رمز OTP أبدًا!",
        tipBankSms: "البنوك لا تراسلك عبر الرسائل القصيرة/الواتساب لطلب معلومات حساسة.",
        tipGovLinks: "الروابط الحكومية تنتهي بـ .gov.tn أو .tn.",
        tipSenderIdentity: "تحقق دائمًا من هوية المرسل قبل الرد.",
        tipTooGoodToBeTrue: "إذا بدا العرض جيدًا لدرجة يصعب تصديقها، فهو على الأرجح نصب.",
        callShieldDescription: "قم بتحميل تسجيل مكالمة لتحليله بحثًا عن أساليب النصب المعروفة، مثل طلبات OTP، واحصل على تحذيرات فورية.",
        audioShieldDescription: "قم بتحميل ملف صوتي لتحليله بحثًا عن محتوى مشبوه، أساليب نصب، أو معلومات مضللة.", // New
        liveCallProtection: "الحماية المباشرة للمكالمات",
        liveProtectionDescription: "تحليل ذكاء اصطناعي فوري للمكالمات الجارية لكشف عمليات النصب. (الميزة قيد التطوير)",
        orUploadRecording: "أو، قم بتحميل تسجيل مكالمة",
        uploadAudioInstruction: "قم بتحميل أي ملف صوتي لتحليله بحثًا عن محتوى مشبوه أو ضار.", // New
        knownScamsLibrary: "مكتبة النصب المعروفة (أمثلة صوتية)",
        knownScamsLibraryDesc: "تعرف على أساليب النصب الهاتفي الشائعة مع أمثلة صوتية ونصائح للرد.", // New
        scamTypePhishing: "محاولة تصيد",
        scamTypeImpersonation: "نصبة انتحال شخصية",
        scamTypeTechSupport: "نصبة الدعم الفني",
        libraryComingSoon: "(مكتبة أمثلة مكالمات نصب - قريباً)",
        documentCheckDescription: "قم بتحميل 'وثائق رسمية' مشبوهة (مثل صور لأوامر قضائية، عقود PDF) لفحصها بحثًا عن تزوير محتمل.",
        uploadMethod: "طريقة التحميل",
        scanWithCamera: "مسح بالكاميرا",
        uploadFromFile: "تحميل من ملف",
        commonDocumentForgeries: "تزويرات شائعة للوثائق",
        forgeryTypeFakeInvoice: "فاتورة مزورة",
        forgeryTypeAlteredContract: "عقد مُعدل",
        forgeryTypeForgedSignature: "توقيع/ختم مزور",
        legalToolkit: "مجموعة الأدوات القانونية",
        contactAuthorities: "اتصل بالسلطات",
        contactLawyer: "استشر محاميًا",
        customsHelpDescription: "احصل على قوائم مرجعية، روابط وتقديرات للإجراءات الجمركية والبيروقراطية الشائعة في تونس.",
        legalRightsDescription: "ملخصات سريعة للحقوق القانونية حول مواضيع مختلفة (مثل العمل، السكن) لتونس.",
        legalAssistantHubDescription: "Select your preferred language to interact with the Legal Assistant. Ask your legal or customs questions; the AI will explain the steps in simple terms.",
        selectLanguagePrompt: "الرجاء اختيار لغتك المفضلة للمساعد القانوني:",
        misinfoDebunkerDescription: "ألصق محتوى الأخبار (خاصة السياسية أو الصحية) للتحقق مما إذا كانت أخبارًا كاذبة منتشرة. سيشرح الذكاء الاصطناعي سبب كونها كاذبة ويقدم مصادر موثوقة.",
        emergencyModeDescription: "إذا كنت في وضعية نصب عالية الخطورة (مثلاً، تتعرض لضغط لإرسال أموال)، قم بتفعيل هذا الوضع.",
        emergencyModeActiveMessage: "تم تنبيه جهات الاتصال الموثوقة (محاكاة). حافظ على هدوئك. استخدم النماذج أدناه.",
        legalResponseTemplates: "نماذج ردود قانونية جاهزة",
        useTheseResponses: "استخدم هذه الردود إذا كنت تتعرض لضغط.",
        legalPromptVerifyOfficial: "أحتاج إلى التحقق من هذه المعلومات من مصادر رسمية قبل المتابعة.",
        legalPromptNotAuthorizedShare: "لست مخولاً بمشاركة هذه المعلومات عبر الهاتف/الرسائل.",
        legalPromptConsultAdvisor: "سأستشير مستشارًا قانونيًا قبل اتخاذ أي إجراء.",
        legalPromptProvideOfficialDoc: "يرجى تقديم وثائق رسمية يمكنني التحقق منها بشكل مستقل.",
        legalPromptNoFinancialPressure: "أنا لا أتخذ قرارات مالية تحت الضغط.",
        legalPromptTunisianLawFraud: "قد يكون هذا الطلب مخالفًا للقانون التونسي، على سبيل المثال، الفصل 291 من المجلة الجزائية المتعلق بالتحيل. أحتاج إلى التحقق من قانونيته.",
        legalPromptReportSuspicious: "سأبلغ السلطات المعنية بأي نشاط مشبوه.",
        pageSubtitleScamProtection: "حماية نفسك من النصب في ثواني",
        voiceInputDisclaimer: "(فكرة مبدئية: اضغط للتحدث بالرسالة)",
        legalContextArticle254: "المادة 254 من القانون الجنائي: النصب الإلكتروني يعاقب بالسجن.",
        quickActionsTitle: "إجراءات سريعة",
        prewrittenScamResponse: "هذه رسالة نصب. تم الإبلاغ عنكم.",
        communityShieldDescription: "هل تريد تحذير الآخرين؟",
        noResultsYet: "ستظهر نتائج الفحص هنا بمجرد إرسال رسالة.",
        noResultsYetAudio: "ستظهر نتائج التحليل هنا بمجرد إرسال ملف صوتي.", // New
        pageSubtitleCallShield: "حاصر النصّابين قبل ما يخدعوك!",
        pageSubtitleAudioShield: "اكتشف المحتوى الضار في أي ملف صوتي.", // New
        liveCallPrivacyDisclaimer: "لا نسجل المكالمات. التحليل يتم أثناء الاتصال فقط.",
        realTimeAlertsTitle: "تنبيهات في الوقت الحقيقي (تصوري)",
        voicePatternDetection: "كشف نمط الصوت",
        voicePatternDetectionExample: "الذكاء الاصطناعي يقطع المكالمة إذا استخدم المتصل نصوص نصب (مثال: 'أحتاج رمز OTP الخاص بك').",
        numberCheck: "فحص الرقم",
        numberCheckExample: "يتحقق من قاعدة بيانات النصب الجماعية (مثال: '+216 XX XXX XXX: 42 بلاغًا كنصبة تونس تلكوم').",
        callAnalysisReportTitle: "تقرير تحليل المكالمة",
        audioAnalysisReportTitle: "تقرير تحليل الصوت", // New
        fakeBankScam: "نصبة البنك الوهمي", // Example
        potentialMisinformation: "معلومات مضللة محتملة", // New Example
        callerRequestedSensitiveInfo: "الطالب طلب معلومات حساسة.",
        unknownSuspiciousNumber: "رقم مجهول/مشبوه.",
        legalArticle201Bis: "السياق القانوني: المادة 201 مكرر من القانون الجنائي - التهديد الإلكتروني جريمة.",
        callScamExampleTT: "فاتورة غير مدفوعة من اتصالات تونس",
        callScamExampleJudiciary: "مكالمة من 'القضاء' تطلب غرامة فورية",
        callScamExampleFakeJob: "عروض توظيف وهمية عبر الهاتف",
        sampleAudioClip: "عينة صوتية",
        scriptBreakdown: "تحليل النص",
        howToRespond: "كيفية الرد",
        emergencyModeIntegrationDesc: "إذا كشف الذكاء الاصطناعي عن عملية نصب تحت ضغط عالي (مثال: 'ابنك في خطر! أرسل المال الآن!'):",
        emergencyFlashAlert: "⚠️ خطر! النصّاب يحاول تخويفك!",
        emergencyActionLocation: "إرسال تلقائي للموقع المباشر إلى جهة اتصال موثوقة.",
        emergencyActionPoliceCall: "تشغيل تلقائي لرسالة مسجلة مسبقًا: 'هذه مكالمة مشبوهة. سأتصل بالشرطة.'",
        callRecordingUploadInstruction: "قم بتحميل تسجيل مكالمة لتحليله بحثًا عن أساليب النصب المعروفة.",
        defaultScamReason: "المكالمة تظهر أنماطًا تتفق مع أساليب النصب المعروفة.",
        defaultSuspiciousReason: "يُظهر الصوت أنماطًا تتوافق مع محتوى قد يكون مشبوهًا أو ضارًا.", // New
        pageSubtitleDocumentCheck: "حتى الورقة الرسمية ممكن تكون نصابة!",
        voiceGuidanceDocumentCheck: "صور المحضر أو العقد وخلينا نفحصو.",
        fakeStamp: "ختم مزور",
        fakeStampDesc: "الختم غير مطابق للنموذج الرسمي.",
        mismatchedFont: "خط مختلف",
        mismatchedFontDesc: "الخط مختلف عن وثائق وزارة الداخلية.",
        alteredDate: "تاريخ معدل",
        alteredDateDesc: "التاريخ يبدو معدلاً رقمياً.",
        saveSecureCopyDesc: "(تخزين محلي فقط)",
        fakePoliceReport: "محاضر شرطة مزورة",
        fakePoliceReportDesc: "استدعاءات أو غرامات مزورة.",
        propertyScam: "نصبات بيع عقارات وهمية",
        propertyScamDesc: "عقود وهمية لعقارات غير موجودة.",
        customsDutyFraud: "نصبات الفواتير الجمركية",
        customsDutyFraudDesc: "فواتير مزورة لدفعات جمركية.",
        sideBySideComparison: "مقارنة جنبًا إلى جنب مع وثائق حقيقية.",
        redCircleIndicators: "مؤشرات بدائرة حمراء للفروقات.",
        reportToPublicProsecutorDesc: "يولد بلاغًا مُعبأ مسبقًا مع صور الوثيقة ونقاط التزوير المكتشفة.",
        penalCodeArticle96: "مواد قانون العقوبات ذات الصلة (مثال: المادة 96 للتزوير).",
        scamMapDocCheck: "تم الإبلاغ عن {{count}} وثيقة مزورة بهذه الطريقة في ولايتك.",
        officialTemplates: "نماذج رسمية",
        howToVerifyYourself: "كيف تتأكد من وثيقة بنفسك؟",
        qrCodeCheck: "فحص رمز الاستجابة السريعة للوثائق الإلكترونية.",
        hotlineNumbers: "أرقام الخطوط الساخنة للوزارات.",
        localProcessing: "معالجة محلية (الخصوصية أولاً)",
        tunisianDocDatabase: "قاعدة بيانات الوثائق التونسية",
        offlineMode: "وضع عدم الاتصال",
        userScenarioDocCheck: "هذه الوثيقة استعملت في 7 عمليات نصب سابقة.",
        elderMode: "وضع كبار السن",
        magnifyingGlass: "أداة عدسة مكبرة لفحص التفاصيل.",
        audioExplanation: "شرح صوتي لمؤشرات التزوير.",
        notaryMode: "وضع الموثقين",
        batchScan: "للمهنيين لفحص الوثائق دفعة واحدة.",
        threeIndicators: "3 مؤشرات تزوير!",
        documentUsedInScams: "هذه الوثيقة استعملت في {{count}} عمليات نصب سابقة.",
        localProcessingDesc: "لا يتم التحميل على السحابة.",
        tunisianDocDatabaseDesc: "أكثر من 1000 نموذج معتمد (بالشراكة مع وزارة العدل)، أنماط نصب تشاركية.",
        offlineModeDesc: "الفحوصات الأساسية متاحة بدون إنترنت.",
        templatePoliceReport: "نموذج محضر شرطة حقيقي",
        templateSalesContract: "نموذج عقد بيع موثق",
        verificationStepQr: "تحقق من رموز QR على الوثائق الإلكترونية.",
        verificationStepHotline: "اتصل بالخطوط الساخنة للوزارات للتحقق من الأصالة.",
        elderModeDesc: "واجهة مبسطة لكبار السن.",
        magnifyingGlassDesc: "تكبير تفاصيل الوثيقة.",
        audioExplanationDesc: "استمع إلى مؤشرات التزوير باللهجة التونسية.",
        notaryModeDesc: "أدوات احترافية للموثقين.",
        batchScanDesc: "فحص عدة وثائق بسرعة.",
        pageSubtitleLegalAssistant: "اطرح أسئلة قانونية بالدارجة، الفرنسية أو الإنجليزية. سيقدم الذكاء الاصطناعي شروحًا واضحة والمواد القانونية ذات الصلة.",
        autoDetectLanguageConcept: "(سيحاول الذكاء الاصطناعي كشف لغة الإدخال تلقائياً)",
        voiceInputLegalAssistant: "اطرح سؤالك بصوتك",
        emergencyConfirmActivation: "تفعيل وضع الطوارئ سيحاكي تنبيه جهات الاتصال الموثوقة ويزودك بنصائح تعتمد على الذكاء الاصطناعي وردود قانونية معدة مسبقًا. هل أنت متأكد من المتابعة؟",
        emergencyActiveToastDesc: "يتم تنبيه جهات الاتصال الموثوقة (محاكاة). صف وضعك للحصول على نصيحة الذكاء الاصطناعي أو استخدم الردود الثابتة.",
        emergencyDeactivatedToastDesc: "لقد خرجت من وضع الطوارئ.",
        copiedToClipboardSuffix: "تم نسخه إلى الحافظة.",
        describeSituationSubtext: "قدم تفاصيل للحصول على نصيحة مخصصة من الذكاء الاصطناعي وردود مقترحة.",
        scamTacticsExplanation: "غالبًا ما يستخدم المحتالون الإلحاح أو السلطة أو العروض المغرية لخداعك. قد يطلبون معلومات شخصية أو رموز OTP أو تحويلات مالية مباشرة. كن دائمًا متشككًا في الطلبات غير المرغوب فيها وتحقق من المعلومات بشكل مستقل عبر القنوات الرسمية.",
        videoPlaceholderDesc: "(مفهوم: سيتم هنا تضمين مقطع فيديو قصير يشرح عمليات الاحتيال الشائعة وكيفية تجنبها.)",
        recordAudioDisclaimer: "(مفهوم الميزة: انقر لتسجيل الصوت للتحليل)", // New
    },
    dialogTitles: {
        educationalResources: "مصادر تعليمية",
    },
    dialogDescriptions: {
        learnMoreAboutScams: "تعرف على المزيد حول عمليات الاحتيال الشائعة وكيفية حماية نفسك.",
    },
    headings: {
        understandingScamTactics: "فهم أساليب الاحتيال",
        watchOurVideoGuide: "شاهد دليل الفيديو الخاص بنا",
    },
      locales: {
        tunis: "تونس العاصمة",
      }
  },
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Translations;
  textDirection: LanguageDirection;
  translate: (keyPath: string, substitutions?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(languages[0].code); // Default to first language
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('appLanguage');
    if (storedLanguage && languages.some(l => l.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    } else {
      const browserLanguage = navigator.language.split('-')[0];
      const foundLanguage = languages.find(l => l.code === browserLanguage);
      if (foundLanguage) {
        setLanguageState(foundLanguage.code);
      }
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (langCode: string) => {
    if (languages.some(l => l.code === langCode)) {
      setLanguageState(langCode);
      localStorage.setItem('appLanguage', langCode);
    }
  };

  useEffect(() => {
    if(isInitialized) {
        const currentLang = languages.find(l => l.code === language) || languages[0];
        document.documentElement.dir = currentLang.direction;
        document.documentElement.lang = currentLang.code;
    }
  }, [language, isInitialized]);


  const currentTranslations = defaultTranslations[language] || defaultTranslations.en;
  const currentLanguageDetails = languages.find(l => l.code === language) || languages[0];
  const textDirection = currentLanguageDetails.direction;

  const translate = useCallback((keyPath: string, substitutions?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let result: any = currentTranslations;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        let fallbackText: any = defaultTranslations.en; 
        for (const fbKey of keys) {
            fallbackText = fallbackText?.[fbKey];
            if(fallbackText === undefined) return keyPath; 
        }
        result = fallbackText;
        break;
      }
    }
    if (typeof result === 'string' && substitutions) {
      return Object.entries(substitutions).reduce((acc, [placeholder, value]) => {
        return acc.replace(new RegExp(`{{\\s*${placeholder}\\s*}}`, 'g'), String(value));
      }, result);
    }
    return typeof result === 'string' ? result : keyPath;
  }, [language, currentTranslations]);


  const value = {
    language,
    setLanguage,
    translations: currentTranslations,
    textDirection,
    translate,
  };
  
  if (!isInitialized) {
    return null; // Or a loading spinner, but null is fine for context usually
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

