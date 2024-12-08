  import { useRef, useState } from "react";

  interface AuthFieldsProps {
      enName:string;
      name:string;
      type:string;
      onCheck: (isValid:boolean)=>void;
  }
  export default function AuthFields({enName,name,type, onCheck}:AuthFieldsProps) {
    const inputRef= useRef<HTMLInputElement | null>(null);
    const [message,setMessage] =useState<string | null>(null); 


    const handleCheck =()=>{
      const value= inputRef.current?.value.trim();
      const Regex = type==='email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : /^[a-zA-Z0-9]{4,12}$/;
        const isValid= value && Regex.test(value);
        if(isValid){
          setMessage(`사용 가능한 ${name}입니다!`);
          onCheck(true);
        }
        else{
          setMessage(`사용 불가능한 ${name} 입니다!`);
          onCheck(false);
        }
        
    }
    return (
      <>

      <div className="flex flex-col ">
                        <label htmlFor={enName} className="text-[10px] mb-[5px]">{name}</label>
                        <div className="flex items-center gap-[10px]">
                          <input id={enName} type={type} placeholder={name}className="w-[225px] h-[48px] px-[12px] py-[14px] rounded-[6px] border border-[#CBD5E1]" ref={inputRef}/>
                          <button className="bg-[#000000] text-[#ffffff] w-[67px] h-[47px] py-[13px] px-[21px] text-[12px] rounded-[6px]" onClick={handleCheck} >확인</button>
                      </div>
                      {message &&<span className="text-[12px] text-red-500">{message}</span>}
          </div>
      </>
    
     
    )
  }