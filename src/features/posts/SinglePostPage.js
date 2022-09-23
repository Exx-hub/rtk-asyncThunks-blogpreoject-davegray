import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import { selectPostById } from "./postsSlice";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";

function SinglePostPage() {
  const { postId } = useParams();

  const postById = useSelector((state) => selectPostById(state, +postId));
  //   console.log(postById);

  if (!postById) {
    return (
      <section>
        <h2>Post Not Found.</h2>
      </section>
    );
  }
  return (
    <article>
      <h2>{postById.title}</h2>
      <p>{postById.body}</p>
      <p className="postCredit">
        <Link to={`/post/edit/${postById.id}`}>Edit Post</Link>
        <PostAuthor userId={postById.userId} />
        <TimeAgo timestamp={postById.date} />
      </p>
      <ReactionButtons post={postById} />
    </article>
  );
}

export default SinglePostPage;
