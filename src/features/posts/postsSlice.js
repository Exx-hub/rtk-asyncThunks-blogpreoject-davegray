import {
  createSlice,
  createAsyncThunk,
  createSelector,
  nanoid,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postAdapter.getInitialState({
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
});

// entity adapter => state becomes an object with an id array for each item and each item in the entities object

// {
//   // The unique IDs of each item. Must be strings or numbers
//   ids: []
//   // A lookup table mapping entity IDs to the corresponding entity objects
//   entities: {
//   }
// }

// i think what happens here is in postAdapter.upsertMany(state,loadedPosts)
// loadedPosts being an array, is mapped through, number of items becomes number of ids in ids array.
// and loadedPosts array item, are put into entities as object. an object per item.
// just like in an array of object.

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return response.data;
  } catch (err) {
    return err.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (postContent) => {
    try {
      const response = await axios.post(POSTS_URL, postContent);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (editContent) => {
    const { id } = editContent;

    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, editContent);
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postContent) => {
    const { id } = postContent;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return postContent;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addReaction: (state, action) => {
      const { id, name } = action.payload;

      const foundItem = state.entities[id];

      console.log(JSON.stringify(state.ids));

      if (foundItem) {
        foundItem.reactions[name]++;
      }
    },
    increaseCount: (state, action) => {
      state.count = state.count + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // add date and reactions to every post object
        let min = 1;
        const loadedPosts = action.payload.slice(0, 2).map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };

          return post;
        });

        console.log(loadedPosts);

        // postAdapter shit --- fetched posts are added to state
        postAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        console.log("eto ang action ng rejected:", action);
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // fake api always returns response with id: 101
        // so get the id of the post with the highest id, then add 1.

        // // Fix for API post IDs:
        // // Creating sortedPosts & assigning the id
        // // would be not be needed if the fake API
        // // returned accurate new post IDs

        const sortedPosts = state.ids.sort((a, b) => {
          if (a > b) return 1;
          if (a < b) return -1;
          return 0;
        });

        action.payload.id = sortedPosts[sortedPosts.length - 1] + 1;
        // // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);

        // postadapter shit
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }

        action.payload.date = new Date().toISOString();

        // postAdapter method
        postAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }

        const { id } = action.payload;

        // postAdapter shit
        postAdapter.removeOne(state, id);
      });
  },
});

// getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors((state) => state.postState);

export const getPostStatus = (state) => state.postState.status;
export const getPostsError = (state) => state.postState.error;

//memoized selectPostByUser
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const getCount = (state) => state.postState.count;

// action creator functions are automatically created when in the reducer of createSlice. (actions from reducer)
export const { addPost, addReaction, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
