
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Language = 'en' | 'ne';

const languageLabels: Record<Language, string> = {
  en: 'English',
  ne: 'नेपाली',
};

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // In a real implementation, this would trigger language context change
    // and possibly store preference in localStorage
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-burgundy">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={currentLanguage === lang ? "font-bold bg-cream-dark" : ""}
          >
            {languageLabels[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
