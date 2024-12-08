import { useRef, useState } from "react";
import AuthFields from "../../components/AuthFields"
import { useNavigate } from "react-router";
import NotificationModal from "../../components/NotificationModal";

export default function SignUpPage() {
  const navigate= useNavigate();

  const [password,setPassword]= useState('');

  const passwordCorrectref= useRef<HTMLInputElement |null >(null);
  const passwordref= useRef<HTMLInputElement |null >(null); 

  const [isIdvalid,setIsIdValid]= useState(false);
  const [isEmailvalid,setIsEmailValid]= useState(false);
  const [isPasswordvalid,setIsPasswordValid]= useState(false);

  const [isOpen,setIsOpen]= useState(false);


  const handleChangePassword= (e:React.ChangeEvent<HTMLInputElement>)=>{
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    const password =e.target.value;
    setPassword(password);
    if(passwordRegex.test(password)){
      setIsPasswordValid(true);
      return;
    }
  }

  const handleSubmit = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    if(passwordref.current?.value!==passwordCorrectref.current?.value){
      alert('비밀번호가 같지 않습니다!');
      setIsPasswordValid(false);
      return;
    }
    if(!isIdvalid || !isEmailvalid || !isPasswordvalid) {
      alert('입력값을 확인하세요!');
      return;
    }
    setIsOpen(true);

  }


  return (
    <>
      <NotificationModal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
          <div className="text-center mb-[36px]">
            <h1 className=" font-bold text-[18px]">로그인 성공</h1>
          </div>
          
          <div className="text-center">
             <button onClick={()=>navigate('/signupsuccess')}  className=" bg-[#000000] text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]">확인</button>
          </div>
      </NotificationModal>
    <div>
      <div className="w-[300px] h-[700px] m-auto p">
            <h2 className="mb-[10px] text-center mt-[160px]">회원가입</h2>
            <div className="flex flex-col gap-[16px]">
                <AuthFields enName="id" name="아이디" type="text" onCheck={setIsIdValid}  />
                <AuthFields enName="email" name="이메일" type="email" onCheck={setIsEmailValid}   />

                <div className="flex flex-col ">
                    <label htmlFor="password" className="text-[10px] mb-[5px]">비밀번호</label>
                    <div className="flex flex-col  gap-[10px] ">
                      <input id="password" type="password"  ref={passwordref}  value={password} placeholder="비밀번호" onChange={handleChangePassword} className=" w-full  h-[48px] px-[12px] py-[14px] rounded-[6px] border border-[#CBD5E1]"/>
                      <span className="text-[12px] text-red-500">{isPasswordvalid ? '' : '대/소문자, 특수문자, 숫자 포함 8자리 이상'}</span>

                      <input  type="password" placeholder="비밀번호 확인"  ref={passwordCorrectref} className="w-full h-[48px] px-[12px] py-[14px] rounded-[6px] border border-[#CBD5E1]" />

                     </div>
                </div>

                <div>
                  <button onClick={handleSubmit}  className=" bg-[#000000] text-[#ffffff]  w-full  h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]">확인</button>
                </div>
              
            </div>
          
        </div>
    </div>
      
    </>
  );
}
