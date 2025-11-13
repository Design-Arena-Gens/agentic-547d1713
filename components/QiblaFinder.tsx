'use client';

import { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function QiblaFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    if (location) {
      calculateQibla();
      fetchLocationName();
    }
  }, [location]);

  useEffect(() => {
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDeviceHeading(360 - event.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setHasPermission(true);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    }
  };

  const fetchLocationName = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );
      const data = await response.json();
      setLocationName(
        data.address?.city || data.address?.town || data.address?.village || 'Unknown Location'
      );
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const calculateQibla = () => {
    if (!location) return;

    const lat1 = (location.lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const dLng = ((KAABA_LNG - location.lng) * Math.PI) / 180;

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    setQiblaDirection((bearing + 360) % 360);

    // Calculate distance
    const R = 6371; // Earth's radius in km
    const dLat = lat2 - lat1;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistance(R * c);
  };

  const compassRotation = deviceHeading - qiblaDirection;

  return (
    <div className="space-y-6">
      {!hasPermission ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Compass className="w-20 h-20 text-emerald-500 mx-auto mb-6 animate-pulse-slow" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('findQibla')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{t('locationAccess')}</p>
          <button
            onClick={requestLocation}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            {t('grantLocation')}
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('calculating')}</p>
        </div>
      ) : (
        <>
          {/* Location Info */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{t('yourLocation')}</h3>
            </div>
            <p className="text-2xl font-bold mb-1">{locationName}</p>
            <p className="text-sm opacity-90">
              {location?.lat.toFixed(4)}°, {location?.lng.toFixed(4)}°
            </p>
            <div className="mt-4 pt-4 border-t border-white/30">
              <p className="text-sm opacity-90 mb-1">{t('distance')}</p>
              <p className="text-xl font-bold">{distance.toFixed(0)} km</p>
            </div>
          </div>

          {/* Compass */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-center mb-8 text-gray-900 dark:text-white">
              {t('qiblaDirection')}
            </h3>

            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Compass Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 shadow-inner">
                {/* Direction Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {['N', 'E', 'S', 'W'].map((dir, i) => (
                      <div
                        key={dir}
                        className="absolute text-lg font-bold text-gray-700 dark:text-gray-300"
                        style={{
                          top: i === 0 ? '10px' : i === 2 ? 'auto' : '50%',
                          bottom: i === 2 ? '10px' : 'auto',
                          left: i === 3 ? '10px' : i === 1 ? 'auto' : '50%',
                          right: i === 1 ? '10px' : 'auto',
                          transform:
                            i === 0 || i === 2
                              ? 'translateX(-50%)'
                              : i === 1 || i === 3
                              ? 'translateY(-50%)'
                              : 'none',
                        }}
                      >
                        {dir}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rotating Compass Needle */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                  style={{ transform: `rotate(${-compassRotation}deg)` }}
                >
                  <div className="relative w-2 h-64">
                    {/* Green needle pointing to Qibla */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500 to-emerald-600 rounded-t-full shadow-lg flex items-start justify-center pt-2">
                      <Navigation className="w-6 h-6 text-white fill-current" />
                    </div>
                    {/* Red needle pointing opposite */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-500 to-red-600 rounded-b-full shadow-lg"></div>
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 border-gray-700 dark:border-gray-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                  </div>
                </div>

                {/* Kaaba Icon */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                  style={{ transform: `translate(-50%, -50%) rotate(${-compassRotation}deg) translateY(-100px)` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-2xl shadow-lg animate-pulse-slow">
                    🕋
                  </div>
                </div>
              </div>
            </div>

            {/* Direction Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('qiblaDirection')}
              </p>
              <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {qiblaDirection.toFixed(1)}°
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                Green arrow points towards the Kaaba in Makkah
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Compass className="w-5 h-5" />
              How to Use
            </h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
              <li>• Hold your device flat (parallel to the ground)</li>
              <li>• Rotate yourself until the green arrow points upward</li>
              <li>• The green arrow indicates the Qibla direction</li>
              <li>• The Kaaba icon shows the target direction</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
