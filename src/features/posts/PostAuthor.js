import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

function PostAuthor({ userId }) {
  const users = useSelector(selectAllUsers);

  const postAuthor = users.find((user) => userId === user.id);

  if (!postAuthor) {
    return <span>by Anonymous</span>;
  }

  return <span>by {postAuthor.name}</span>;
}

export default PostAuthor;
