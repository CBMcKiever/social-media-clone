import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { firestoreDB, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  title: string;
  description: string;
}

export const CreatePostForm = () => {
  const postsRef = collection(firestoreDB, "posts");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const createPostSchema = yup.object().shape({
    title: yup.string().required("You must add a title."),
    description: yup
      .string()
      .required("You must add a description.")
      .min(10)
      .max(500),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createPostSchema),
  });

  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postsRef, {
      ...data,
      username: user?.displayName,
      userId: user?.uid,
    });
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onCreatePost)}>
      <input placeholder='Title...' {...register("title")} />
      <p style={{ color: "red" }}> {errors.title?.message}</p>
      <textarea placeholder='Description...' {...register("description")} />
      <p style={{ color: "red" }}> {errors.description?.message}</p>
      <input type='submit' />
    </form>
  );
};
