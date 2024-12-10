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

const CommentItem = ({ userId, content }: CommentItemProps) => (
  <li className="py-[4px]">
    <div className="font-semibold">@{userId}</div>
    <div className="mt-[9.14px]">{content}</div>
  </li>
);

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const post = {
    userId: "huhjeongmin",
    images: [
      "https://cdn.pixabay.com/photo/2024/10/22/01/17/cat-9138461_1280.jpg",
      "https://cdn.pixabay.com/photo/2021/12/01/18/17/cat-6838844_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/04/02/06/25/cat-mia-703408_1280.jpg",
    ],
    title: "테스트 포스트용 제목입니다.",
    content: "우리집 고양이들을 소개합니다 😺😸😼",
  };

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

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-5 py-2.5 font-semibold">
        <span>@{post.userId}</span>
        <button className="bg-primary text-white rounded px-4 py-1">팔로우</button>
      </div>

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

      <div className="px-[20px] pt-[24px]">
        <h1 className="text-xl font-bold">{post.title}</h1>
      </div>

      <div className="px-[20px] py-[8px] text-base">{post.content}</div>

      <section aria-label="Comment List" className="px-[20px] mt-[21.21px] text-sm">
        <ul className="flex flex-col gap-[12px]">
          {comments.map((comment) => (
            <CommentItem key={comment.id} userId={comment.userId} content={comment.content} />
          ))}
        </ul>
      </section>
    </div>
  );
}
