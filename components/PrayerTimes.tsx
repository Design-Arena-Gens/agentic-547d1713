'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes } from 'adhan';
import { format } from 'date-fns';

interface PrayerTime {
  name: string;
  time: Date;
  key: string;
}

export default function PrayerTimes() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: Date } | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(coords);
          fetchLocationName(coords);
          calculatePrayerTimes(coords);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (prayerTimes.length > 0) {
      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

  const fetchLocationName = async (coords: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await response.json();
      setLocationName(
        data.address?.city || data.address?.town || data.address?.village || 'Unknown Location'
      );
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const calculatePrayerTimes = (coords: { lat: number; lng: number }) => {
    const date = new Date();
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CalculationMethod.MuslimWorldLeague();
    const times = new AdhanPrayerTimes(coordinates, date, params);

    const prayers: PrayerTime[] = [
      { name: t('fajr'), time: times.fajr, key: 'fajr' },
      { name: t('sunrise'), time: times.sunrise, key: 'sunrise' },
      { name: t('dhuhr'), time: times.dhuhr, key: 'dhuhr' },
      { name: t('asr'), time: times.asr, key: 'asr' },
      { name: t('maghrib'), time: times.maghrib, key: 'maghrib' },
      { name: t('isha'), time: times.isha, key: 'isha' },
    ];

    setPrayerTimes(prayers);
  };

  const updateNextPrayer = () => {
    const now = new Date();
    const upcoming = prayerTimes.find((prayer) => prayer.time > now);

    if (upcoming) {
      setNextPrayer(upcoming);
      const diff = upcoming.time.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      const tomorrow = prayerTimes[0];
      if (tomorrow) {
        setNextPrayer({ ...tomorrow, name: `${tomorrow.name} (Tomorrow)` });
      }
    }
  };

  const handleManualLocation = () => {
    const lat = prompt('Enter latitude:');
    const lng = prompt('Enter longitude:');
    if (lat && lng) {
      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      setLocation(coords);
      fetchLocationName(coords);
      calculatePrayerTimes(coords);
    }
  };

  const getPrayerIcon = (key: string) => {
    const icons: { [key: string]: string } = {
      fajr: '🌅',
      sunrise: '☀️',
      dhuhr: '🌞',
      asr: '🌤️',
      maghrib: '🌇',
      isha: '🌙',
    };
    return icons[key] || '🕌';
  };

  return (
    <div className="space-y-6">
      {/* Location Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <h2 className="text-xl font-bold">{locationName || t('selectLocation')}</h2>
          </div>
          <button
            onClick={handleManualLocation}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
          >
            Change Location
          </button>
        </div>
        {location && (
          <p className="text-sm opacity-90">
            {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
          </p>
        )}
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('calculating')}</p>
        </div>
      ) : prayerTimes.length > 0 ? (
        <>
          {/* Next Prayer Card */}
          {nextPrayer && (
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">{t('nextPrayer')}</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{nextPrayer.name}</p>
              <p className="text-xl">{format(nextPrayer.time, 'h:mm a')}</p>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-sm opacity-90">{t('timeRemaining')}</p>
                <p className="text-2xl font-mono font-bold">{timeUntilNext}</p>
              </div>
            </div>
          )}

          {/* Prayer Times List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              {t('prayerTimesToday')}
            </h3>

            <div className="space-y-3">
              {prayerTimes.map((prayer, index) => {
                const isNext = nextPrayer?.name === prayer.name;
                const isPassed = new Date() > prayer.time;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      isNext
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-500 scale-105'
                        : isPassed
                        ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60'
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getPrayerIcon(prayer.key)}</span>
                      <div>
                        <p
                          className={`font-semibold ${
                            isNext
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {prayer.name}
                        </p>
                        {isNext && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Up Next
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-mono font-bold ${
                          isNext
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {format(prayer.time, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date Display */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('locationAccess')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please allow location access to see prayer times
          </p>
          <button
            onClick={handleManualLocation}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Enter Location Manually
          </button>
        </div>
      )}
    </div>
  );
}
