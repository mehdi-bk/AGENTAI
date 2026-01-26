/**
 * Language Switcher Component
 * MBK: Displays language selector in the top right corner with FR / ENG options
 */
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setLanguage('FR')}
        className={`px-3 py-1 rounded font-medium transition-all ${
          language === 'FR'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:text-primary'
        }`}
      >
        FR
      </button>
      <span className="text-gray-300">/</span>
      <button
        onClick={() => setLanguage('ENG')}
        className={`px-3 py-1 rounded font-medium transition-all ${
          language === 'ENG'
            ? 'bg-primary text-white'
            : 'text-gray-600 hover:text-primary'
        }`}
      >
        ENG
      </button>
    </div>
  );
}
