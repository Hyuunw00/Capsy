import Button from "../../components/Button";
import CheckBox from "../../components/CheckBox";
import GlobalInput from "../../components/GlobalInput";
import Input from "../../components/Input";
import { InputWithLabel } from "../../components/InputWithLabel";
import ProfileForm from "../mypage/modal/ProfileForm";

export default function Login() {
  return (
    <>
      <h1>Login</h1>
      <div className="">
      <GlobalInput
        type="password"
        placeholder="비밀번호를 입력하세요"
        disabled={false}
        className="input-style1"
      />
      <Button className="text-sm text-white bg-[#4f4f4f] w-[77px] h-11 rounded-[4px]">버튼</Button>
      </div>
      <CheckBox type="checkbox">I agree with <strong>terms</strong> and <strong>policies</strong>.</CheckBox>
      <Input placeText="Enter Todo List"/>
      <InputWithLabel label="아이디" placeholder="아이디를 입력하세요" error="error"  />
      <ProfileForm />
    </>
  );
}
