interface UserLists {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  coverImage: string;
  image?: string;
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: [
    {
      likes: [
        {
          _id: "string";
          user: "string";
          post: "string";
          createdAt: "string";
          updatedAt: "string";
        },
      ];
      comments: [
        {
          _id: "string";
          comment: "string";
          author: "string";
          post: "string";
          createdAt: "string";
          updatedAt: "string";
        },
      ];
      _id: "string";
      image: "string";
      imagePublicId: "string";
      title: "string";
      channel: {
        authRequired: true;
        posts: ["string"];
        _id: "string";
        name: "string";
        description: "string";
        createdAt: "string";
        updatedAt: "string";
      };
      author: "string";
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  likes: [
    {
      _id: "string";
      user: "string";
      post: "string";
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  comments: ["string"];
  followers: [
    {
      _id: "string";
      user: "string";
      follower: "string";
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  following: [
    {
      _id: "string";
      user: "string";
      follower: "string";
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  notifications: [
    {
      seen: true;
      _id: "string";
      author: "string";
      user: "string";
      post: "string";
      follow: "string";
      comment: {
        _id: "string";
        comment: "string";
        author: "string";
        post: "string";
        createdAt: "string";
        updatedAt: "string";
      };
      message: "string";
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  messages: [
    {
      _id: "string";
      message: "string";
      sender: "string";
      receiver: "string";
      seen: true;
      createdAt: "string";
      updatedAt: "string";
    },
  ];
  createdAt: "string";
  updatedAt: "string";
}

interface ChannelPost {
  _id: string; // 게시물 고유 ID
  title: string; // 게시물 제목 (일반 문자열 or JSON 문자열)
  image?: string; // 이미지 URL (optional)
  imagePublicId?: string; // 이미지 public ID (optional)

  // 게시물 채널 정보
  channel: {
    _id: string;
    name: string; // "POST" or "TIMECAPSULE"
    description: string;
    authRequired: boolean;
    posts: string[]; // 채널에 속한 게시물 ID 목록
  };

  // 작성자 정보
  author: {
    _id: string;
    fullName: string;
    email: string;
    role: string; // "Regular" | "SuperAdmin" 등
    posts: string[]; // 사용자가 작성한 게시물 ID 목록
    likes: string[]; // 사용자가 좋아요한 게시물 ID 목록
  };

  // 게시물 상호작용
  likes: Array<{
    // 게시물의 좋아요 정보
    _id: string;
    user: string; // 좋아요한 사용자 ID
    post: string; // 게시물 ID
    createdAt: string;
    updatedAt: string;
  }>;

  comments: any[]; // 게시물의 댓글 정보

  createdAt: string; // 게시물 생성 시간
  updatedAt: string; // 게시물 수정 시간
}

// title 필드에 JSON 문자열로 저장된 커스텀 데이터 구조
interface CustomPostData {
  // 일반 포스트
  title: string; // 실제 게시물 제목
  body: string; // 게시물 내용

  // 타임캡슐인 경우 추가 필드
  closeAt?: string; // YYYY-MM-DD 형식의 공개 날짜
}
interface PostDetail {
  _id: string;
  title: string;
  image: string;
  author: {
    _id: string;
    fullName: string;
    role: string;
    emailVerified: boolean;
    banned: boolean;
    isOnline: boolean;
    posts: Array<string>;
    likes: Array<string>;
    comments: Array<string>;
    followers: Array<string>;
    following: Array<string>;
    notifications: Array<string>;
    messages: Array<string>;
    email: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    _id: string;
    author: {
      _id: string;
      fullName: string;
    };
    comment: string;
  }>;
  __v: number;
}

interface PostItemProps {
  title: string;
  content?: string;
}

interface CommentItemProps {
  author: { fullName: string; _id: string };
  comment: string;
  _id: string;
  onDelete: (id: string) => void;
  isCurrentUser: boolean;
}
