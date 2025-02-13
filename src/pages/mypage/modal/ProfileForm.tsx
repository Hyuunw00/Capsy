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
        <h2 className="mb-6 text-sm text-center dark:text-white" style={{ fontSize: "16px" }}>
          프로필 편집
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* 수정 불가한 아이디 입력란 (fullName) */}
          <InputWithLabel
            label="아이디" // fullName을 아이디로 표시
            value={fullName} // fullName 값 표시
            onChange={(e) => setFullName(e.target.value)} // fullName 수정 방지
            disabled={true} // 수정 불가
            placeholder="" // placeholder 비워두기
            style={{ marginBottom: "10px" }}
          />

          {/* 수정 가능한 자기소개 입력란 (username) */}
          <InputWithLabel
            label="자기소개" // username을 자기소개로 표시
            value={username} // username 값 표시
            onChange={(e) => setUsername(e.target.value)} // 수정 가능
            placeholder="자기소개를 입력하세요" // 자기소개 placeholder
            style={{ marginBottom: "10px" }}
          />

          <div className="mt-4" style={{ marginTop: "20px" }}>
            <p className="mb-4 text-sm text-gray-500 dark:text-white">
              <Link to="/resetpassword">비밀번호 재설정</Link>
            </p>
            <Button
              type="submit"
              className="w-full py-3 text-white dark:text-black bg-primary dark:bg-secondary rounded-md hover:opacity-80 transition-opacity duration-200"
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
