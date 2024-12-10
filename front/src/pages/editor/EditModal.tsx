import { InputWithLabel } from '../../components/InputWithLabel'

interface EditModalProps {
  onClose: () => void;
}

function EditModal({ onClose }: EditModalProps) {
  return (
    <div className="absolute top-32 left-12 shadow-md z-50 w-[80%] p-4 bg-white rounded-lg">
      <h5 className="mb-3 text-primary">날짜 지정 안내</h5>
      <div className="space-y-4">
        <div className="text-gray-600">타임캡슐 공개 날짜를 지정해주세요.</div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <InputWithLabel label="year" placeholder="year" />
          </div>
          <span className="text-gray-400">/</span>
          <div className="flex-1">
            <InputWithLabel label="month" placeholder="month" />
          </div>
          <span className="text-gray-400">/</span>
          <div className="flex-1">
            <InputWithLabel label="day" placeholder="day" />
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 text-white rounded bg-primary"
        >
          확인
        </button>
      </div>
    </div>
  )
}

export default EditModal