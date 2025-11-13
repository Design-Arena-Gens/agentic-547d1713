'use client';

import { useState } from 'react';
import { Book, Clock, Compass, Heart, Moon, Sun, Globe, BookOpen } from 'lucide-react';
import QuranViewer from '@/components/QuranViewer';
import HadithBrowser from '@/components/HadithBrowser';
import PrayerTimes from '@/components/PrayerTimes';
import QiblaFinder from '@/components/QiblaFinder';
import AdhkarLibrary from '@/components/AdhkarLibrary';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';

type Tab = 'quran' | 'hadith' | 'prayer' | 'qibla' | 'adhkar';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('quran');
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const tabs = [
    { id: 'quran' as Tab, icon: Book, label: 'quran' as const },
    { id: 'hadith' as Tab, icon: BookOpen, label: 'hadith' as const },
    { id: 'prayer' as Tab, icon: Clock, label: 'prayer' as const },
    { id: 'qibla' as Tab, icon: Compass, label: 'qibla' as const },
    { id: 'adhkar' as Tab, icon: Heart, label: 'adhkar' as const },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-emerald-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl">☪</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {t('appName')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t(tab.label)}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'quran' && <QuranViewer />}
          {activeTab === 'hadith' && <HadithBrowser />}
          {activeTab === 'prayer' && <PrayerTimes />}
          {activeTab === 'qibla' && <QiblaFinder />}
          {activeTab === 'adhkar' && <AdhkarLibrary />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-emerald-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>{t('footer')}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
