
'use server';
/**
 * @fileOverview An AI agent that provides advice and relevant legal prompts during an emergency scam situation.
 *
 * - emergencyAdvisor - A function that handles the emergency advice process.
 * - EmergencyAdvisorInput - The input type for the emergencyAdvisor function.
 * - EmergencyAdvisorOutput - The return type for the emergencyAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmergencyAdvisorInputSchema = z.object({
  situationDescription: z.string().describe('A description of the high-risk scam situation the user is currently in.'),
  language: z.enum(['en', 'fr', 'ar']).default('en').describe('The preferred language for the response (en, fr, ar).'),
});
export type EmergencyAdvisorInput = z.infer<typeof EmergencyAdvisorInputSchema>;

const EmergencyAdvisorOutputSchema = z.object({
  advice: z.string().describe('Tailored advice for the user based on their situation, emphasizing safety and caution. Should be in the requested language.'),
  relevantPrompts: z.array(z.string()).describe('A list of 2-3 concise, pre-written legal or assertive responses the user can say or type to the scammer. Should be in the requested language and appropriate for Tunisia.'),
  immediateActions: z.array(z.string()).describe('A list of 1-2 immediate, actionable steps the user should consider (e.g., "Do not send any money", "Disconnect the call/chat"). Should be in the requested language.'),
});
export type EmergencyAdvisorOutput = z.infer<typeof EmergencyAdvisorOutputSchema>;

export async function emergencyAdvisor(input: EmergencyAdvisorInput): Promise<EmergencyAdvisorOutput> {
  return emergencyAdvisorFlow(input);
}

const baseLegalPrompts = {
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

const getPromptsForLanguage = (lang: 'en' | 'fr' | 'ar'): string => {
  const prompts = baseLegalPrompts[lang] || baseLegalPrompts.en;
  return prompts.map(p => `- "${p}"`).join('\n    ');
};

// Define a new schema for the prompt's internal input, extending the flow's input schema
const EmergencyAdvisorPromptInternalInputSchema = EmergencyAdvisorInputSchema.extend({
    isAr: z.boolean().describe("Flag indicating if the language is Arabic."),
    isFr: z.boolean().describe("Flag indicating if the language is French."),
    isEn: z.boolean().describe("Flag indicating if the language is English.")
});

const prompt = ai.definePrompt({
  name: 'emergencyAdvisorPrompt',
  input: {schema: EmergencyAdvisorPromptInternalInputSchema}, // Use the new extended schema
  output: {schema: EmergencyAdvisorOutputSchema},
  prompt: `You are an AI assistant for DroitBot, specializing in providing immediate guidance during high-risk scam situations in Tunisia.
The user has activated Emergency Mode and described their situation. Your response MUST be in {{language}}.

User's situation: {{{situationDescription}}}

Based on this situation:
1.  Provide concise, calming, and actionable **advice**. Focus on immediate safety, de-escalation, and avoiding rash decisions (like sending money or personal information).
2.  Suggest 2-3 **relevantPrompts** from the list below that the user can say or type to the scammer. Choose the most appropriate ones for the described situation. If none seem perfectly fitting, adapt one or create a very similar one. The prompts should be assertive but not overly aggressive.
    Available prompts (choose or adapt based on user's language '{{language}}'):
    {{#if isAr}}${getPromptsForLanguage('ar')}{{/if}}{{#if isFr}}${getPromptsForLanguage('fr')}{{/if}}{{#if isEn}}${getPromptsForLanguage('en')}{{/if}}
3.  List 1-2 very clear **immediateActions** the user should take (e.g., "End the call/chat immediately.", "Do NOT click any links.", "Do NOT share any codes or passwords.").

Prioritize the user's safety and help them disengage from the scammer.
Keep all outputs concise and easy to understand in an emergency.
Your response MUST be in the requested language: {{language}}.
`,
});

const emergencyAdvisorFlow = ai.defineFlow(
  {
    name: 'emergencyAdvisorFlow',
    inputSchema: EmergencyAdvisorInputSchema, // Flow input remains the original schema
    outputSchema: EmergencyAdvisorOutputSchema,
  },
  async (input) => { // input here is EmergencyAdvisorInput
    const isAr = input.language === 'ar';
    const isFr = input.language === 'fr';
    const isEn = input.language === 'en' || (!isAr && !isFr); // Default to 'en' if not 'ar' or 'fr'

    const promptInput = {
        ...input,
        isAr,
        isFr,
        isEn,
    };

    const {output} = await prompt(promptInput); // Pass the extended input to the prompt
     if (!output || !output.advice) { // Basic check if output is missing or incomplete
        const lang = input.language || 'en';
        const defaultPrompts = baseLegalPrompts[lang as keyof typeof baseLegalPrompts] || baseLegalPrompts.en;
        let adviceText = "Stay calm and do not send any money or personal information. Try to safely end the call or chat.";
        let actions = ["Do not send any money.", "End the call immediately."];

        if (lang === 'ar') {
            adviceText = "حافظ على هدوئك ولا تقم بإرسال أي أموال أو معلومات شخصية. حاول إنهاء الاتصال أو المحادثة بأمان.";
            actions = ["لا ترسل أي أموال.", "أنهِ الاتصال فورًا."];
        } else if (lang === 'fr') {
            adviceText = "Restez calme et n'envoyez pas d'argent ni d'informations personnelles. Essayez de mettre fin à l'appel ou à la discussion en toute sécurité.";
            actions = ["N'envoyez pas d'argent.", "Mettez fin à l'appel immédiatement."];
        }
        
        return {
            advice: adviceText,
            relevantPrompts: defaultPrompts.slice(0, 2),
            immediateActions: actions,
        };
    }
    return output;
  }
);
