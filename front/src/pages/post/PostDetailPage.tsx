import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { getPostDetail, deletePost, createComment, deleteComment } from "../../apis/apis";
import { Link } from "react-router";
import { tokenService } from "../../utils/token";
import { elapsedText } from "./ElapsedText";
import thumbnail1 from "../../assets/random-thumnail/random-thumnail-black-1.png";
import thumbnail2 from "../../assets/random-thumnail/random-thumnail-black-2.png";
import thumbnail3 from "../../assets/random-thumnail/random-thumnail-black-3.png";
import thumbnail4 from "../../assets/random-thumnail/random-thumnail-white-1.png";
import thumbnail5 from "../../assets/random-thumnail/random-thumnail-white-2.png";
import thumbnail6 from "../../assets/random-thumnail/random-thumnail-white-3.png";
import img_heart from "../../assets/Heart_Curved.svg";
import img_fillHeart from "../../assets/heart-fill.svg";
import img_comment from "../../assets/fi-rs-comment.svg";
import Loading from "../../components/Loading";
import axiosInstance from "../../apis/axiosInstance";
import NotificationModal from "../../components/NotificationModal";

export default function PostDetailPage() {
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 관리
  const [commentText, setCommentText] = useState(""); // 댓글 상태 관리
  const [post, setPost] = useState<PostDetail | null>(null); // 포스트 데이터 상태 관리
  const [showPostDeleteModal, setShowPostDeleteModal] = useState(false); // 포스트 삭제 모달 상태 관리
  const [showDropdown, setShowDropdown] = useState(false); // 더보기 드롭다운 상태 관리
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 댓글 삭제 모달 상태 관리
  const [deleteCommentId, setDeleteCommentId] = useState<string>(""); // 삭제할 댓글 ID 상태 관리
  const { postId } = useParams<{ postId: string }>(); // URL 파라미터에서 postId 추출
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentUser = tokenService.getUser(); // 현재 로그인한 사용자 정보
  const randomThumbnail = useMemo(() => {
    const thumbnails = [thumbnail1, thumbnail2, thumbnail3, thumbnail4, thumbnail5, thumbnail6];
    return thumbnails[Math.floor(Math.random() * thumbnails.length)];
  }, []); // 이미지 없을 시 랜덤 썸네일 설정
  const [likeStatus, setLikeStatus] = useState<{ [key: string]: boolean }>({}); // 좋아요 상태 관리
  // 유저 데이터 관리
  const [userData, _] = useState(() => {
    const storedUserData = sessionStorage.getItem("user");
    return storedUserData ? JSON.parse(storedUserData) : { likes: [] };
  });

  // 포스트 데이터 불러오기
  useEffect(() => {
    const loadPostDetail = async () => {
      if (!postId) return;
      try {
        const postData = await getPostDetail(postId);
        setPost(postData);
        // 좋아요 되어있는 상태라면 화면에 표시
        const isLiked = postData.likes.some((like: Like) => like.user === userData._id); // 좋아요 상태 확인
        setLikeStatus((prevState) => ({
          ...prevState,
          [postId]: isLiked,
        }));
      } catch (error) {
        // console.error("포스트를 불러오는데 실패했습니다.:", error);
      }
    };

    loadPostDetail();
  }, [postId]);
  // 더보기 드롭다운 닫기
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // json 파싱
  const parsePostContent = (jsonString: string): PostItemProps => {
    try {
      return JSON.parse(jsonString) as PostItemProps;
    } catch (error) {
      //console.error("포스트를 불러오는데 실패했습니다.:", error);
      return { title: "", content: "", image: [] };
    }
  };
  // 더보기 드롭다운 토글
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // 임시 팔로우 로직
  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };
  // 글 삭제 로직
  const handlePostDelete = async () => {
    try {
      if (!post?._id) {
        throw new Error("삭제할 게시글을 찾을 수 없습니다.");
      }

      await deletePost(post._id);
      window.location.href = "/";
    } catch (error) {
      console.error("게시글 삭제 실패:", error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다");
    } finally {
      setShowPostDeleteModal(false);
    }
  };

  // 이전, 다음 이미지 이동시켜주는 버튼
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

  // 댓글 아이템
  const CommentItem = ({ author, comment, _id, createdAt, onDelete, isCurrentUser }: CommentItemProps) => {
    return (
      <div className="flex items-start justify-between p-3">
        <div className="flex gap-3">
          {/* 프로필 이미지 */}
          <Link to={`/userinfo/${author.fullName}`}>
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer">
              <img
                className="w-[40px] h-[40px] rounded-full object-cover"
                src={author.image ? author.image : "/Capsy.svg"}
                alt="프로필 이미지"
              />
            </div>
          </Link>

          {/* 댓글 내용 */}
          <div>
            <Link to={`/userinfo/${author.fullName}`} className="font-bold">
              {author.fullName}
            </Link>
            <span className="ml-2 text-xs text-gray-500">{elapsedText(new Date(createdAt))}</span>
            <p className="mt-1">{comment}</p>
          </div>
        </div>

        {/* 삭제 버튼 */}
        {isCurrentUser && (
          <button onClick={() => onDelete(_id)} className="text-gray-400 transition-colors hover:text-opacity-60">
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
    if (!commentText.trim() || !post?._id || !post?.author._id) return; // 수정 : 타입 에러때문에 각 요소별로 타입 지정 했습니다 (윤슬)

    try {
      // createComment의 반환값을 바로 사용하도록 수정 (윤슬)
      const updatedPost = await createComment({
        comment: commentText,
        postId: post._id,
        postAuthorId: post.author._id, // 수정 : 이미 있는 작성자 ID 전달 (윤슬)
      });

      // 댓글 작성 후 포스트 정보 새로고침
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
  // 새로운 형식으로 처리한 이미지(들)
  const postImages = parsePostContent(post.title).image ? parsePostContent(post.title).image! : [];
  // file형식으로 처리한 이미지 1개 -> 나중에 이미지 처리 형식 바꾸면 제거할 예정
  const pastImage = post.image;

  const handleNextImage = () => {
    if (currentImageIndex < postImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  // 좋아요 로직
  const handleLikeClick = async (postId: string) => {
    const userId = userData._id;
    console.log("userId: ", userId);

    const isLiked = post.likes.some((like: Like) => like.user === userId);

    try {
      if (!isLiked) {
        // 좋아요 추가
        const response = await axiosInstance.post("/likes/create", { postId });
        const newLike = {
          _id: response.data._id,
          post: postId,
          user: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        post.likes.push(newLike);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: true }));
      } else {
        // 좋아요 취소
        const likeId = post.likes.find((like: Like) => like.user === userId)._id;
        await axiosInstance.delete("/likes/delete", { data: { id: likeId } });
        post.likes = post.likes.filter((like: Like) => like._id !== likeId);
        setLikeStatus((prevState) => ({ ...prevState, [postId]: false }));
      }
    } catch (error) {
      console.error("Error occured: ", error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {/* 포스트 작성자명 & 게시 날짜 & 팔로우 버튼 */}
        <div className="flex items-center justify-between px-5 py-2.5 font-semibold">
          <div className="flex items-center gap-3">
            {/* 작성자 프로필 이미지 */}
            <Link to={`/userinfo/${post.author.fullName}`}>
              <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer">
                <img
                  className="w-[40px] h-[40px] rounded-full object-cover"
                  src={post.author.image ? post.author.image : "/Capsy.svg"}
                  alt="작성자 프로필 이미지"
                />
              </div>
            </Link>
            {/* 작성자 정보와 게시 날짜 */}
            <div className="flex items-center gap-2">
              <Link to={`/userinfo/${post.author.fullName}`} className="font-bold">
                @{post.author.fullName}
              </Link>
              <span className="text-xs font-normal text-[#888888]">{elapsedText(new Date(post.createdAt))}</span>
            </div>
          </div>

          {/* 팔로우 버튼 */}
          {currentUser?._id === post.author._id ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"
                    fill="#11152A"
                  />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-32 px-[6px] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <ul className="py-1">
                    <li>
                      <button className="w-full text-center px-4 py-2 text-sm font-normal text-gray-600 hover:font-semibold hover:bg-gray-100 transition-all">
                        수정
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setShowPostDeleteModal(true);
                          setShowDropdown(false);
                        }}
                        className="w-full text-center px-4 py-2 text-sm font-normal text-primary hover:font-semibold hover:bg-gray-100 transition-all"
                      >
                        삭제
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
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
        <div className="relative w-[600px] h-[600px] bg-black mx-auto overflow-hidden">
          <div
            className="flex w-full h-full transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {postImages.length > 0 ? (
              postImages.map((image, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
                  <img src={image} className="w-full h-full object-contain" alt={`post-image-${index}`} />
                </div>
              ))
            ) : (
              <img
                src={pastImage ? pastImage : randomThumbnail}
                className="w-full h-full object-contain"
                alt="post-image"
              />
            )}
          </div>
          <div className="absolute flex items-center bottom-0 w-full h-[50px] px-4 space-x-2 bg-custom-gradient z-10">
            {/* 좋아요 버튼 및 좋아요 수 */}
            <img
              src={likeStatus[post._id] ? img_fillHeart : img_heart}
              alt="좋아요"
              className="w-[24px] h-[24px] cursor-pointer object-contain"
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(post._id);
              }}
            />
            <span className="pr-3 text-white">{post.likes.length}</span>
            {/* 댓글 아이콘 및 댓글 수 */}
            <img src={img_comment} alt="댓글" className="w-[20px] h-[24px]" />
            <span className="text-white">{post.comments.length}</span>
          </div>
          {/* 이전 이미지 버튼 */}
          {currentImageIndex > 0 && <ArrowButton direction="left" onClick={handlePrevImage} />}
          {/* 다음 이미지 버튼 */}
          {currentImageIndex < postImages.length - 1 && <ArrowButton direction="right" onClick={handleNextImage} />}
          {/* 이미지 인디케이터 */}
          {postImages.length > 1 && (
            <div className="absolute bottom-3.5 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              {postImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-primary" : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          )}
          {/* <img src={post.image || randomThumbnail} className="object-contain w-full h-full" alt="post-image" /> */}
        </div>

        {/* 포스트 타이틀, 내용 렌더링 */}
        <div className="relative px-5 mt-5">
          <h2 className="text-lg font-semibold">{parsePostContent(post.title).title}</h2>
          <p className="mt-2.5 text-base">
            {parsePostContent(post.title)
              .content?.split("\\n")
              .map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
          </p>
          <span className="text-xs font-normal text-[#888888]">
            {new Date(post.createdAt).getFullYear()}년 {new Date(post.createdAt).getMonth() + 1}월 {""}
            {new Date(post.createdAt).getDate()}일
          </span>
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
                  createdAt={comment.createdAt} //
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
      <NotificationModal isOpen={showDeleteModal} title="댓글 삭제" description="댓글을 삭제하시겠습니까?">
        <div className="flex justify-end w-full gap-2">
          <button
            className="w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
          >
            취소
          </button>
          <button
            className="w-full py-2 text-white transition-opacity rounded bg-primary hover:opacity-40"
            onClick={confirmDelete}
          >
            삭제
          </button>
        </div>
      </NotificationModal>

      {/* 포스트 삭제 모달 */}
      <NotificationModal isOpen={showPostDeleteModal} title="게시글 삭제" description="게시글을 삭제하시겠습니까?">
        <div className="flex justify-end w-full gap-2">
          <button
            className="w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowPostDeleteModal(false)}
          >
            취소
          </button>
          <button
            className="w-full py-2 text-white transition-opacity rounded bg-primary hover:opacity-40"
            onClick={handlePostDelete}
          >
            삭제
          </button>
        </div>
      </NotificationModal>
    </>
  );
}
