import React, { useEffect, useState, KeyboardEvent, useRef } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import { useNavigate } from "react-router";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import img_capsule from "../../assets/marker.svg";
import icon_plus from "../../assets/map/ico_plus.png";
import icon_minus from "../../assets/map/ico_minus.png";
import map_location from "../../assets/map/map-location-icon.svg";
import Loading from "../../components/Loading";
import MapSearch from "./MapSearch";

import img_noti from "../../assets/Notification-white.svg";
import img_fillNoti from "../../assets/map/map-notification-icon-fill.svg";
import img_noti_disable from "../../assets/Notification-disabled.svg";
import img_alarm from "../../assets/alarm.png";

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
  placeName: string;
  addressName: string;
}

interface MapInfo {
  center: {
    lat: number; // 초기 좌표
    lng: number;
  };
  level: number;
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

  // 검색한 장소의 위치 정보
  const [selectedPlace, setSelectedPlace] = useState({
    lat: 37.5666805, // 초기 좌표
    lng: 126.9784147,
  });

  // 필터링된 타임캡슐
  const [capsuleData, setCapsuleData] = useState<ChannelPost[]>([]);

  //  입력 값
  const [searchInput, setSearchInput] = useState("");

  // keydown index
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // 잠겨있는 캡슐 모달
  const [modalData, setModalData] = useState({ imgSrc: "", neonText: "", whiteText: "" });
  const [showModal, setShowModal] = useState(false);

  // 지도정보 상태관리
  const [mapInfo, setMapInfo] = useState<MapInfo>({
    center: {
      lat: 37.5666805, // 초기 좌표
      lng: 126.9784147,
    },
    level: 13,
  });

  // 타임캡슐 마커 상태관리
  const [selectedMarkers, setSelectedMarkers] = useState<Markers[]>([]);

  // 지역에 따른 마커 필터링
  const [filteredMarkers, setFilteredMarkers] = useState<Markers[]>([]);

  // 각각의 타임캡슐 마커의 인덱스(각각의 마커를 클릭했을때 index로 구분)
  const [openMarkerIndex, setOpenMarkerIndex] = useState<number | null>(null);

  // 각 게시물 알림 상태 관리
  const [notiStatus, setNotiStatus] = useState<{ [key: string]: boolean }>({});

