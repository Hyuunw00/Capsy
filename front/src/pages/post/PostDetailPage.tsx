import { useParams } from "react-router";
import { useState } from "react";

interface Comment {
  id: string;
  userId: string;
  content: string;
}
interface CommentItemProps {
  userId: string;
  content: string;
}

//댓글 아이템 가져오는 함수

const CommentItem = ({ userId, content }: CommentItemProps) => (
  <li className="py-[4px]">
    <div className="font-semibold">@{userId}</div>
    <div className="mt-[9.14px]">{content}</div>
  </li>
);

// 이미지 슬라이더의 화살표 버튼

const ArrowButton = ({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) => (
  <div
    className={`absolute top-0 ${direction === "left" ? "left-0" : "right-0"} w-1/3 h-full group cursor-pointer`}
    onClick={onClick}
  >
    <div className="absolute top-0 w-full h-full group-hover:bg-transparent">
      <button
        className={`absolute top-1/2 ${direction === "left" ? "left-0" : "right-0"} transform -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
      >
        <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={
              direction === "left"
                ? "M6.7675 7.50002L9.86125 10.5938L8.9775 11.4775L5 7.50002L8.9775 3.52252L9.86125 4.40627L6.7675 7.50002Z"
                : "M8.2325 7.50002L5.13875 4.40627L6.0225 3.52252L10 7.50002L6.0225 11.4775L5.13875 10.5938L8.2325 7.50002Z"
            }
            className="fill-primary"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default function PostDetailPage() {
  const { postId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 이미지 관리 상태
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 관리 상태
  const [commentText, setCommentText] = useState(""); // 댓글 관리 상태

  const handleFollowClick = () => {
    // 팔로우 버튼 클릭 시 팔로우 상태 변경
    setIsFollowing(!isFollowing);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    // 댓글 제출 시 댓글 관리 상태 초기화
    e.preventDefault(); // form 기본 이벤트 방지
    setCommentText(""); // 댓글 상태 초기화
  };
  // 포스트 더미 데이터
  const post = {
    userId: "huhjeongmin",
    images: [
      "https://cdn.pixabay.com/photo/2024/10/22/01/17/cat-9138461_1280.jpg",
      "https://cdn.pixabay.com/photo/2021/12/01/18/17/cat-6838844_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/04/02/06/25/cat-mia-703408_1280.jpg",
    ],
    title: "테스트 포스트용 제목입니다.",
    content: "우리집 고양이들을 소개합니다 😺😸😼",
    createdAt: "2024-12-06T13:58:34.439Z",
  };
  // 댓글 더미 데이터
  const comments: Comment[] = [
    {
      id: "1",
      userId: "testUser",
      content:
        "Lorem ipsum dolor sit amet consectetur. Amet vestibulum suspendisse mauris lacus felis velit sit neque. Sit ante nunc nec ac bibendum cursus. Eget aenean ut ut proin. Nisl pellentesque amet dictum ullamcorper tempor mauris magna egestas condimentum. Integer natoque enim aliquam donec. A sit scelerisque risus ante fringilla amet amet elit. Et ipsum porttitor elit diam euismod. Aenean convallis scelerisque euismod elit tempus. Sagittis auctor penatibus cras nulla orci sit.",
    },
    {
      id: "2",
      userId: "testUser2",
      content:
        "Lorem ipsum dolor sit amet consectetur. Amet vestibulum suspendisse mauris lacus felis velit sit neque. Sit ante nunc nec ac bibendum cursus. Eget aenean ut ut proin. Nisl pellentesque amet dictum ullamcorper tempor mauris magna egestas condimentum. Integer natoque enim aliquam donec. A sit scelerisque risus ante fringilla amet amet elit. Et ipsum porttitor elit diam euismod. Aenean convallis scelerisque euismod elit tempus. Sagittis auctor penatibus cras nulla orci sit.",
    },
  ];
  // 다음 이미지로 이동하는 함수
  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  // 이전 이미지로 이동하는 함수
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  // 작성자명 + 팔로우 버튼
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-5 py-2.5 font-semibold">
        <div className="flex items-center gap-2">
          <span className="leading-none">@{post.userId}</span>
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

      {/* 이미지 슬라이더 */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex w-full transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              className="min-w-full w-0 aspect-square object-cover"
              alt={`post-image-${index}`}
            />
          ))}
        </div>
        {/* 이전 이미지 버튼 */}
        {currentImageIndex > 0 && <ArrowButton direction="left" onClick={handlePrevImage} />}
        {/* 다음 이미지 버튼 */}
        {currentImageIndex < post.images.length - 1 && <ArrowButton direction="right" onClick={handleNextImage} />}
        {/* 이미지 인디케이터 */}
        {post.images.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {post.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-primary" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 포스트 제목  및 내용*/}
      <div className="px-[20px] pt-[24px]">
        <h1 className="text-xl font-bold">{post.title}</h1>
      </div>

      <div className="px-[20px] py-[8px] text-base">{post.content}</div>

      {/* 구분선 */}
      <div className="px-[20px] mt-[20px]">
        <hr className="border-t border-gray200" />
      </div>

      {/*댓글 리스트 */}
      <section aria-label="Comment List" className="px-[20px] mt-[20px] pb-[100px] text-sm">
        <ul className="flex flex-col gap-[12px]">
          {comments.map((comment) => (
            <CommentItem key={comment.id} userId={comment.userId} content={comment.content} />
          ))}
        </ul>
      </section>

      {/* 댓글 입력 박스 */}
      <form
        className="fixed bottom-[60px] left-1/2 -translate-x-1/2 w-[600px] border-t border-white bg-white py-1.5"
        onSubmit={handleSubmitComment}
      >
        <div className="flex items-center gap-2 px-[10px]">
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
          {/* 댓글 제출 버튼 */}
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
