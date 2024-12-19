import { useEffect, useState, KeyboardEvent, useRef } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_close from "../../assets/purple-close.svg";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import img_search from "../../assets/Search.svg";
import { useNavigate } from "react-router";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import img_capsule from "../../assets/marker.svg";
import icon_plus from "../../assets/ico_plus.png";
import icon_minus from "../../assets/ico_minus.png";
import Loading from "../../components/Loading";

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
  const navigate = useNavigate();

  // Map reference
  const mapRef = useRef<any>(null);

  //  로딩 상태
  const [loading, setLoading] = useState(true);

  // 검색과 연관된 결과를 담는 배열
  const [searchResults, setSearchResults] = useState<Place[]>([]);

  // 필터링된 타임캡슐
  const [capsuleData, setCapsuleData] = useState<ChannelPost[]>([]);

  //  입력 값
  const [searchInput, setSearchInput] = useState("");

  // keydown index
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // 잠겨있는 캡슐 모달
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });
  const [showModal, setShowModal] = useState(false);

  // 중앙값 상태관리
  const [mapCenter, setMapCenter] = useState({
    center: {
      lat: 37.5666805, // 초기 좌표
      lng: 126.9784147,
    },
    isPanto: true,
    isSearch: false, //  검색유무
  });

  // 타임캡슐 마커 상태관리
  const [selectedMarkers, setSelectedMarkers] = useState<Markers[]>([]);

  // 지역에 따른 마커 필터링
  const [filteredMarkers, setFilteredMarkers] = useState<Markers[]>([]);

  // 각각의 타임캡슐 마커의 인덱스(각각의 마커를 클릭했을때 index로 구분)
  const [openMarkerIndex, setOpenMarkerIndex] = useState<number | null>(null);

  // 지도 zoom level
  const [level, setLevel] = useState(13);

  // ----------------------------------------------

  // 커스텀 오버레이를 여는 함수
  const handleMarkerClick = (index: number) => {
    // 클릭한 마커의 인덱스를 setState로 저장하여 해당 마커에 오버레이를 표시하도록 설정
    setOpenMarkerIndex(index);
    setMapCenter((prev) => ({ ...prev })); // 상태 강제 업데이트 커스텀 오버레이가 보여지도록
  };
  // 커스텀 오버레이를 닫는 함수
  const handleCloseOverlay = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setOpenMarkerIndex(null);
  };

  // 미개봉  캡슐 클릭시 모달 여는 함수
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

  // 검색한 장소로 맵 이동
  const handleSelectPlace = (place: Place) => {
    setMapCenter({ ...mapCenter, isSearch: true, center: { lng: +place.x, lat: +place.y } });
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
          setMapCenter({
            isPanto: true,
            isSearch: true,
            center: { lng: +searchResults[selectedIndex].x, lat: +searchResults[selectedIndex].y },
          });
          setSearchInput("");
          setSearchResults([]);
        }
        break;
    }
  };

  // 줌인 ,줌 아웃 버튼 동작 함수
  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
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

  // 줌 레벨에 따라 마커 필터링 함수
  const filterMarkersByZoom = (level: number) => {
    const map = mapRef.current;
    const bounds = map.getBounds();
    if (level < 10) {
      const filtered = selectedMarkers.filter((marker) => {
        const position = new window.kakao.maps.LatLng(marker.lat, marker.lng);

        return bounds.contain(position); // 해당 위치가 현재 지도 범위 내에 있는지 확인
      });
      setFilteredMarkers(filtered);
    } else {
      setFilteredMarkers([]);
    }
  };

  // 초기 랜더링
  useEffect(() => {
    const getTimeCapsule = async () => {
      try {
        const { data } = await axiosInstance.get(`/posts/channel/${CHANNEL_ID_TIMECAPSULE}`);
        const filteredData = data.filter((post: ChannelPost) => getParse(post.title).capsuleLocation !== undefined);
        setCapsuleData(filteredData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getTimeCapsule();
  }, []);

  useEffect(() => {
    // 맵 중심 이동

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
    // 장소 검색시
    const map = mapRef.current;
    if (mapCenter.isSearch && map) map.setLevel(4); // 지도 레벨 재 설정
  }, [mapCenter, capsuleData]);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      const handleZoomChange = () => {
        const level = map.getLevel();
        if (level <= 10) {
          // 줌 레벨이 10 이하일 때는 리스트로 표시
          filterMarkersByZoom(level);
          setLevel(level);
        }
      };
      // 줌 레벨이 변경될 때마다 실행
      map.addListener("zoom_changed", handleZoomChange);

      handleZoomChange();

      return () => {
        map.removeListener("zoom_changed", handleZoomChange);
      };
    }
  }, [capsuleData]);

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

  if (loading) return <Loading />;

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
        <Map
          center={mapCenter.center}
          level={level}
          style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}
          ref={mapRef}
        >
          {/* 지도 확대, 축소 컨트롤 div */}
          <div className="custom_zoomcontrol radius_border">
            <span onClick={zoomIn}>
              <img src={icon_plus} alt="확대" />
            </span>
            <span onClick={zoomOut}>
              <img src={icon_minus} alt="축소" />
            </span>
          </div>
          <MarkerClusterer
            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel={10} // 클러스터 할 최소 지도 레벨
          >
            {/* 검색된 장소 마커 */}
            <MapMarker position={mapCenter.center} />

            {/* 타임캡슐 마커들 */}
            {selectedMarkers.map((marker, index) => (
              <>
                <MapMarker
                  key={marker._id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(index)} // 마커 클릭 시 오버레이 표시
                  image={{
                    src: marker.isBlur ? img_capsule : marker.image, // 커스텀 이미지 사용
                    size: { width: 50, height: 50 },
                  }}
                />

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
                        width: "200px",
                        maxWidth: "250px",
                        padding: "10px",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
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
                          zIndex: 10,
                        }}
                        onClick={(e) => handleCloseOverlay(e)}
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
                            width: "150px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            margin: "0 auto", // 가운데 정렬
                            filter: marker.isBlur ? "blur(15px)" : "none",
                            transition: "filter 0.3s ease-in-out", // 부드러운 효과
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
              </>
            ))}
          </MarkerClusterer>

          {/* 검색 결과 목록 */}
          {searchResults.length > 0 && (
            <ul className="absolute left-0 top-[50px] z-10 mt-1 bg-white w-full overflow-auto  max-h-60 ">
              {searchResults.map((place, index) => (
                <li
                  key={`${place.x}-${place.y}`}
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
        {/* 검색 결과 목록 (모달 표시) */}
        {filteredMarkers.length > 0 && (
          <div
            style={{
              position: "absolute",
              right: "0",
              bottom: "10px",
              zIndex: "10",
            }}
            // onClick={() => setIsListView(false)} // 모달 외부 클릭 시 모달 닫기
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflowY: "auto",
                width: "600px",
                height: "300px",
                padding: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
            >
              <h3 className="mb-3">캡슐 리스트</h3>
              <ul>
                {filteredMarkers.map((marker, index) => (
                  <li
                    key={marker._id}
                    className={` cursor-pointer hover:bg-gray-50 border-b border-gray-100 `}
                    onClick={() => setMapCenter({ ...mapCenter, center: { lat: marker.lat, lng: marker.lng } })}
                  >
                    <div className="flex items-start justify-start gap-3">
                      <div className="text-[12px] text-gray-500 mt-1">
                        <img src={marker.isBlur ? img_capsule : marker.image} className="w-28 h-28" />
                      </div>

                      <div className="font-medium text-[14px]">{marker.title}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
