'use client';

import { useState, useEffect } from 'react';
import { Search, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  surah: { number: number; name: string };
}

interface Translation {
  text: string;
}

export default function QuranViewer() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [translations, setTranslations] = useState<{ [key: number]: Translation }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchSurahs();
    const saved = localStorage.getItem('quran-bookmarks');
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      fetchVerses(selectedSurah);
    }
  }, [selectedSurah, language]);

  const fetchSurahs = async () => {
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await response.json();
      setSurahs(data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const fetchVerses = async (surahNumber: number) => {
    setLoading(true);
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
      ]);

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      setVerses(arabicData.data.ayahs);

      const translationsMap: { [key: number]: Translation } = {};
      translationData.data.ayahs.forEach((ayah: any, index: number) => {
        translationsMap[index + 1] = { text: ayah.text };
      });
      setTranslations(translationsMap);
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (surahNumber: number, verseNumber: number) => {
    const key = `${surahNumber}:${verseNumber}`;
    const newBookmarks = new Set(bookmarks);

    if (newBookmarks.has(key)) {
      newBookmarks.delete(key);
    } else {
      newBookmarks.add(key);
    }

    setBookmarks(newBookmarks);
    localStorage.setItem('quran-bookmarks', JSON.stringify([...newBookmarks]));
  };

  const isBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.has(`${surahNumber}:${verseNumber}`);
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.includes(searchTerm) ||
      surah.number.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Surah Selection */}
      {!selectedSurah ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchSurah')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {filteredSurahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => setSelectedSurah(surah.number)}
                className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-lg hover:shadow-lg transition-all border border-emerald-200 dark:border-gray-600 text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {surah.number}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {surah.englishName}
                      </h3>
                    </div>
                    <p className="text-2xl arabic-text text-emerald-700 dark:text-emerald-400 mb-1">
                      {surah.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {surah.englishNameTranslation}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {surah.numberOfAyahs} {t('verses')} • {surah.revelationType}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <button
              onClick={() => setSelectedSurah(null)}
              className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← {t('search')}
            </button>
            {surahs.find((s) => s.number === selectedSurah) && (
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">
                  {surahs.find((s) => s.number === selectedSurah)?.englishName}
                </h2>
                <p className="text-4xl arabic-text mb-2">
                  {surahs.find((s) => s.number === selectedSurah)?.name}
                </p>
                <p className="text-lg opacity-90">
                  {surahs.find((s) => s.number === selectedSurah)?.englishNameTranslation}
                </p>
              </div>
            )}
          </div>

          {/* Verses */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verses.map((verse) => (
                <div
                  key={verse.number}
                  className="verse-card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                        {verse.numberInSurah}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleBookmark(selectedSurah, verse.numberInSurah)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {isBookmarked(selectedSurah, verse.numberInSurah) ? (
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 fill-current" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>

                  <p className="arabic-text text-gray-900 dark:text-white mb-4 leading-loose">
                    {verse.text}
                  </p>

                  <button
                    onClick={() =>
                      setExpandedVerse(expandedVerse === verse.numberInSurah ? null : verse.numberInSurah)
                    }
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    {expandedVerse === verse.numberInSurah ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Hide {t('translation')}</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Show {t('translation')}</span>
                      </>
                    )}
                  </button>

                  {expandedVerse === verse.numberInSurah && translations[verse.numberInSurah] && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {translations[verse.numberInSurah].text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
