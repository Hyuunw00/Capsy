import { useState } from "react";
import axiosInstance from "../../apis/axiosInstance";

export const getPostDetail = async (postId: string) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// json 파싱
const parsePostContent = (jsonString: string): PostContent => {
  try {
    return JSON.parse(jsonString) as PostContent;
  } catch (error) {
    console.error("포스트를 불러오는데 실패했습니다.:", error);
    return { title: "", content: "" };
  }
};

const CommentItem = ({ author, content }: PostComment) => (
  <li className="py-[4px]">
    <div className="font-semibold">@{author.fullName}</div>
    <div className="mt-[9.14px]">{content}</div>
  </li>
);

export default function PostDetailPage() {
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 관리 상태
  const [commentText, setCommentText] = useState(""); // 댓글 관리 상태

  // 팔로우 로직
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  // 댓글 로직
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentText("");
  };

  // 테스트용 더미데이터
  const post: PostDetail = {
    _id: "67596ad6be515047d62b80e9",
    title: '{"title":"잠온당","content":"null null합니다"}',
    image:
      "https://res.cloudinary.com/learnprogrammers/image/upload/v1733899519/post/8ef31164-136c-47c1-97a1-33fb51c7addc.jpg",
    author: {
      _id: "67578dee18276c7d71022c22",
      fullName: "test123",
      role: "Regular",
      emailVerified: false,
      banned: false,
      isOnline: false,
      posts: [
        "6757947c18276c7d71022c3d",
        "675853d3757bff0e678a567a",
        "67585480757bff0e678a5682",
        "675866d4757bff0e678a56d9",
        "6758674f757bff0e678a56e1",
        "6758e9b499ea03300a172e69",
        "67590bde0e73243169bed649",
        "675934570e73243169bf286e",
        "675935000e73243169bf28d6",
        "675935240e73243169bf28dd",
        "6759356b0e73243169bf28e4",
        "675945dbfe3cf0411632862d",
        "675953127e95d045fd6e3e52",
        "67596698be515047d62b80de",
        "67596ad6be515047d62b80e9",
        "67596b12be515047d62b80f1",
        "67596b14be515047d62b80f7",
      ],
      likes: ["67593d050e73243169bf2a97", "6759ab36c476564e5bced88a"],
      comments: [],
      followers: [],
      following: [],
      notifications: [],
      messages: [],
      email: "test123@gmail.com",
      createdAt: "2024-12-10T00:40:14.269Z",
      updatedAt: "2024-12-12T01:48:24.806Z",
      __v: 0,
    },
    createdAt: "2024-12-11T10:35:02.903Z",
    updatedAt: "2024-12-11T10:35:02.903Z",
    comments: [],
    __v: 0,
  };

  return (
    <div className="flex flex-col w-full">
      {/* 포스트 작성자명 & 게시 날짜 & 팔로우 버튼 */}
      <div className="flex items-center justify-between px-5 py-2.5 font-semibold">
        <div className="flex items-center gap-2">
          <span className="leading-none">@{post.author.fullName}</span>
          <span className="text-xs font-normal text-[#888888] leading-none">
            {new Date(post.createdAt).getMonth() + 1}월 {new Date(post.createdAt).getDate()}일
          </span>
        </div>
        <button
          className={`${isFollowing ? "bg-black" : "bg-primary"} text-white rounded px-4 py-1 transition-colors`}
          onClick={handleFollowClick}
        >
          {isFollowing ? "팔로잉" : "팔로우"}
        </button>
      </div>

      {/* 포스트 이미지 렌더링 */}
      <div className="relative w-full overflow-hidden">
        <img src={post.image} className="w-full aspect-square object-cover" alt="post-image" />
      </div>

      {/* 포스트 타이틀, 내용 렌더링 */}
      <div className="px-5 mt-5">
        <h2 className="font-semibold">{parsePostContent(post.title).title}</h2>
        <p className="mt-2.5">{parsePostContent(post.title).content}</p>
      </div>

      {/* 영역 구분선 */}
      <div className="px-[20px] mt-[20px]">
        <hr className="border-t border-gray200" />
      </div>

      {/* 댓글 리스트 렌더링 */}
      <section aria-label="Comment List" className="px-[20px] mt-[20px] pb-[100px] text-sm">
        <ul className="flex flex-col gap-[12px]">
          {post.comments.map((comment) => (
            <CommentItem key={comment._id} author={comment.author} content={comment.content} />
          ))}
        </ul>
      </section>

      {/* 댓글 입력폼 */}
      <form
        className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-[600px] border-t border-white bg-white py-1.5"
        onSubmit={handleSubmitComment}
      >
        <div className="flex items-center gap-2 px-[10px]">
          {/* 댓글 입력란 */}
          <textarea
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              e.target.style.height = "45px";
              const newHeight = Math.min(e.target.scrollHeight, 120);
              e.target.style.height = `${newHeight}px`;
            }}
            placeholder="댓글을 입력해주세요"
            className="flex-1 outline-none border border-[#8E8E93] rounded-[4px] px-3 py-2.5 placeholder:text-gray300 resize-none h-[45px] min-h-[45px] max-h-[120px] overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          />

          {/* 댓글 등록 버튼 */}
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`w-[45px] h-[45px] rounded-[4px] flex items-center justify-center bg-primary transition-opacity ${
              commentText.trim() ? "opacity-100" : "opacity-40"
            }`}
          >
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.36698 5.82747C1.08794 5.9072 0.834562 6.0584 0.631906 6.26612C0.429249 6.47384 0.284342 6.73088 0.211524 7.0118C0.138706 7.29272 0.1405 7.58778 0.216729 7.86779C0.292958 8.1478 0.440979 8.40306 0.646147 8.6083L3.48948 11.4483V16.9366H8.98365L11.8461 19.795C11.9998 19.9499 12.1825 20.073 12.3839 20.1571C12.5853 20.2412 12.8013 20.2846 13.0195 20.285C13.1629 20.2847 13.3057 20.2662 13.4445 20.23C13.7253 20.1592 13.9825 20.0158 14.1902 19.814C14.398 19.6123 14.5489 19.3594 14.6278 19.0808L20.1561 0.287476L1.36698 5.82747ZM1.83031 7.42997L16.0203 3.24664L5.15781 14.0916V10.7583L1.83031 7.42997ZM13.0303 18.6166L9.67448 15.27H6.34115L17.202 4.4183L13.0303 18.6166Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
