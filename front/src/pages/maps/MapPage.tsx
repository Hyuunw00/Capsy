import { useEffect, useState, KeyboardEvent } from "react";
import axiosInstance from "../../apis/axiosInstance";
import { CHANNEL_ID_TIMECAPSULE } from "../../apis/apis";
import img_close from "../../assets/purple-close.svg";

import img_search from "../../assets/Search.svg";
import { useNavigate } from "react-router";

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

    console.log(filteredData);

    if (filteredData.length === 0) {
      console.warn("필터링된 데이터가 없습니다!");
      return;
    }

    filteredData.forEach((post) => {
      const parsedData = getParse(post.title);
      if (!parsedData) return;

      const markerPosition = new window.kakao.maps.LatLng(Number(parsedData.latitude), Number(parsedData.longitude));
      const imageSize = new window.kakao.maps.Size(50, 50);
      const markerImg = new window.kakao.maps.MarkerImage(parsedData.image[0], imageSize);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        image: markerImg,
      });
      marker.setMap(map);

      // 정보창 생성
      const infoContent = `
        <div style="padding:10px; text-align:center; cursor:pointer " class="kakao-info-window" >
          <img src=${parsedData.image[0]} alt="타임캡슐 이미지" style="width:100px; height:80px; object-fit:cover;" />
          <p style="margin-top:5px; font-size:14px;">${parsedData.title}</p>
        </div>
     
    `;

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
      });
      // 마커 클릭 이벤트 등록
      window.kakao.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);

        const infoWindowDiv = document.querySelector(".kakao-info-window"); // InfoWindow의 DOM을 찾아서
        if (infoWindowDiv) {
          infoWindowDiv.addEventListener("click", () => {
            navigate(`/detail/${post._id}`); // 상세 페이지 URL로 이동
          });
        }
      });
    });
  }, [searchPlace]);

  return (
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
  );
}