  // 각 게시물 좋아요, 알림 상태 관리
  const [userData, setUserData] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [], messages: [] };
  });

  // 알림 등록 모달을 위한 상태 관리
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [alarmModalData, setAlarmModalData] = useState({
    imgSrc: "",
    neonText: "",
    whiteText: "",
  });

  // ----------------------------------------------

  // 커스텀 오버레이를 여는 함수
  const handleMarkerClick = (marker: Markers, index: number) => {
    // 클릭한 마커의 인덱스를 setState로 저장하여 해당 마커에 오버레이를 표시하도록 설정
    setMapInfo((prev) => ({ ...prev, level: 3, center: { lat: marker.lat, lng: marker.lng } })); // 상태 강제 업데이트 커스텀 오버레이가 보여지도록
    setOpenMarkerIndex(index);
    setFilteredMarkers([]); // 커스텀 오버레이를 열때는 일시적으로 캡슐리스트를 사라지게 조작
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
    setMapInfo((prev) => ({
      ...prev,
      level: 3,
      center: { lat: parseFloat(place.y), lng: parseFloat(place.x) },
    }));
    setSelectedPlace((prev) => ({ ...prev, lat: parseFloat(place.y), lng: parseFloat(place.x) }));
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
          setMapInfo((prev) => ({
            ...prev,
            level: 3,
            center: {
              lat: parseFloat(searchResults[selectedIndex].y),
              lng: parseFloat(searchResults[selectedIndex].x),
            },
          }));
          setSelectedPlace((prev) => ({
            ...prev,
            lat: parseFloat(searchResults[selectedIndex].y),
            lng: parseFloat(searchResults[selectedIndex].x),
          }));
          setSearchInput("");
          setSearchResults([]);
        }
        break;
    }
  };

  // 줌인 ,줌 아웃 버튼 동작 함수
  const zoomIn = () => {
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const zoomOut = () => {
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
  const filterChange = (level: number) => {
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

  // capsuleData에 마커 생성
  useEffect(() => {
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
        placeName: parsedData.capsuleLocation,
        addressName: parsedData.address || "주소 정보 없음",
      };
    });
    setSelectedMarkers(markers);
  }, [capsuleData]);

  // 지도의 zoom 값, 중심좌표값이 변경될때
  useEffect(() => {
    if (!map) return; //Map 객체가 초기화되지 않았을경우 return
    map.setLevel(mapInfo.level); // 지도 레벨 설정
    map.panTo(new kakao.maps.LatLng(mapInfo.center.lat, mapInfo.center.lng)); // 지도 중심을 부드럽게  이동

    // 지도의 상태가 변경될때마다 실행되는 함수
    const handleMapChange = () => {
      const level = map.getLevel();

      if (level <= 10) {
        // 줌 레벨이 10 이하일 때는 리스트로 표시
        filterChange(level);
        map.setLevel(level);
      }
    };

    if (map) {
      map.addListener("zoom_changed", handleMapChange);
      map.addListener("center_changed", handleMapChange);

      return () => {
        map.removeListener("zoom_changed", handleMapChange);
        map.removeListener("center_changed", handleMapChange);
      };
    }
  }, [mapInfo, map]);

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

  const handleNotiClick = (postId: string) => {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉션
    if (!userData?._id) {
      navigate("/login");
      return;
    }

    // 이미 해당 게시글에 알림이 설정된 경우
    const userNoti = userData?.messages.find((message: any) => {
      try {
        const parsedMessage = JSON.parse(message.message);
        return parsedMessage.postId === postId;
      } catch (error) {
        return false;
      }
    });

    if (userNoti) {
      alert("해당 게시글 알람을 이미 설정하셨습니다.");
      return;
    }

    // 알림을 설정하는 모달
    setAlarmModalData({
      imgSrc: img_alarm,
      neonText: "알림을 설정하면 취소할 수 없습니다",
      whiteText: "알림을 설정하시겠습니까?",
    });
    setShowAlarmModal(true);
    setSelectedPostId(postId);
  };

  const handleAlarmCloseModal = () => {
    setShowAlarmModal(false);
    setSelectedPostId(null);
  };

  // 알림 버튼 클릭 이벤트 핸들러
  const handleConfirm = async () => {
    if (!selectedPostId) return;

    try {
      const post = capsuleData.find((post) => post._id === selectedPostId);
      if (!post) return;

      const userId = userData?._id;

      const openAt = getCloseAt(post.title)?.toISOString();

      // 새로운 메세지 전송
      const messageResponse = await axiosInstance.post("/messages/create", {
        message: JSON.stringify({ postId: selectedPostId, openAt }),
        receiver: userId,
      });

      const newMessage = messageResponse.data;

      setUserData((prevUserData: any) => {
        const updatedMessages = [...(prevUserData.messages || []), newMessage];
        const updatedUserData = {
          ...prevUserData,
          messages: updatedMessages,
        };
        sessionStorage.setItem("user", JSON.stringify(updatedUserData));
        return updatedUserData;
      });

      setNotiStatus((prevStatus: any) => {
        const updatedStatus = { ...prevStatus, [selectedPostId]: true };
        sessionStorage.setItem("notiStatus", JSON.stringify(updatedStatus));
        return updatedStatus;
      });

      handleAlarmCloseModal();
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  // 알림 상태가 바뀌면 실행
  useEffect(() => {
    const updatedFilterData = capsuleData.map((post) => {
      const isNotified = userData?.messages?.some((message: any) => {
        const parsedMessage = message.message ? JSON.parse(message.message) : null;
        return parsedMessage && parsedMessage.postId === post._id;
      });
      return {
        ...post,
        isNotified,
      };
    });

    const newNotiStatus = updatedFilterData.reduce<{ [key: string]: boolean }>((acc, post) => {
      acc[post._id] = post.isNotified ?? false;
      return acc;
    }, {});

    setNotiStatus(newNotiStatus);
  }, [capsuleData]);

  // 페이지 로드 시 sessionStorage에서 데이터 가져오기
  useEffect(() => {
    const storedUserData = sessionStorage.getItem("user");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setNotiStatus(parsedUserData.notifications || {});
    }
  }, []);

  // userData가 업데이트될 때마다 sessionStorage에 저장
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  }, [userData]);

  // 타임캡슐의 closeAt 날짜 가져오기
  const getCloseAt = (jsonString: any): Date | null => {
    try {
      const parsedData = JSON.parse(jsonString);
      if (parsedData.closeAt) {
        return new Date(parsedData.closeAt);
      }
      return null;
    } catch (error) {
      console.error("JSON parse error: ", error);
      return null;
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="relative w-full  h-[calc(100vh-115px)]">
        {/* 입력창 */}
        <MapSearch value={searchInput} handleChange={setSearchInput} handleKeyDown={handleKeyDown} />

        {/* 지도 */}
        <Map
          center={mapInfo.center}
          level={mapInfo.level}
          style={{ width: "100%", height: "calc(100vh - 180px)", position: "relative", overflow: "hidden" }}
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
            <MapMarker position={selectedPlace} />

            {/* 타임캡슐 마커들 */}
            {selectedMarkers.map((marker, index) => (
              //  반복문 내부의 부모 요소에 key 추가
              <React.Fragment key={marker._id}>
                <MapMarker
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(marker, index)} // 마커 클릭 시 오버레이 표시
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
                      className="relative w-[270px] max-w-[300px] p-[10px]  bg-white dark:bg-gray-700 rounded-[8px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 18 18"
                          fill="none"
                          className="text-black dark:text-white"
                        >
                          <path
                            d="M14.121 3.879a1 1 0 0 0-1.415 0L9 7.586 5.293 3.879a1 1 0 1 0-1.415 1.415L7.586 9 3.879 12.707a1 1 0 0 0 1.415 1.415L9 10.414l3.707 3.707a1 1 0 1 0 1.415-1.415L10.414 9l3.707-3.707a1 1 0 0 0 0-1.415z"
                            fill="currentColor"
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
                      <div className="mt-[5px] text-[12px] font-bold text-center text-gray-700 dark:text-gray-100">
                        {marker.title}
                      </div>
                    </div>
                  </CustomOverlayMap>
                )}
              </React.Fragment>
            ))}
          </MarkerClusterer>

          {/* 검색 결과 목록 */}
          {searchResults.length > 0 && (
            <ul className="absolute left-0 top-[50px] z-10 mt-1 bg-white dark:bg-gray-700 dark:text-white w-full overflow-auto  max-h-60 ">
              {searchResults.map((place, index) => (
                <li
                  key={place.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500 border-b border-gray-100 dark:border-gray-500 ${index === selectedIndex ? "bg-gray-100 dark:bg-gray-200" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="font-medium text-[14px]">{place.place_name}</div>
                  <div className="text-[12px] text-gray-500 dark:text-gray-300 mt-1">{place.address_name}</div>
                </li>
              ))}
            </ul>
          )}

          {/* 클러스터링안의 타임캡슐 목록 */}
          {filteredMarkers.length > 0 && (
            <div className="absolute bottom-0 right-0 z-10 w-full max-w-[600px]">
              <div
                className="w-full px-8 overflow-y-auto bg-white dark:bg-gray-600 shadow-lg rounded-t-3xl h-80"
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
              >
                <h3 className="p-3 pb-6 text-lg font-bold text-center border-b dark:text-white border-b-gray-200 dark:border-b-gray-400">
                  캡슐 리스트
                </h3>
                <ul className="h-56 overflow-auto">
                  {filteredMarkers.map((marker) => (
                    <li
                      key={marker._id}
                      className="relative px-2 py-4 transition border-b border-gray-100 dark:border-b-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 item-between hover:bg-bg-100"
                      onClick={() => {
                        setMapInfo((prev) => ({
                          ...prev,
                          level: 3,
                          center: { lat: marker.lat, lng: marker.lng },
                        }));
                      }}
                    >
                      <div className="flex items-start justify-start gap-3">
                        <div className="relative w-20 h-20 overflow-hidden rounded-lg item-middle">
                          <img
                            className="object-cover w-full h-full"
                            src={marker.isBlur ? img_capsule : marker.image}
                          />
                          <svg
                            className="absolute bottom-0 right-0 cursor-pointer z-2 w-[31px] h-[31px]"
                            viewBox="0 0 36 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="18" cy="18" r="15" className="fill-primary" />
                            <image
                              onClick={(e) => {
                                e.stopPropagation();
                                if (marker.isBlur) {
                                  handleNotiClick(marker._id);
                                }
                              }}
                              href={
                                !marker.isBlur ? img_noti_disable : notiStatus[marker._id] ? img_fillNoti : img_noti
                              }
                              x="8"
                              y="8"
                              width="20"
                              height="20"
                              className="fill-white dark:fill-black"
                            />
                          </svg>
                        </div>

                        <div className="flex flex-col justify-between h-20">
                          <div className="flex flex-col ">
                            <h3 className="font-medium text-md dark:text-white">{marker.title}</h3>
                            <span className="font-medium text-[14px] text-gray-500 dark:text-gray-200">
                              {marker.placeName}
                            </span>
                          </div>

                          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-300">
                            <img src={map_location} alt="주소 아이콘" />
                            <span>{marker.addressName}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => (marker.isBlur ? handleClickCapsule(marker) : navigate(`/detail/${marker._id}`))}
                        className="w-10 h-12 group"
                      >
                        <svg
                          width="10"
                          height="16"
                          viewBox="0 0 10 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform duration-400 transform-gpu group-hover:translate-x-2"
                        >
                          <path
                            d="M0 16V12.8H3.2V16H0ZM0 3.2V0H3.2V3.2H0ZM3.2 6.4V3.2H6.4V6.4H3.2ZM3.2 12.8V9.6H6.4V12.8H3.2ZM6.4 6.4H9.6V9.6H6.4V6.4Z"
                            fill="currentColor"
                            className="text-black dark:text-white"
                          />
                        </svg>
                      </button>
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

      {showAlarmModal && selectedPostId && (
        <TimeCapsuleModal
          imgSrc={alarmModalData.imgSrc}
          neonText={alarmModalData.neonText}
          whiteText={alarmModalData.whiteText}
          onClose={handleAlarmCloseModal}
          onCancel={handleAlarmCloseModal}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
