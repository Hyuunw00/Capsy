import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { getPostDetail } from "../../apis/apis";
import thumbnail1 from "../../assets/random-thumnail/random-thumnail-black-1.png";
import thumbnail2 from "../../assets/random-thumnail/random-thumnail-black-2.png";
import thumbnail3 from "../../assets/random-thumnail/random-thumnail-black-3.png";
import thumbnail4 from "../../assets/random-thumnail/random-thumnail-white-1.png";
import thumbnail5 from "../../assets/random-thumnail/random-thumnail-white-2.png";
import thumbnail6 from "../../assets/random-thumnail/random-thumnail-white-3.png";
import Loading from "../../components/Loading";

export default function PostDetailPage() {
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 관리
  const [commentText, setCommentText] = useState(""); // 댓글 상태 관리
  const [post, setPost] = useState<PostDetail | null>(null); // 포스트 데이터 상태 관리
  const { postId } = useParams<{ postId: string }>();
  // const postId = "675a57eb18d96f4540eb68d2";

  // 포스트 데이터 불러오기
  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) return;
      try {
        const postData = await getPostDetail(postId);
        setPost(postData);
      } catch (error) {
        console.error("포스트를 불러오는데 실패했습니다.:", error);
      }
    };

    loadPostDetail();
  }, [postId]);

  // json 파싱
  const parsePostContent = (jsonString: string): PostContent => {
    try {
      return JSON.parse(jsonString) as PostContent;
    } catch (error) {
      console.error("포스트를 불러오는데 실패했습니다.:", error);
      return { title: "", content: "" };
    }
  };

  // 팔로우 로직
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  // 이미지 없을 경우 랜덤 썸네일 로직
  const randomThumbnail = useMemo(() => {
    const thumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5, thumbnail6];
    return thumbnails[Math.floor(Math.random() * thumbnails.length)];
  }, []);

  // 댓글 아이템
  const CommentItem = ({ author, content }: PostComment) => (
    <li className="py-[4px]">
      <div className="font-semibold">@{author.fullName}</div>
      <div className="mt-[9.14px]">{content}</div>
    </li>
  );

  // 댓글 제출 로직
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setCommentText("");
  };

  if (!post) {
    return <Loading />;
  }

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
      <hr className="border-t border-gray200" />
      {/* 포스트 이미지 렌더링 */}
      <div className="relative w-full overflow-hidden">
        <img src={post.image || randomThumbnail} className="object-cover w-full aspect-square" alt="post-image" />
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
