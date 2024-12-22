# Capsy

### 추억을 공유하는 타임캡슐 SNS

### 팀원 구성
|<img src="https://avatars.githubusercontent.com/u/82489360?v=4,mpd253,ChoiYoungKyu,https://github.com/mpd253" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/184810341?v=4,Soorangmanju,,https://github.com/Soorangmanju" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/48465276?v=4,gjwjdals96,,https://github.com/gjwjdals96" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/96560273?v=4,kodingzz,Hyunw00,https://github.com/kodingzz" width="150" height="150"/>|<img src="https://avatars.githubusercontent.com/u/155376060?v=4,miseullang,,https://github.com/miseullang" width="150" height="150"/>
|:-:|:-:|:-:|:-:|:-:
|팀장 : [@mpd253](https://github.com/mpd253)|팀원 : [@Soorangmanju](https://github.com/Soorangmanju)|팀원 : [@gjwjdals96](https://github.com/gjwjdals96)|팀원 : [@kodingzz](https://github.com/kodingzz)|팀원 : [@miseullang](https://github.com/miseullang)

## 프로젝트 기간: 2024.12.05 ~ 2024.12.21

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&amp;logo=react&amp;logoColor=black"/>
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&amp;logo=typescript&amp;logoColor=white"/>
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">


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
- Recharts (데이터 시각화)
- shadcn/ui (UI 컴포넌트)

### 상태 관리 및 저장소
- 세션 스토리지 (사용자 데이터)
- 커스텀 훅 (상태 관리)
- React context (테마 관리)

## 페이지별 기능

### 메인 페이지 (MainPage)
- 일반 게시물과 타임캡슐 피드 확인
- 게시물 필터링 (전체/일반 포스트/타임캡슐)
- 게시물 검색
- 게시물 좋아요
- 타임캡슐 알림 설정
- 스크롤 탑 버튼

### 게시물 상세 페이지 (PostDetailPage)
- 게시물 내용 확인
- 다중 이미지 슬라이드
- 댓글 작성/삭제
- 좋아요 기능
- 작성자 팔로우
- 본인 게시물 수정/삭제

### 에디터 페이지 (EditorPage)
- 일반 게시물/타임캡슐 작성 모드 전환
- 다중 이미지 업로드
- 타임캡슐 공개 날짜 설정
- 타임캡슐 위치 설정
- 미리보기 기능

### 지도 페이지 (MapPage)
- 타임캡슐 위치 확인
- 위치 검색
- 마커 클러스터링
- 타임캡슐 목록 보기
- 지도 확대/축소 컨트롤

### 마이페이지 (MyPage)
- 프로필 정보 수정
- 프로필 이미지 변경
- 팔로워/팔로잉 목록
- 내 게시물 관리 (일반/타임캡슐/예약글)
- 공개 완료/대기 중인 타임캡슐 확인

### 사용자 정보 페이지 (UserInfoPage)
- 사용자 프로필 확인
- 팔로우/언팔로우
- 사용자의 게시물 목록
- 프로필 공유 기능

### 알림 페이지
- 팔로우 요청 알림
- 좋아요 알림
- 댓글 알림
- 타임캡슐 공개 알림

## 설치 방법

1. 저장소 복제
```bash
git clone [repository-url]
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```env
VITE_KAKAO_APP_KEY=your_kakao_api_key
```

4. 개발 서버 실행
```bash
npm run dev
```

## 폴더구조

```
Capsy
├─ .DS_Store
├─ .vscode
│  └─ settings.json
├─ README.md
└─ front
   ├─ .DS_Store
   ├─ .env
   ├─ .prettierrc
   ├─ README.md
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ public
   │  ├─ Capsy.svg
   │  └─ user.png
   ├─ src
   │  ├─ .DS_Store
   │  ├─ App.tsx
   │  ├─ apis
   │  │  ├─ apis.ts
   │  │  ├─ auth.ts
   │  │  └─ axiosInstance.tsx
   │  ├─ assets
   │  │  ├─ .DS_Store
   │  │  ├─ Account.svg
   │  │  ├─ Dark-mode.svg
   │  │  ├─ Edit.svg
   │  │  ├─ Heart_Curved.svg
   │  │  ├─ Home.svg
   │  │  ├─ Left.svg
   │  │  ├─ Light-mode.svg
   │  │  ├─ Notification-disabled.svg
   │  │  ├─ Notification-fill.svg
   │  │  ├─ Notification-white.svg
   │  │  ├─ Notification.svg
   │  │  ├─ Search.svg
   │  │  ├─ alarm.png
   │  │  ├─ bottom-arrow-white.svg
   │  │  ├─ bottom-arrow.svg
   │  │  ├─ check-icon.svg
   │  │  ├─ close-black.svg
   │  │  ├─ close-white.svg
   │  │  ├─ close.svg
   │  │  ├─ digging.gif
   │  │  ├─ error-404.png
   │  │  ├─ event-capsule-icon.svg
   │  │  ├─ event-thumnail.png
   │  │  ├─ event-thumnails
   │  │  │  ├─ event-thumnail-1.svg
   │  │  │  └─ event-thumnail.svg
   │  │  ├─ event-timeCapsule-thumbnail.png
   │  │  ├─ fi-rs-comment.svg
   │  │  ├─ fi-rs-gift.svg
   │  │  ├─ fi-rs-trash.svg
   │  │  ├─ film-icon.svg
   │  │  ├─ footer-icon-capsule.svg
   │  │  ├─ footer-logo-secondary.svg
   │  │  ├─ footer-logo.svg
   │  │  ├─ heart-fill.svg
   │  │  ├─ holiday-event-banner.png
   │  │  ├─ icon_capsule.svg
   │  │  ├─ left-arrow.svg
   │  │  ├─ leftArrowCircle.svg
   │  │  ├─ loading-icon-black.svg
   │  │  ├─ loading-icon.svg
   │  │  ├─ location-icon.svg
   │  │  ├─ login-logo-white.svg
   │  │  ├─ login-logo.svg
   │  │  ├─ logo_black.svg
   │  │  ├─ logo_white.svg
   │  │  ├─ map
   │  │  │  ├─ arrow.svg
   │  │  │  ├─ green_marker.png
   │  │  │  ├─ ico_minus.png
   │  │  │  ├─ ico_plus.png
   │  │  │  ├─ map-location-icon.svg
   │  │  │  └─ marker.svg
   │  │  ├─ marker.svg
   │  │  ├─ more.svg
   │  │  ├─ password-eyes-close.svg
   │  │  ├─ password-eyes-open.svg
   │  │  ├─ passwordIcon
   │  │  │  ├─ eyes-close.svg
   │  │  │  └─ eyes-open.svg
   │  │  ├─ pick-date-icon.svg
   │  │  ├─ pick-picture-icon.svg
   │  │  ├─ private-timeCapsule-thumbnail.png
   │  │  ├─ profile-alarm-black.svg
   │  │  ├─ profile-alarm-purple.svg
   │  │  ├─ profile-article-black.svg
   │  │  ├─ profile-article-purple.svg
   │  │  ├─ profile-capsule-black.svg
   │  │  ├─ profile-capsule-purple.svg
   │  │  ├─ profile-img-edit-icon.svg
   │  │  ├─ profile-img-sample.jpg
   │  │  ├─ purple-close.svg
   │  │  ├─ purple-search.svg
   │  │  ├─ random-thumnail
   │  │  │  ├─ random-thumnail-black-1.png
   │  │  │  ├─ random-thumnail-black-2.png
   │  │  │  ├─ random-thumnail-black-3.png
   │  │  │  ├─ random-thumnail-white-1.png
   │  │  │  ├─ random-thumnail-white-2.png
   │  │  │  └─ random-thumnail-white-3.png
   │  │  ├─ rightArrowCircle.svg
   │  │  ├─ scroll-icon.svg
   │  │  ├─ search-icon.svg
   │  │  ├─ sending-icon.svg
   │  │  ├─ time-capsule-lock.png
   │  │  ├─ time-capsule.png
   │  │  └─ user.png
   │  ├─ components
   │  │  ├─ AuthInput.tsx
   │  │  ├─ Button.tsx
   │  │  ├─ CheckBox.tsx
   │  │  ├─ Error404.tsx
   │  │  ├─ Footer.tsx
   │  │  ├─ GlobalInput.tsx
   │  │  ├─ Input.tsx
   │  │  ├─ InputWithLabel.tsx
   │  │  ├─ Loading.tsx
   │  │  ├─ Logo.tsx
   │  │  ├─ Modal.tsx
   │  │  ├─ NoticeModal.tsx
   │  │  ├─ NotificationModal.tsx
   │  │  ├─ TimeCapsuleModal.tsx
   │  │  ├─ fonts
   │  │  │  ├─ DungGeunMo.ttf
   │  │  │  ├─ Galmuri14.ttf
   │  │  │  └─ Galmuri9.ttf
   │  │  └─ headers
   │  │     ├─ Header.tsx
   │  │     ├─ NotifyModal.tsx
   │  │     └─ PageHeader.tsx
   │  ├─ css
   │  │  ├─ index.css
   │  │  ├─ map.css
   │  │  ├─ tailwind.css
   │  │  └─ variable.css
   │  ├─ layouts
   │  │  ├─ NonPrivate.tsx
   │  │  ├─ Private.tsx
   │  │  └─ RootLayout.tsx
   │  ├─ main.tsx
   │  ├─ pages
   │  │  ├─ editor
   │  │  │  ├─ EditComplete.tsx
   │  │  │  ├─ EditLocationModal.tsx
   │  │  │  ├─ EditModal.tsx
   │  │  │  ├─ EditPreview.tsx
   │  │  │  ├─ EditorPage.tsx
   │  │  │  ├─ EventEditModal.tsx
   │  │  │  ├─ EventEditorPage.tsx
   │  │  │  └─ imageUtils.ts
   │  │  ├─ event
   │  │  │  └─ Event.tsx
   │  │  ├─ login
   │  │  │  └─ LoginPage.tsx
   │  │  ├─ main
   │  │  │  ├─ MainPage.tsx
   │  │  │  ├─ MainSearch.tsx
   │  │  │  └─ MainSearchModal.tsx
   │  │  ├─ maps
   │  │  │  ├─ MapPage.tsx
   │  │  │  └─ MapSearch.tsx
   │  │  ├─ mypage
   │  │  │  ├─ AlarmListPage.tsx
   │  │  │  ├─ CapsuleListPage.tsx
   │  │  │  ├─ MyFollowerPage.tsx
   │  │  │  ├─ MyFollowingPage.tsx
   │  │  │  ├─ MyPage.tsx
   │  │  │  ├─ MySlideContainer.tsx
   │  │  │  ├─ MySlideHeader.tsx
   │  │  │  ├─ ProfileContainer.tsx
   │  │  │  ├─ ProfileHeader.tsx
   │  │  │  └─ modal
   │  │  │     ├─ LogoutModal.tsx
   │  │  │     ├─ ProfileForm.tsx
   │  │  │     ├─ ProfileImageForm.tsx
   │  │  │     └─ dummy.json
   │  │  ├─ password
   │  │  │  ├─ NewPasswordPage.tsx
   │  │  │  └─ PasswordResetPage.tsx
   │  │  ├─ post
   │  │  │  ├─ ElapsedText.ts
   │  │  │  ├─ Follow.tsx
   │  │  │  ├─ PostDetailPage.tsx
   │  │  │  └─ SimpleDateTimeFormat.ts
   │  │  ├─ signup
   │  │  │  ├─ SignUpPage.tsx
   │  │  │  └─ SignUpSuccessPage.tsx
   │  │  └─ userinfo
   │  │     ├─ AllUserList.tsx
   │  │     ├─ FollowerPage.tsx
   │  │     ├─ FollowingPage.tsx
   │  │     ├─ ProfileContainer.tsx
   │  │     ├─ ProfileHeader.tsx
   │  │     ├─ SlideContainer.tsx
   │  │     ├─ SlideHeader.tsx
   │  │     └─ UserInfoPage.tsx
   │  ├─ store
   │  │  ├─ loginStore.ts
   │  │  ├─ mainSearchStore.ts
   │  │  └─ themeStore.ts
   │  ├─ types
   │  │  ├─ kakao.maps.d.ts
   │  │  ├─ notification.ts
   │  │  └─ types.d.ts
   │  ├─ utils
   │  │  ├─ profileImage.ts
   │  │  ├─ regex.ts
   │  │  └─ token.ts
   │  └─ vite-env.d.ts
   ├─ tailwind.config.js
   ├─ tsconfig.app.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   └─ vite.config.ts

```
