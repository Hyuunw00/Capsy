import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { InputWithLabel } from '../../../components/InputWithLabel';
import Button from '../../../components/Button';

export default function ProfileForm() {
  const [nickname, setNickname] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nickname, introduction });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-sm text-center">프로필 편집</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithLabel
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="다람쥐헌쳇바퀴어쩌구"
          />

          <div className="w-full mb-4">
            <label className="block mb-1 ml-1 text-sm text-gray-700">
              자기소개
            </label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="이건 text area"
              className="w-full h-24 px-4 py-2 rounded border text-sm placeholder:text-[#acacac] resize-none"
            />
          </div>

          <div className="mt-4">
            <p className="mb-4 text-sm text-gray-500">비밀번호 재설정</p>
            <Button 
              type="submit"
              className="w-full py-3 text-white bg-black rounded-md hover:bg-gray-800"
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}