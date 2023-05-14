import { AuthContext } from "@/context/AuthContext";
import { auth, db, storage } from "@/firebase";
import "@/style.scss";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  /* redirect to home page if logged in */
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const displayName = (
      form.elements.namedItem("displayName") as HTMLInputElement
    ).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const file =
      (form.elements.namedItem("file") as HTMLInputElement).files?.[0] || null;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, `avatar/${res.user.uid}`);

      const uploadTask = uploadBytesResumable(storageRef, file as Blob);

      uploadTask.on(
        "state_changed",
        null,
        () => {
          setError("upload failed");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(res.user, { displayName, photoURL: downloadURL });

          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          await setDoc(doc(db, "userChats", res.user.uid), {});

          navigate("/");
        }
      );
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.code);
      } else {
        setError("Something went wrong.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-sky-500">
      <div className="px-15 flex w-full max-w-md flex-col items-center gap-2.5 rounded-lg bg-white py-5">
        <span className="text-2xl font-bold text-gray-600">Chat</span>
        <span className="text-lg text-gray-600">Register</span>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="text"
            name="displayName"
            placeholder="display name"
          />
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="password"
            name="password"
            placeholder="password"
          />
          <input
            required
            className="hidden"
            type="file"
            name="file"
            id="file"
          />
          <label
            className="flex cursor-pointer items-center gap-2.5 text-sm text-cyan-800"
            htmlFor="file"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span>Add an avatar</span>
          </label>
          <button className="cursor-pointer rounded-md border-none bg-blue-400  p-2.5 font-bold text-white hover:bg-blue-500">
            Sign up
          </button>
          {error && (
            <span className="text-center text-sm font-semibold text-red-500">
              {error}
            </span>
          )}
        </form>
        <p className="mt-2.5 text-xs text-gray-500">
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
