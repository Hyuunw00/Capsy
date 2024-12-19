import { useEffect, useState, KeyboardEvent, useRef } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import { useNavigate } from "react-router";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import img_capsule from "../../assets/marker.svg";
import icon_plus from "../../assets/map/ico_plus.png";
import icon_minus from "../../assets/map/ico_minus.png";
import Loading from "../../components/Loading";
import MapSearch from "./MapSearch";

interface Place {
  place_name: string;
  address_name: string;
  x: string;
  y: string;
  id: string;
}

interface Markers {
  lat: number;
  lng: number;
  title: any;
  image: string;
  isBlur: boolean;
  _id: string;
  place: string;
}

interface MapInfo {
  center: {
    lat: number; // 초기 좌표
    lng: number;
  };
  isPanto: boolean;
  isSearch: boolean; //  검색유무
  // image: string;
}

export default function MapPage() {
  const navigate = useNavigate();

  // Map reference
  const mapRef = useRef<any>(null);
  const map = mapRef.current;

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
  const [mapCenter, setMapCenter] = useState<MapInfo>({
    center: {
      lat: 37.5666805, // 초기 좌표
      lng: 126.9784147,
    },
    isPanto: true,
    isSearch: false, //  검색유무
    // image: "",
  });

  console.log(mapCenter);

  // 타임캡슐 마커 상태관리
  const [selectedMarkers, setSelectedMarkers] = useState<Markers[]>([]);

  // 지역에 따른 마커 필터링
  const [filteredMarkers, setFilteredMarkers] = useState<Markers[]>([]);

  // 각각의 타임캡슐 마커의 인덱스(각각의 마커를 클릭했을때 index로 구분)
  const [openMarkerIndex, setOpenMarkerIndex] = useState<number | null>(null);

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
    setMapCenter({
      ...mapCenter,
      isSearch: true,
      // image: "",
      center: { lng: parseFloat(place.x), lat: parseFloat(place.y) },
    });
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
            ...mapCenter,
            isSearch: true,
            // image: "",
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

  // 장소 검색시  지도 레벨 재설정
  useEffect(() => {
    const map = mapRef.current;
    if (mapCenter.isSearch && map) map.setLevel(5);
  }, [mapCenter]);

  useEffect(() => {
    // capsuleData에 마커 생성
    const markers = capsuleData.map((post) => {
      const parsedData = getParse(post.title);
      const closeAt = parsedData.closeAt && new Date(parsedData.closeAt);

      return {
        lat: parseFloat(parsedData.latitude),
        lng: parseFloat(parsedData.longitude),
        title: parsedData.title,
        image: parsedData.image[0],
        isBlur: closeAt && new Date().toISOString() < closeAt.toISOString(),
        _id: post._id,
        place: parsedData.address ?? parsedData.capsuleLocation,
      };
    });

    setSelectedMarkers(markers);
  }, [capsuleData]);

  // zoom 변경 처리
  useEffect(() => {
    const handleZoomChange = () => {
      const level = map.getLevel();

      if (level <= 10) {
        // 줌 레벨이 10 이하일 때는 리스트로 표시
        filterMarkersByZoom(level);
        map.setLevel(level);
      }
    };

    if (map) {
      map.addListener("zoom_changed", handleZoomChange);

      return () => {
        map.removeListener("zoom_changed", handleZoomChange);
      };
    }
  }, [map]);

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
      <div className="relative w-full  h-[calc(100vh-115px)]">
        {/* 입력창 */}
        <MapSearch value={searchInput} handleChange={setSearchInput} handleKeyDown={handleKeyDown} />

        {/* 지도 */}
        <Map
          center={mapCenter.center}
          level={13}
          style={{ width: "100%", height: "calc(100vh - 188px)", position: "relative", overflow: "hidden" }}
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
            <MapMarker
              position={mapCenter.center}
              // image={
              //   mapCenter.image != ""
              //     ? {
              //         src: mapCenter.image, // 이미지가 있을 때 사용자 이미지로 대체
              //         size: { width: 50, height: 50 },
              //       }
              //     : undefined // 이미지가 없으면 기본 마커 사용
              // }
            />

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
                        width: "270px",
                        maxWidth: "300px",
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
                            height: "150px",
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
                          fontSize: "12px",
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
                  key={place.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="font-medium text-[14px]">{place.place_name}</div>
                  <div className="text-[12px] text-gray-500 mt-1">{place.address_name}</div>
                </li>
              ))}
            </ul>
          )}

          {/* 클러스터링안의 타임캡슐 목록 */}
          {filteredMarkers.length > 0 && (
            <div
              style={{
                position: "absolute",
                right: "0",
                bottom: "0px",
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
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
              >
                <h3 className=" bg-gray-200 p-3">캡슐 리스트</h3>
                <ul>
                  {filteredMarkers.map((marker) => (
                    <li
                      key={marker._id}
                      className={` relative cursor-pointer hover:bg-gray-100 border-b border-gray-100 `}
                      onClick={() => {
                        map.setLevel(3);
                        setMapCenter({
                          ...mapCenter,
                          isSearch: false,
                          // image: marker.isBlur ? img_capsule : marker.image,
                          center: { lat: marker.lat, lng: marker.lng },
                        });
                      }}
                    >
                      <div className="flex gap-3 justify-start items-start">
                        <div className="text-[12px] text-gray-500 mt-1">
                          <img src={marker.isBlur ? img_capsule : marker.image} className="w-28 h-28" />
                        </div>

                        <div className="font-medium text-[14px]">{marker.title}</div>

                        <div className="  absolute bottom-2 left-[120px] flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                              fill="currentColor"
                            />
                          </svg>
                          <span>{marker.place}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-0">
                        <button
                          onClick={() =>
                            marker.isBlur ? handleClickCapsule(marker) : navigate(`/detail/${marker._id}`)
                          }
                          className="hover:text-primary"
                        >
                          상세보기
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
