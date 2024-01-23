import { collection, getDocs } from "firebase/firestore";
import { firestoreDB } from "../../config/firebase";
import { useEffect, useState } from "react";
import { Post } from "./post";

export interface Post {
  id: string;
  userId: string;
  title: string;
  username: string;
  description: string;
}

export const Main = () => {
  useEffect(() => {
    getPosts();
  }, []);
  const [postsList, setPostsList] = useState<Post[] | null>(null);
  const postsRef = collection(firestoreDB, "posts");

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    console.log(data.docs[0].data());
    setPostsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
    );
  };

  return (
    <div>
      {postsList?.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};
