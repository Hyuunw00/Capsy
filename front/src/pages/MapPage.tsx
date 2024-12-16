import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          console.log('Kakao maps loaded successfully');
          setMapLoaded(true);
        });
      };

      script.onerror = () => {
        setError('Failed to load Kakao Maps SDK');
        console.error('Failed to load Kakao Maps SDK');
      };

      document.head.appendChild(script);
    };

    initializeKakaoMaps();

    return () => {
      const script = document.querySelector('script[src*="kakao.com/v2/maps"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>지도를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <h1 className="p-4 text-2xl font-bold">지도</h1>
      <div className="w-full h-[500px] px-4">
        <Map
          center={{ lat: 37.5666805, lng: 126.9784147 }}  // 서울 시청 좌표
          style={{ width: "100%", height: "100%", borderRadius: "0.5rem" }}
          level={3}
        >
          <MapMarker 
            position={{ lat: 37.5666805, lng: 126.9784147 }}
          >
            <div className="p-2">현재 위치</div>
          </MapMarker>
        </Map>
      </div>
    </div>
  );
};

export default MapPage;