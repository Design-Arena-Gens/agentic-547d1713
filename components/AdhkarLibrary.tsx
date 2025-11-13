'use client';

import { useState } from 'react';
import { Sun, Moon, Bed, Coffee, Plane, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Dhikr {
  arabic: string;
  transliteration: string;
  translation: string;
  repeat: number;
  reference?: string;
}

interface AdhkarCategory {
  id: string;
  icon: any;
  color: string;
  adhkar: Dhikr[];
}

export default function AdhkarLibrary() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedCounts, setCompletedCounts] = useState<{ [key: string]: number }>({});

  const categories: { [key: string]: AdhkarCategory } = {
    morning: {
      id: 'morning',
      icon: Sun,
      color: 'from-yellow-400 to-orange-500',
      adhkar: [
        {
          arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
          transliteration: "Aṣbaḥnā wa-aṣbaḥa 'l-mulku lillāh",
          translation:
            'We have entered the morning and the dominion belongs to Allah',
          repeat: 1,
          reference: 'Muslim',
        },
        {
          arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
          transliteration: "Allāhumma bika aṣbaḥnā wa-bika amsaynā",
          translation:
            'O Allah, by You we enter the morning and by You we enter the evening',
          repeat: 1,
          reference: 'At-Tirmidhi',
        },
        {
          arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
          transliteration: "A'ūdhu billāhi min ash-shayṭān ar-rajīm",
          translation: 'I seek refuge in Allah from the accursed devil',
          repeat: 3,
        },
      ],
    },
    evening: {
      id: 'evening',
      icon: Moon,
      color: 'from-purple-500 to-indigo-600',
      adhkar: [
        {
          arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
          transliteration: "Amsaynā wa-amsā 'l-mulku lillāh",
          translation:
            'We have entered the evening and the dominion belongs to Allah',
          repeat: 1,
          reference: 'Muslim',
        },
        {
          arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
          transliteration: "Allāhumma innī as'aluka 'l-'āfiyah",
          translation: 'O Allah, I ask You for well-being',
          repeat: 1,
        },
      ],
    },
    sleep: {
      id: 'sleep',
      icon: Bed,
      color: 'from-blue-500 to-cyan-600',
      adhkar: [
        {
          arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
          transliteration: 'Bismika Allāhumma amūtu wa-aḥyā',
          translation: 'In Your name, O Allah, I die and I live',
          repeat: 1,
          reference: 'Al-Bukhari',
        },
        {
          arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
          transliteration: "Allāhumma qinī 'adhābaka yawma tab'athu 'ibādak",
          translation:
            'O Allah, protect me from Your punishment on the Day You resurrect Your servants',
          repeat: 3,
          reference: 'Abu Dawud',
        },
      ],
    },
    wakeup: {
      id: 'wakeup',
      icon: Coffee,
      color: 'from-green-500 to-emerald-600',
      adhkar: [
        {
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
          transliteration:
            "Al-ḥamdu lillāh alladhī aḥyānā ba'da mā amātanā wa-ilayhi 'n-nushūr",
          translation:
            'Praise be to Allah who gave us life after death and to Him is the resurrection',
          repeat: 1,
          reference: 'Al-Bukhari',
        },
      ],
    },
    meal: {
      id: 'meal',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      adhkar: [
        {
          arabic: 'بِسْمِ اللَّهِ',
          transliteration: 'Bismillāh',
          translation: 'In the name of Allah',
          repeat: 1,
        },
        {
          arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',
          transliteration: "Al-ḥamdu lillāh alladhī aṭ'amanā wa-saqānā",
          translation: 'Praise be to Allah who fed us and gave us drink',
          repeat: 1,
          reference: 'Abu Dawud',
        },
      ],
    },
    travel: {
      id: 'travel',
      icon: Plane,
      color: 'from-teal-500 to-cyan-600',
      adhkar: [
        {
          arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا',
          transliteration: 'Subḥān alladhī sakhkhara lanā hādhā',
          translation: 'Glory be to Him who has subjected this to us',
          repeat: 1,
          reference: 'At-Tirmidhi',
        },
        {
          arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ',
          transliteration:
            "Allāhumma innā nas'aluka fī safarinā hādhā 'l-birra wa-'t-taqwā",
          translation:
            'O Allah, we ask You for righteousness and piety in this journey of ours',
          repeat: 1,
          reference: 'Muslim',
        },
      ],
    },
  };

  const categoryNames: { [key: string]: string } = {
    morning: t('morning'),
    evening: t('evening'),
    sleep: t('sleep'),
    wakeup: t('wakeup'),
    meal: t('meal'),
    travel: t('travel'),
  };

  const incrementCount = (categoryId: string, dhikrIndex: number) => {
    const key = `${categoryId}-${dhikrIndex}`;
    const category = categories[categoryId];
    const dhikr = category.adhkar[dhikrIndex];
    const currentCount = completedCounts[key] || 0;

    if (currentCount < dhikr.repeat) {
      setCompletedCounts({
        ...completedCounts,
        [key]: currentCount + 1,
      });
    } else {
      setCompletedCounts({
        ...completedCounts,
        [key]: 0,
      });
    }
  };

  return (
    <div className="space-y-6">
      {!selectedCategory ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('adhkar')} Library
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600 text-left group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {categoryNames[key]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.adhkar.length} {t('adhkar')}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className={`bg-gradient-to-r ${categories[selectedCategory].color} rounded-xl shadow-lg p-6 text-white`}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← Back to Categories
            </button>
            <div className="flex items-center gap-4">
              {(() => {
                const Icon = categories[selectedCategory].icon;
                return <Icon className="w-12 h-12" />;
              })()}
              <div>
                <h2 className="text-3xl font-bold">
                  {categoryNames[selectedCategory]}
                </h2>
                <p className="text-lg opacity-90">
                  {categories[selectedCategory].adhkar.length} supplications
                </p>
              </div>
            </div>
          </div>

          {/* Adhkar List */}
          <div className="space-y-4">
            {categories[selectedCategory].adhkar.map((dhikr, index) => {
              const key = `${selectedCategory}-${index}`;
              const currentCount = completedCounts[key] || 0;
              const isCompleted = currentCount >= dhikr.repeat;

              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <p className="arabic-text text-gray-900 dark:text-white mb-4 leading-loose">
                    {dhikr.arabic}
                  </p>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm italic text-gray-700 dark:text-gray-300">
                      {dhikr.transliteration}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {dhikr.translation}
                    </p>
                    {dhikr.reference && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Reference: {dhikr.reference}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('repeat')} {dhikr.repeat} {t('times')}
                    </div>
                    <button
                      onClick={() => incrementCount(selectedCategory, index)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg text-white'
                      }`}
                    >
                      {currentCount} / {dhikr.repeat}
                      {isCompleted && ' ✓'}
                    </button>
                  </div>

                  {dhikr.repeat > 1 && currentCount > 0 && !isCompleted && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${(currentCount / dhikr.repeat) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Button */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <button
              onClick={() => {
                const newCounts = { ...completedCounts };
                categories[selectedCategory].adhkar.forEach((_, index) => {
                  newCounts[`${selectedCategory}-${index}`] = 0;
                });
                setCompletedCounts(newCounts);
              }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-900 dark:text-white"
            >
              Reset Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
