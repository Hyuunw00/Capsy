import error404 from "../assets/error-404.png";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="absolute top-0 left-0 z-30 flex flex-col justify-between w-full p-8 bg-black h-dvh">
      <div className="flex items-center justify-center flex-1">
        <img
          className="w-64 md:w-80"
          src={error404}
          alt="404 에러 이미지"
        />
      </div>
      <Button 
        onClick={handleClick}
        className="w-full py-3 text-black rounded bg-secondary"
      >
        Go to Main
      </Button>
    </div>
  );
};

export default Error404;