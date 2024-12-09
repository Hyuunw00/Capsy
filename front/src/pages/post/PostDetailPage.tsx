import { useParams } from "react-router";

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

export default function PostDetailPage() {
  const { postId } = useParams();

  const post = {
    userId: "testUser",
    image: "https://cdn.pixabay.com/photo/2024/10/22/01/17/cat-9138461_1280.jpg",
    title: "테스트 포스트 제목",
    content: "테스트용 아무거나 집어넣기",
  };

  const comments: Comment[] = [
    { id: "1", userId: "testUser", content: "멋진 고양이." },
    {
      id: "2",
      userId: "testUser2",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between px-[20px] py-[9.5px] font-semibold">
        <span>@{post.userId}</span>
        <button className="bg-black text-white rounded-[2px] px-4 py-1">팔로우</button>
      </div>

      <div className="w-full">
        <img src={post.image} className="w-full aspect-square object-cover" alt="post-image" />
      </div>

      <div className="px-[20px] pt-[24px]">
        <h1 className="text-xl font-bold">{post.title}</h1>
      </div>

      <div className="px-[20px] py-[8px]">{post.content}</div>

      <section aria-label="Comment List" className="px-[20px] mt-[21.21px]">
        <ul className="flex flex-col gap-[12px]">
          {comments.map((comment) => (
            <CommentItem key={comment.id} userId={comment.userId} content={comment.content} />
          ))}
        </ul>
      </section>
    </div>
  );
}
