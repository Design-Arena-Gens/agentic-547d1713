'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface HadithCollection {
  name: string;
  arabicName: string;
  hadiths: number;
}

interface Hadith {
  number: number;
  arab: string;
  id: number;
}

export default function HadithBrowser() {
  const [collections] = useState<HadithCollection[]>([
    { name: 'Sahih Bukhari', arabicName: 'صحيح البخاري', hadiths: 7563 },
    { name: 'Sahih Muslim', arabicName: 'صحيح مسلم', hadiths: 7470 },
    { name: 'Sunan Abu Dawood', arabicName: 'سنن أبي داود', hadiths: 5274 },
    { name: 'Jami At-Tirmidhi', arabicName: 'جامع الترمذي', hadiths: 3956 },
    { name: 'Sunan An-Nasai', arabicName: 'سنن النسائي', hadiths: 5758 },
    { name: 'Sunan Ibn Majah', arabicName: 'سنن ابن ماجه', hadiths: 4341 },
  ]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedCollection) {
      fetchHadiths(selectedCollection, currentPage);
    }
  }, [selectedCollection, currentPage]);

  const fetchHadiths = async (collection: string, page: number) => {
    setLoading(true);
    try {
      const collectionSlug = collection.toLowerCase().replace(/\s+/g, '-');
      const response = await fetch(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${collectionSlug}${page}.json`
      );
      const data = await response.json();
      setHadiths(data.hadiths || []);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      // Fallback to sample data
      setHadiths([
        {
          number: 1,
          arab: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
          id: 1,
        },
        {
          number: 2,
          arab: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
          id: 2,
        },
        {
          number: 3,
          arab: 'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ أَوْ بِضْعٌ وَسِتُّونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لَا إِلَهَ إِلَّا اللَّهُ',
          id: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedCollection ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {t('hadith')} Collections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <button
                key={collection.name}
                onClick={() => setSelectedCollection(collection.name)}
                className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all border border-teal-200 dark:border-gray-600 text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {collection.name}
                  </h3>
                </div>
                <p className="text-2xl arabic-text text-teal-700 dark:text-teal-400 mb-2">
                  {collection.arabicName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {collection.hadiths.toLocaleString()} {t('hadith')}s
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
            <button
              onClick={() => {
                setSelectedCollection(null);
                setCurrentPage(1);
              }}
              className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ← Back to Collections
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{selectedCollection}</h2>
              <p className="text-lg opacity-90">
                {collections.find((c) => c.name === selectedCollection)?.arabicName}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchHadith')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Hadiths */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hadiths
                .filter((hadith) =>
                  searchTerm ? hadith.arab.includes(searchTerm) : true
                )
                .map((hadith) => (
                  <div
                    key={hadith.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                        #{hadith.number}
                      </span>
                    </div>

                    <p className="arabic-text text-gray-900 dark:text-white leading-loose">
                      {hadith.arab}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-lg font-medium">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
