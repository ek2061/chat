import { AuthContext } from "@/context/AuthContext";
import { auth, db, storage } from "@/firebase";
import "@/style.scss";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  const [err, setErr] = useState<boolean>(false);
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

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file as Blob);

      uploadTask.on(
        "state_changed",
        null,
        () => {
          setErr(true);
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
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            name="displayName"
            placeholder="display name"
          />
          <input required type="email" name="email" placeholder="email" />
          <input
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
          <label htmlFor="file">
            <UserCircleIcon className="h-6 w-6" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
