import { useDispatch } from "react-redux";
import { addReaction } from "./postsSlice";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => { // destructured
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => dispatch(addReaction({ id: post.id, name }))}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
export default ReactionButtons;

// Object.entries
//- creates an array from passed object and makes an array for each key value pair of the object
// as ["key", "value"]

// const object1 = {
//     a: 'somestring',
//     b: 42
//   }

//   Object.entries(object1) // Array(2) [["a", "something"], ["b", 42]]

// const reactionButtons = Object.entries(reactionEmoji).map((item) => {
//   return (
//     <button
//       key={item[0]}
//       type="button"
//       className="reactionButton"
//       onClick={() => dispatch(addReaction({ id: post.id, name: item[0] }))}
//     >
//       {item[1]} {post.reactions[item[0]]}
//     </button>
//   );
// });
