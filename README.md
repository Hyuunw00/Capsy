# Capsy - 추억을 공유하는 타임캡슐 SNS

### [🔗Capsy 데모 사이트](https://caapsy.netlify.app/) 
### [🔗Capsy 발표자료](https://github.com/kodingzz/Capsy/blob/main/E1I4_Capsy_final.pdf.zip)
### [🔗Capsy 시연 영상](https://youtu.be/66i0cLJv6ro?si=QKHATI-MeWiMpgjE)

### 팀원 구성
|<img src="https://avatars.githubusercontent.com/u/82489360?v=4,mpd253,ChoiYoungKyu,https://github.com/mpd253" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/184810341?v=4,Soorangmanju,,https://github.com/Soorangmanju" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/48465276?v=4,gjwjdals96,,https://github.com/gjwjdals96" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/96560273?v=4,kodingzz,Hyunw00,https://github.com/kodingzz" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/155376060?v=4,miseullang,,https://github.com/miseullang" width="150" height="150"/>
|:-:|:-:|:-:|:-:|:-:
|팀장 : [@mpd253](https://github.com/mpd253)|팀원 : [@Soorangmanju](https://github.com/Soorangmanju)|팀원 : [@gjwjdals96](https://github.com/gjwjdals96)|팀원 : [@kodingzz](https://github.com/kodingzz)|팀원 : [@miseullang](https://github.com/miseullang)

## 프로젝트 기간: 2024.12.05 ~ 2024.12.21

## 💻 Tech Stack

### 개발 환경

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&amp;logo=react&amp;logoColor=black"/><img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&amp;logo=typescript&amp;logoColor=white"/><img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"><img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white"><img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">

### 버전 관리
<img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white">

### Code Formatter

<img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">

### 서비스 배포 환경

<img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white">

### Etc
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"><img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"><img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">


## 🤔 기획의도
js 라이브러리 React를 활용한 타임 캡슐 SNS Capsy는 단순히 일상을 기록하는 것을 넘어,
사용자 간의 추억을 공유 하며 서로 공감할 수 있는 새로운 형태의 네트워크를 구축할 수 있다.


## 주요 기능

### 📝 게시물
- 텍스트와 이미지가 포함된 일반 게시물 작성
- 공개 날짜를 지정할 수 있는 타임캡슐 작성
- 여러 장의 이미지 업로드 지원
- 게시물 좋아요와 댓글 기능
- 상세 페이지에서 참여 현황 확인
- 자신의 게시물과 댓글 삭제 기능

### ⏰ 타임캡슐
- 미래 날짜에 공개되는 게시물 예약
- 지도를 통한 공개 위치 설정
- 공개 전 타임캡슐은 흐릿하게 표시
- 타임캡슐 공개 알림 시스템
- 지도에서 타임캡슐 위치 확인

### 👥 사용자 기능
- 프로필 이미지 커스터마이징
- 팔로우/언팔로우 시스템
- 팔로워와 팔로잉 목록 확인
- 활동 알림 (좋아요, 댓글, 팔로우)
- 다크/라이트 테마 지원

### 🗺️ 지도 기능
- 지도에서 타임캡슐 확인
- 카카오맵 API를 이용한 위치 검색
- 여러 마커 클러스터링
- 현재 지도 영역의 캡슐 목록 보기
- 지도 마커에서 캡슐 상세 정보로 이동


## 기술 스택

### 프론트엔드
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- 카카오맵 SDK

### 주요 라이브러리
- 카카오맵 SDK (지도 기능)
- Swiper (이미지 캐러셀)

### 상태 관리 및 저장소
- 세션 스토리지 (사용자 데이터)
- 커스텀 훅 (상태 관리)
- React context (테마 관리)

## 페이지별 기능

### 인증 페이지
#### 회원가입 페이지
 ![회원가입 gif](https://github.com/user-attachments/assets/2f54b32b-54cf-4e10-a9f3-bcf2729f34c5)
#### 로그인 페이지
![로그인 gif](https://github.com/user-attachments/assets/fefc2760-1b71-4627-aea0-dfd15ffa3cc0)

#### 비밀번호 변경 페이지
![비밀번호 변경 gif](https://github.com/user-attachments/assets/898f8bc0-7e63-4ded-b2b0-3f54c022d770)

#### 로그아웃 기능
![로그아웃 gif](https://github.com/user-attachments/assets/0a55c6e8-9859-4ec0-be3a-35cb319f040a)




### 메인 페이지 (MainPage)
- 일반 게시물과 타임캡슐 피드 확인
- 게시물 필터링 (전체/일반 포스트/타임캡슐)
- 게시물 검색
- 게시물 좋아요
- 타임캡슐 알림 설정
- 스크롤 탑 버튼
  
![메인페이지 gif1](https://github.com/user-attachments/assets/2cd9ddea-a826-43a6-8ea4-64e3f01cb103)
![메인 페이지 gif2](https://github.com/user-attachments/assets/82f643c7-3778-48ed-9340-6799facb69bc)
![메인 페이지 gif3](https://github.com/user-attachments/assets/db8fd159-e4c1-47f8-be83-0508c32062ab)


### 게시물 상세 페이지 (PostDetailPage)
- 게시물 내용 확인
- 다중 이미지 슬라이드
- 댓글 작성/삭제
- 좋아요 기능
- 작성자 팔로우
- 본인 게시물 수정/삭제

![게시글 상페이지 gif](https://github.com/user-attachments/assets/7fb0ceaf-7d68-4cdf-87af-3ce1132f915e)


### 에디터 페이지 (EditorPage)
- 일반 게시물/타임캡슐 작성 모드 전환
- 다중 이미지 업로드
- 타임캡슐 공개 날짜 설정
- 타임캡슐 위치 설정
- 미리보기 기능

![타임캡슐 작성 gif](https://github.com/user-attachments/assets/7f137d6a-1e69-41e6-8ed8-a8b1f2eaa1c9)

### 지도 페이지 (MapPage)
- 타임캡슐 위치 확인
- 위치 검색
- 마커 클러스터링
- 타임캡슐 목록 보기
- 지도 확대/축소 컨트롤

![지도 페이지 gif](https://github.com/user-attachments/assets/4c7d9655-1427-4580-b9fd-e4fec62d65a4)
![지도 페이지 gif2](https://github.com/user-attachments/assets/9516f7a8-acc5-4047-891c-4ac656c85815)

### 마이페이지 (MyPage)
- 프로필 정보 수정
- 프로필 이미지 변경
- 팔로워/팔로잉 목록
- 내 게시물 관리 (일반/타임캡슐/예약글)
- 공개 완료/대기 중인 타임캡슐 확인

![마이페이지 gif1](https://github.com/user-attachments/assets/5c1a3809-372c-4296-bdd0-b4852cea173a)
![마이페이지 gif2](https://github.com/user-attachments/assets/cfe5ada8-8848-4b79-bf04-570d65745ecc)

### 사용자 정보 페이지 (UserInfoPage)
- 사용자 프로필 확인
- 팔로우/언팔로우
- 사용자의 게시물 목록
- 프로필 공유 기능

![사용자 정보 페이지 gif](https://github.com/user-attachments/assets/5f2304ab-ce81-481d-9764-9cb77f446e82)

### 알림 페이지
- 팔로우 요청 알림
- 좋아요 알림
- 댓글 알림
- 타임캡슐 공개 알림

![알림 기능 gif](https://github.com/user-attachments/assets/c9ebd0cf-d01d-4ed1-9a58-40593d4b7a08)



