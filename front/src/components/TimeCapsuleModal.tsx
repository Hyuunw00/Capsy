import img_close_white from "../assets/close-white.svg";
import img_logo_white from "../assets/logo_white.svg";

interface TimeCapsuleModalProps {
  imgSrc: string;
  neonText: string;
  whiteText: string;
  onClose: () => void;
  whiteTextClick?: () => void;
}

const TimeCapsuleModal = ({ imgSrc, neonText, whiteText, onClose, whiteTextClick }: TimeCapsuleModalProps) => {
  return (
    <div
      className="fixed top-0 left-0 z-30 w-full h-dvh item-middle bg-[rgba(55,56,60,0.6)]"
      style={{ backdropFilter: "blur(0.5px)" }}
    >
      <div className="relative item-middle flex-col text-center w-[360px] h-[340px] bg-black flex-shrink-0 rounded-[10px]">
        <img src={imgSrc} alt="lock" className="w-[180px] h-auto mb-4"></img>
        <div>
          <p className="text-secondary font-semibold">{neonText}</p>
          {whiteTextClick ? (
            <button onClick={whiteTextClick} className="text-white text-sm underline">
              {whiteText}
            </button>
          ) : (
            <p className="text-white text-sm">{whiteText}</p>
          )}
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white  p-1">
          <img src={img_close_white} alt="close" className="w-[24px]" />
        </button>
        <img src={img_logo_white} alt="logo" className="absolute bottom-5" />
      </div>
    </div>
  );
};

export default TimeCapsuleModal;
