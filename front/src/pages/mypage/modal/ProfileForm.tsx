import React, { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal";
import { InputWithLabel } from "../../../components/InputWithLabel";
import Button from "../../../components/Button";
import { Link } from "react-router";
import { getMyProfile, updateUserSettings } from "../../../apis/apis"; // updateUserSettings import

interface ProfileFormProps {
  onClose: () => void;
  onUsernameUpdate: (newUsername: string) => void; // onUsernameUpdate 추가
}

export default function ProfileForm({ onClose, onUsernameUpdate }: ProfileFormProps) {
  const [username, setUsername] = useState(""); // username 상태로 변경
  const [fullName, setFullName] = useState(""); // fullName 상태 (수정 불가)

  // 프로필 데이터 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getMyProfile(); // getMyProfile 호출
        setFullName(profile.fullName); // fullName을 아이디에 설정
        setUsername(profile.username || ""); // username을 자기소개로 설정
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile(); // 컴포넌트 마운트 시 프로필 데이터 호출
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 프로필 업데이트 API 호출
      const updatedProfile = await updateUserSettings(fullName, username); // fullName은 수정 불가, username을 수정
      console.log(updatedProfile);
      onUsernameUpdate(username); // 업데이트된 username 정보 출력
      onClose(); // 저장 후 모달 닫기
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="w-full max-w-md" style={{ padding: "20px" }}>
        <h2 className="mb-6 text-sm text-center" style={{ fontSize: "16px" }}>
          프로필 편집
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 수정 불가한 아이디 입력란 (fullName) */}
          <InputWithLabel
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="다람쥐헌쳇바퀴어쩌구"
          />

          <div className="w-full mb-4">
            <label className="block mb-1 ml-1 text-sm text-gray-700">자기소개</label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder="이건 text area"
              className="w-full h-24 px-4 py-2 rounded border text-sm placeholder:text-[#acacac] resize-none"
            />
          </div>

          <div className="mt-4" style={{ marginTop: "20px" }}>
            <p className="mb-4 text-sm text-gray-500">
              <Link to="/resetpassword">비밀번호 재설정</Link>
            </p>
            <Button
              type="submit"
              className="w-full py-3 text-white bg-black rounded-md hover:bg-gray-800"
              style={{ padding: "12px", fontSize: "16px" }}
            >
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
