import { useParams } from "react-router";

export default function PostDetailPage() {
  const { postId } = useParams();
  return (
    <>
      <h1>Post Detail Page: {postId}</h1>
    </>
  );
}
