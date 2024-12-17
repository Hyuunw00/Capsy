import { useEffect, useState, KeyboardEvent } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_close from "../../assets/purple-close.svg";
import img_lock_timeCapsule from "../../assets/time-capsule-lock.png";
import img_search from "../../assets/Search.svg";
import { useNavigate } from "react-router";
import TimeCapsuleModal from "../../components/TimeCapsuleModal";
import img_capsule from "../../assets/icon_capsule.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

const { kakao } = window as any;

export default function MapPage() {
  const [searchPlace, setSearchPlace] = useState({
    x: "126.9784147",
    y: "37.5666805",
  });

  const navigate = useNavigate();
  // 검색 결과를 담는 배열
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

  const handleSelectPlace = (place: Place) => {
    setSearchPlace({ ...searchPlace, x: place.x, y: place.y });
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
          setSearchPlace({ ...searchPlace, x: searchResults[selectedIndex].x, y: searchResults[selectedIndex].y });
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

  // 초기에 지도 렌더링, 위치 지정된 캡슐테이터를 불러옴
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(37.5666805, 126.9784147), // 지도의 중심좌표
      level: 5,
    };

    // 지도를 생성
    const map = new window.kakao.maps.Map(container!, options);

    // 타임캡슐에서 capsuleLocation 커스텀필드가 undefined가 아닌 값들만 불러옴
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

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(+searchPlace.y, +searchPlace.x), // 지도의 중심좌표
      level: 5,
    };

    // 지도를 생성
    const map = new window.kakao.maps.Map(container!, options);

    // 해당 장소에 마커 생성
    const markerPosition = new window.kakao.maps.LatLng(+searchPlace.y, +searchPlace.x);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 위치를 설정한 타임캡슐만 필터링해서 마커 찍어주기
    const filteredData = capsuleData.filter((post) => getParse(post.title).capsuleLocation !== undefined);

    if (filteredData.length === 0) {
      console.warn("필터링된 데이터가 없습니다!");
      return;
    }

    filteredData.forEach((post) => {
      // parse된 데이터들
      const parsedData = getParse(post.title);

      // 캡슐이 열리는날
      const closeAt = parsedData.closeAt && new Date(parsedData.closeAt);
      // 조건에 따른 blur처리 여부
      const isBlurred = closeAt && new Date().toISOString() < closeAt.toISOString();

      if (!parsedData) return;

      const markerPosition = new window.kakao.maps.LatLng(Number(parsedData.latitude), Number(parsedData.longitude));
      const imageSize = new window.kakao.maps.Size(50, 50);
      const imageSrc = isBlurred ? img_capsule : parsedData.image[0]; // 블러 처리된 이미지 URL 사용
      const markerImg = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImg,
      });
      marker.setMap(map);

      const content = `
      <div style="position: relative; width: 300px; padding: 15px; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
        <div style="position: absolute; top: 10px; right: 10px; cursor: pointer; z-index:30" onclick=${closeOverlay}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14.121 3.879a1 1 0 0 0-1.415 0L9 7.586 5.293 3.879a1 1 0 1 0-1.415 1.415L7.586 9 3.879 12.707a1 1 0 0 0 1.415 1.415L9 10.414l3.707 3.707a1 1 0 1 0 1.415-1.415L10.414 9l3.707-3.707a1 1 0 0 0 0-1.415z" fill="#000"/>
          </svg>
        </div>
        <div style="text-align: center; margin-bottom: 10px;">
          <img src=${parsedData.image[0]} alt="타임캡슐 이미지" style="width: 300px; height: 300px; object-fit: cover; border-radius: 8px;"/>
        </div>
        <div style="font-size: 16px; font-weight: bold; text-align: center; color: #333;">
          ${parsedData.title}
        </div>
      </div>
    `;

      const overlay = new window.kakao.maps.CustomOverlay({
        map: null,
        position: markerPosition,
        content: content,
        xAnchor: 0.5, // 오버레이의 X축 기준
        yAnchor: 1, // 오버레이의 Y축 기준
      });

      // 오버레이 닫기 함수
      function closeOverlay() {
        overlay.setMap(null); // 오버레이 숨기기
      }

      //   // 정보창 생성
      //   const infoContent = `
      //     <div style="padding:20px; text-align:center; cursor:pointer " class="kakao-info-window" >
      //         <div class="absolute inset-0" style="backdrop-filter: blur(10px); width:120px; height:90px;"/>
      //         <img src=${parsedData.image[0]} alt="타임캡슐 이미지" style="width:100px; height:80px;
      //         object-fit:cover; " />
      //         <p style="margin-top:5px; font-size:14px;">${parsedData.title}</p>
      //     </div>

      // `;

      //   const infoWindow = new window.kakao.maps.InfoWindow({
      //     content: infoContent,
      //     removable: true,
      //   });
      // 마커 클릭 이벤트 등록
      window.kakao.maps.event.addListener(marker, "click", () => {
        overlay.setMap(map);

        // infoWindow.open(map, marker);
        // setModalData({
        //   imgSrc: img_lock_timeCapsule,
        //   neonText: "미개봉 타임 캡슐입니다!",
        //   whiteText: "예약 시 알림을 받을 수 있어요",
        // });
        // setShowModal(true);

        // navigate(`/detail/${post._id}`); // 상세 페이지 URL로 이동
      });
    });
  }, [searchPlace]);

  return (
    <>
      <div className="w-full h-screen">
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
        <div className="w-full h-full relative ">
          <div id="map" className="w-full h-full" />
          {searchResults.length > 0 && (
            <ul className="absolute left-0 top-[-10px] z-10 mt-1 bg-white w-full overflow-auto  max-h-60 ">
              {searchResults.map((place, index) => (
                <li
                  key={`${place.place_name}-${index}`}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                  onClick={() => handleSelectPlace(place)}
                >
                  <div className="font-medium text-[14px]">{place.place_name}</div>
                  <div className="text-[12px] text-gray-500 mt-1">{place.address_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
