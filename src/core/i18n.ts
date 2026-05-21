import type { SupportedLocale } from "@core/constants";

type Messages = Record<string, string>;
type LocaleMessages = { [K in SupportedLocale]?: Messages };

let currentLocale: SupportedLocale = "en";
let currentMessages: Messages = {};

const messageCache: LocaleMessages = {};

export async function loadLocale(locale: SupportedLocale): Promise<void> {
  if (messageCache[locale]) {
    currentLocale = locale;
    currentMessages = messageCache[locale];
    return;
  }

  const messages = (await import(`./locales/${locale}.ts`)) as { default: Messages };
  messageCache[locale] = messages.default;
  currentLocale = locale;
  currentMessages = messages.default;
}

export function t(key: string, replacements?: Record<string, string>): string {
  let message = currentMessages[key] ?? key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      message = message.replaceAll(`{{${k}}}`, v);
    }
  }
  return message;
}

export function getCurrentLocale(): SupportedLocale {
  return currentLocale;
}
