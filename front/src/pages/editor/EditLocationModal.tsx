import { useState, useRef, KeyboardEvent } from "react";
import Button from "../../components/Button";
import GlobalInput from "../../components/GlobalInput";
import searchIcon from "../../assets/search-icon.svg";
import closeIcon from "../../assets/close-black.svg";

interface Place {
  place_name: string;
  address_name: string;
  x: string;
  y: string;
}

interface LocationModalProps {
  onClose: () => void;
  onSelectLocation: (location: { name: string; address: string; lat: number; lng: number }) => void;
}

const EditLocationModal = ({ onClose, onSelectLocation }: LocationModalProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchPlaces = () => {
    if (!searchKeyword.trim()) {
      alert("장소를 입력해주세요.");
      return;
    }

    // @ts-ignore - kakao is globally available
    const places = new kakao.maps.services.Places();

    places.keywordSearch(searchKeyword, (result: Place[], status: any) => {
      // @ts-ignore - kakao is globally available
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(result);
        setSelectedIndex(-1);
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectPlace(searchResults[selectedIndex]);
        } else {
          searchPlaces();
        }
        break;
      case "Tab":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
    }
  };

  const handleSelectPlace = (place: Place) => {
    onSelectLocation({
      name: place.place_name,
      address: place.address_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
    });
    onClose();
  };

  return (
    <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
      <button className="absolute right-2 top-1" onClick={onClose}>
        <img className="w-[24px] h-[24px] object-contain" src={closeIcon} alt="닫기 버튼" />
      </button>
      <h5 className="mb-3 text-primary">타임캡슐 장소 선택</h5>
      <div className="space-y-4">
        <p className="text-gray-600">타임캡슐을 묻을 장소를 선택해주세요.</p>
        <div className="relative">
          <div className="flex w-full gap-2 item-between">
            <GlobalInput
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="장소를 검색해주세요"
              className="w-full p-2 text-black border rounded dark:text-gray-50"
            />
            <Button onClick={searchPlaces} className="flex-shrink-0 w-10 h-10 bg-black rounded item-middle">
              <img src={searchIcon} alt="검색 아이콘" />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 z-10 mt-1 overflow-auto bg-white border rounded shadow-lg max-h-60">
              {searchResults.map((place, index) => (
                <li
                  key={`${place.place_name}-${index}`}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSelectPlace(place)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="font-medium text-[14px]">{place.place_name}</div>
                  <div className="text-[12px] text-gray-500 mt-1">{place.address_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditLocationModal;
