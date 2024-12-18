import { useEffect, useState, KeyboardEvent } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_close from "../../assets/purple-close.svg";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import img_search from "../../assets/Search.svg";
import { useNavigate } from "react-router";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import img_capsule from "../../assets/icon_capsule.svg";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

interface Place {
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface Markers {
  lat: number;
  lng: number;
  title: any;
  image: string;
  isBlur: boolean;
  _id: string;
}

export default function MapPage() {
  const [searchPlace, setSearchPlace] = useState({
    lat: "37.5666805",
    lng: "126.9784147",
  });

  const navigate = useNavigate();
  // 검색과 연관된 결과를 담는 배열
  const [searchResults, setSearchResults] = useState<Place[]>([]);

  // 필터링된 타임캡슐
  const [capsuleData, setCapsuleData] = useState<ChannelPost[]>([]);

  //  입력 값
  const [searchInput, setSearchInput] = useState("");

  // keydown index
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // 모달 상태관리
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });
  const [showModal, setShowModal] = useState(false);

  // 중앙값 상태관리
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5666805, // 초기 좌표
    lng: 126.9784147,
  });

  // 마커 상태관리
  const [selectedMarkers, setSelectedMarkers] = useState<Markers[]>([]);

  // 각각의 타임캡슐 마커의 인덱스
  const [openMarkerIndex, setOpenMarkerIndex] = useState<number | null>(null);

  // 커스텀 오버레이를 여는 함수
  const handleMarkerClick = (index: number) => {
    // 클릭한 마커의 인덱스를 setState로 저장하여 해당 마커에 오버레이를 표시하도록 설정
    setOpenMarkerIndex(index);
  };
  // 커스텀 오버레이를 닫는 함수
  const handleCloseOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setOpenMarkerIndex(null);
  };

  const handleClickCapsule = (marker: Markers) => {
    if (marker.isBlur) {
      setModalData({
        imgSrc: img_lock_timeCapsule,
        neonText: "미개봉 타임 캡슐입니다!",
        whiteText: "예약 시 알림을 받을 수 있어요",
      });
      setShowModal(true);
      setOpenMarkerIndex(null);
      return;
    }
    navigate(`/detail/${marker._id}`);
  };

  const handleSelectPlace = (place: Place) => {
    setSearchPlace({ ...searchPlace, lng: place.x, lat: place.y });
    setSearchResults([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < 0 ? prev : prev - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          setSearchPlace({ ...searchPlace, lng: searchResults[selectedIndex].x, lat: searchResults[selectedIndex].y });
          setSearchInput("");
          setSearchResults([]);
        }
        break;
    }
  };

  // 타임캡슐 title 커스텀 필드 parse
  const getParse = (jsonString: any) => {
    try {
      const parsedData = JSON.parse(jsonString);
      if (parsedData) return parsedData || jsonString;
    } catch (error) {
      console.error("JSON parse error: ", error);
      return jsonString;
    }
  };

  // 초기 랜더링
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const getTimeCapsule = async () => {
      try {
        const { data } = await axiosInstance.get(`/posts/channel/${CHANNEL_ID_TIMECAPSULE}`);
        const filteredData = data.filter((post: ChannelPost) => getParse(post.title).capsuleLocation !== undefined);
        setCapsuleData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    getTimeCapsule();
  }, []);

  // 검색어를 입력하면 연관 검색어들이 리스트업
  useEffect(() => {
    // 장소 검색 객체를 생성
    const ps = new window.kakao.maps.services.Places();

    // 입력값이 비어있을 경우
    if (searchInput === "") {
      setSearchResults([]);
      return;
    }
    // 키워드로 장소를 검색
    ps.keywordSearch(searchInput, (data: Place[], status: any) => {
      // @ts-ignore - kakao is globally available
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data);
      }
    });
  }, [searchInput]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    // 맵 중심 이동
    setMapCenter({
      lat: +searchPlace.lat,
      lng: +searchPlace.lng,
    });

    // 장소를 입력한 타임캡슐만 필터링
    const filteredData = capsuleData.filter((post) => getParse(post.title).capsuleLocation !== undefined);

    if (filteredData.length === 0) {
      console.warn("필터링된 데이터가 없습니다!");
      return;
    }
    const markers = capsuleData.map((post) => {
      const parsedData = getParse(post.title);
      const closeAt = parsedData.closeAt && new Date(parsedData.closeAt);

      return {
        lat: Number(parsedData.latitude),
        lng: Number(parsedData.longitude),
        title: parsedData.title,
        image: parsedData.image[0],
        isBlur: closeAt && new Date().toISOString() < closeAt.toISOString(),
        _id: post._id,
      };
    });

    setSelectedMarkers(markers);
  }, [searchPlace, capsuleData]);

  return (
    <>
      <div className="relative w-full h-screen">
        {/* 입력창 */}
        <form>
          <div className="px-[20px] py-[10px]">
            <div className="h-[36px] rounded-[10px] bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] p-[1px]  ">
              <div className="flex items-center w-full h-full bg-white rounded-[10px] px-4 overflow-hidden ">
                <img src={img_search} alt="검색" className="pr-2" />
                <input
                  type="text"
                  placeholder="장소를 검색해주세요."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-[14px] my-[4px] outline-none"
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="bg-bg-400 w-7 h-6 rounded-[50px] mr-2"
                  onClick={() => setSearchInput("")}
                >
                  <img className="w-full h-full" src={img_close} alt="취소" />
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* 지도 */}
        <Map center={mapCenter} level={3} style={{ width: "100%", height: "100vh" }} className="w-full h-screen">
          {/* 검색된 장소 마커 */}
          <MapMarker position={mapCenter} />

          {/* 타임캡슐 마커들 */}
          {selectedMarkers.map((marker, index) => (
            <MapMarker
              key={marker._id}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(index)} // 마커 클릭 시 오버레이 표시
              image={{
                src: marker.isBlur ? img_capsule : marker.image, // 커스텀 이미지 사용
                size: { width: 60, height: 60 },
              }}
            >
              {/* 기본 UI는 제거하고, 클릭된 마커에 대해서만 CustomOverlayMap 표시 */}
              {openMarkerIndex === index && (
                <CustomOverlayMap
                  position={{ lat: marker.lat, lng: marker.lng }}
                  xAnchor={0.5}
                  yAnchor={1.1}
                  zIndex={3}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "250px", // 크기 줄임
                      maxWidth: "300px", // 최대 너비 설정
                      padding: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "8px", // 테두리 라운드 효과
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={() => handleClickCapsule(marker)}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0", // 위치 조정
                        right: "0", // 위치 조정
                        display: "flex",
                        width: "30px",
                        height: "30px",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        zIndex: 101
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseOverlay(e);
                      }}
                      // 닫기 버튼 클릭 시 오버레이 닫기
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path
                          d="M14.121 3.879a1 1 0 0 0-1.415 0L9 7.586 5.293 3.879a1 1 0 1 0-1.415 1.415L7.586 9 3.879 12.707a1 1 0 0 0 1.415 1.415L9 10.414l3.707 3.707a1 1 0 1 0 1.415-1.415L10.414 9l3.707-3.707a1 1 0 0 0 0-1.415z"
                          fill="#000"
                        />
                      </svg>
                    </div>
                    <div style={{ textAlign: "center", marginBottom: "8px" }}>
                      <img
                        src={marker.image}
                        alt="타임캡슐 이미지"
                        style={{
                          width: "220px",
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          margin: "0 auto", // 가운데 정렬
                          filter: marker.isBlur ? "blur(15px)" : "none",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#333",
                        marginTop: "5px",
                      }}
                    >
                      {marker.title}
                    </div>
                  </div>
                </CustomOverlayMap>
              )}
            </MapMarker>
          ))}

          {/* 검색 결과 목록 */}
          {searchResults.length > 0 && (
            <ul className="absolute left-0 top-[50px] z-10 mt-1 bg-white w-full overflow-auto  max-h-60 ">
              {searchResults.map((place, index) => (
                <li
                  key={index}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="font-medium text-[14px]">{place.place_name}</div>
                  <div className="text-[12px] text-gray-500 mt-1">{place.address_name}</div>
                </li>
              ))}
            </ul>
          )}
        </Map>
      </div>
      {showModal && (
        <TimeCapsuleModal
          imgSrc={modalData.imgSrc}
          neonText={modalData.neonText}
          whiteText={modalData.whiteText}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
