import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { getPostDetail, createComment, deleteComment } from "../../apis/apis";
import { Link } from "react-router";
import { tokenService } from "../../utils/token";
import { Modal } from "../../components/Modal";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 댓글 삭제 모달 상태 관리
  const [deleteCommentId, setDeleteCommentId] = useState<string>(""); // 삭제할 댓글 ID 상태 관리
  const { postId } = useParams<{ postId: string }>(); // URL 파라미터에서 postId 추출
  const currentUser = tokenService.getUser(); // 현재 로그인한 사용자 정보
  const randomThumbnail = useMemo(() => {
    const thumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5, thumbnail6];
    return thumbnails[Math.floor(Math.random() * thumbnails.length)];
  }, []); // 이미지 없을 시 랜덤 썸네일 설정

  // 포스트 데이터 불러오기
  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) return;
      try {
        const postData = await getPostDetail(postId);
        setPost(postData);
      } catch (error) {
        // console.error("포스트를 불러오는데 실패했습니다.:", error);
      }
    };

    loadPostDetail();
  }, [postId]);

  // json 파싱
  const parsePostContent = (jsonString: string): PostItemProps => {
    try {
      return JSON.parse(jsonString) as PostItemProps;
    } catch (error) {
      //console.error("포스트를 불러오는데 실패했습니다.:", error);
      return { title: "", content: "" };
    }
  };

  // 임시 팔로우 로직
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  // 댓글 아이템
  const CommentItem = ({ author, comment, _id, onDelete, isCurrentUser }: CommentItemProps) => {
    return (
      <div className="flex justify-between items-start p-3">
        <div className="flex gap-3">
          {/* 프로필 이미지 */}
          <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              className="w-[40px] h-[40px] rounded-full object-cover"
              src={author.image ? author.image : "/Capsy.svg"}
              alt="프로필 이미지"
            />
          </div>

          {/* 댓글 내용 */}
          <div>
            <span className="font-bold">{author.fullName}</span>
            <p className="mt-1">{comment}</p>
          </div>
        </div>

        {/* 삭제 버튼 */}
        {isCurrentUser && (
          <button onClick={() => onDelete(_id)} className="text-gray-400 hover:text-opacity-60 transition-colors">
            <svg width="10" height="10" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_957_4884)">
                <path
                  d="M16.5 3H12.75V1.5C12.75 1.10218 12.592 0.720644 12.3107 0.43934C12.0294 0.158035 11.6478 0 11.25 0L6.75 0C6.35217 0 5.97064 0.158035 5.68934 0.43934C5.40803 0.720644 5.25 1.10218 5.25 1.5V3H1.5V4.5H3V15.75C3 16.3467 3.23705 16.919 3.65901 17.341C4.08097 17.7629 4.65326 18 5.25 18H12.75C13.3467 18 13.919 17.7629 14.341 17.341C14.7629 16.919 15 16.3467 15 15.75V4.5H16.5V3ZM6.75 1.5H11.25V3H6.75V1.5ZM13.5 15.75C13.5 15.9489 13.421 16.1397 13.2803 16.2803C13.1397 16.421 12.9489 16.5 12.75 16.5H5.25C5.05109 16.5 4.86032 16.421 4.71967 16.2803C4.57902 16.1397 4.5 15.9489 4.5 15.75V4.5H13.5V15.75Z"
                  fill="currentColor"
                />
                <path d="M8.25 7.49951H6.75V13.4995H8.25V7.49951Z" fill="currentColor" />
                <path d="M11.25 7.49951H9.75V13.4995H11.25V7.49951Z" fill="currentColor" />
              </g>
              <defs>
                <clipPath id="clip0_957_4884">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </div>
    );
  };

  // 댓글 제출 로직
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        comment: commentText,
        postId: post?._id,
      });

      // 댓글 작성 후 포스트 정보 새로고침
      const updatedPost = await getPostDetail(post?._id as string);
      setPost(updatedPost);
      setCommentText(""); // 입력창 초기화
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    }
  };
  // 댓글 삭제 로직
  const handleDeleteComment = (commentId: string) => {
    setDeleteCommentId(commentId);
    setShowDeleteModal(true);
  };
  // 댓글 삭제 확인
  const confirmDelete = async () => {
    try {
      await deleteComment(deleteCommentId);
      // 포스트 데이터 새로고침
      const updatedPost = await getPostDetail(postId as string);
      setPost(updatedPost);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setShowDeleteModal(false);
      setDeleteCommentId("");
    }
  };

  if (!post) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        {/* 포스트 작성자명 & 게시 날짜 & 팔로우 버튼 */}
        <div className="flex items-center justify-between px-5 py-2.5 font-semibold">
          <div className="flex items-center gap-3">
            {/* 작성자 프로필 이미지 */}
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
              <img
                className="w-[40px] h-[40px] rounded-full object-cover"
                src={post.author.image ? post.author.image : "/Capsy.svg"}
                alt="작성자 프로필 이미지"
              />
            </div>

            {/* 작성자 정보와 게시 날짜 */}
            <div className="flex items-center gap-2">
              <Link to={`/userinfo/${post.author.fullName}`} className="font-bold hover:underline">
                @{post.author.fullName}
              </Link>
              <span className="text-xs font-normal text-[#888888]">
                {new Date(post.createdAt).getMonth() + 1}월 {new Date(post.createdAt).getDate()}일
              </span>
            </div>
          </div>

          {/* 팔로우 버튼 */}
          {currentUser?._id !== post.author._id && (
            <button
              className={`${
                isFollowing ? "bg-black" : "bg-primary"
              } text-white rounded px-4 py-1 transition-colors text-sm`}
              onClick={handleFollowClick}
            >
              {isFollowing ? "팔로잉" : "팔로우"}
            </button>
          )}
        </div>
        <hr className="border-t border-gray200" />
        {/* 포스트 이미지 렌더링 */}
        <div className="relative w-[600px] h-[600px] bg-gray-50 mx-auto">
          <img src={post.image || randomThumbnail} className="w-full h-full object-contain" alt="post-image" />
        </div>

        {/* 포스트 타이틀, 내용 렌더링 */}
        <div className="px-5 mt-5">
          <h2 className="font-semibold text-lg ">{parsePostContent(post.title).title}</h2>
          <p className="mt-2.5 text-base">{parsePostContent(post.title).content}</p>
        </div>

        {/* 영역 구분선 */}
        <div className="px-[20px] mt-[20px]">
          <hr className="border-t border-gray200" />
        </div>

        {/* 댓글 리스트 렌더링 */}
        <section aria-label="Comment List" className="px-[20px] mt-[20px] mb-[100px] text-sm">
          <div className="font-bold h-[45px]">댓글 {post.comments.length}</div>
          {post.comments.length === 0 && <div className="text-center text-gray-300">첫 댓글을 남겨보세요!</div>}
          <ul className="flex flex-col [&>*+*]:border-t border-gray-150">
            {post.comments.map((comment) => (
              <li key={comment._id}>
                <CommentItem
                  author={comment.author}
                  comment={comment.comment}
                  _id={comment._id}
                  onDelete={handleDeleteComment}
                  isCurrentUser={currentUser?._id === comment.author._id}
                />
              </li>
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

      {/* 댓글 삭제 모달 */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <p className="text-center mb-4">댓글을 삭제하시겠습니까?</p>
        <div className="flex justify-end gap-2 w-full">
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowDeleteModal(false)}>
            취소
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded transition-opacity hover:opacity-40"
            onClick={confirmDelete}
          >
            삭제
          </button>
        </div>
      </Modal>
    </>
  );
}
