import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, firestoreDB } from "../../config/firebase";
import { Post as IPost } from "./Main";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface PostProps {
  post: IPost;
}

interface Like {
  userId: string;
  likeId: string;
}

export const Post = (props: PostProps) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(firestoreDB, "likes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const likeData = await getDocs(likesDoc);
    setLikes(
      likeData.docs.map((doc) => ({
        userId: doc.data().userId,
        likeId: doc.id,
      }))
    );
  };

  const onLikePost = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });

      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onRemoveLike = async () => {
    try {
      const likeQuery = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const likeToRemoveData = await getDocs(likeQuery);
      const toRemove = doc(firestoreDB, "likes", likeToRemoveData.docs[0].id);
      await deleteDoc(toRemove);
      if (user) {
        setLikes(
          (prev) =>
            prev &&
            prev.filter((like) => like.likeId !== likeToRemoveData.docs[0].id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <div>
      <h2>{post.title}</h2>
      <div>
        <p>{post.description}</p>
      </div>
      <div>
        <p>@{post.username}</p>
        <button onClick={hasUserLiked ? onRemoveLike : onLikePost}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p>Likes: {likes?.length}</p>}
      </div>
    </div>
  );
};
