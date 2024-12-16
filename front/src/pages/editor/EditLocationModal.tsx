import Button from '../../components/Button'
import searchIcon from '../../assets/search-icon.svg'
import GlobalInput from '../../components/GlobalInput'
import closeIcon from "../../assets/close-black.svg";

interface LocationModalType {
  onClose : () => void;
}

const EditLocationModal = ({onClose} : LocationModalType)  => {
  return (
    <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
    <button className="absolute right-2 top-1" onClick={onClose}>
      <img className="w-[24px] h-[24px] object-contain" src={closeIcon} alt="닫기 버튼" />
    </button>
    <h5 className="mb-3 text-primary">오픈 날짜 선택</h5>
    <div className="space-y-4">
      <div className="text-gray-600">타임 캡슐을 오픈할 날짜를 선택해주세요.
      해당 타임 캡슐 알림 요청을 받은 다른 사용자들도 해당 날짜에 알림을 받습니다.</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="w-full item-between">
            <GlobalInput placeholder='장소를 검색해주세요' className="border w-[calc(100% - 50px)] rounded p-2 text-black dark:text-gray-50" />
            <Button className='w-10 h-10 bg-black rounded item-middle'>
              <img src={searchIcon} alt="검색 아이콘" />
            </Button>
          </div>
          {/* <button className="px-4 py-2 text-white rounded w-fit bg-primary">
            확인
          </button> */}
        </div>
        {/* {getErrorMessage() && <div className="text-sm text-red-500">{getErrorMessage()}</div>} */}
      </div>
    </div>
  </div>

  )
}

export default EditLocationModal