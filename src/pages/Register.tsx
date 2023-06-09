import { auth, db, storage } from "@/firebase";
import withPageLayout from "@/hoc/withPageLayout";
import { useAppSelector } from "@/hooks/useRedux";
import Preview from "@/modules/Preview";
import { blob2base64 } from "@/utils/image";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { authData } = useAppSelector((state) => state.user);

  const [img, setImg] = useState<File | null>(null); // selected image file
  const [preview, setPreview] = useState<string>(""); // selected image preview
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    if (!img) {
      setPreview("");
      return;
    }

    const uploadPreview = async () => {
      const imageSrc = await blob2base64(img);
      setPreview(imageSrc);
    };

    uploadPreview();
  }, [img]);

  /* redirect to home page if logged in */
  if (authData.currentUser?.emailVerified) {
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
    form.reset();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (img) {
        const storageRef = ref(storage, `avatar/${res.user.uid}`);

        const uploadTask = uploadBytesResumable(storageRef, img as Blob);
        uploadTask.on(
          "state_changed",
          null,
          () => {
            setError("upload failed");
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
          }
        );
      } else {
        await updateProfile(res.user, {
          displayName,
          photoURL: null,
        });

        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: null,
        });
      }

      await sendEmailVerification(auth.currentUser as User);

      // create user will generate auth, so i have to sign out
      await signOut(auth);

      navigate("/login");
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
        <span className="text-lg text-gray-600">{t("signup")}</span>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="text"
            name="displayName"
            placeholder={t("displayName") as string}
          />
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="email"
            name="email"
            placeholder={t("email") as string}
          />
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            required
            type="password"
            name="password"
            placeholder={t("password") as string}
          />
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            id="avatar"
            onChange={(e) => setImg(e.target.files?.[0] || null)}
            onClick={(e) => ((e.target as HTMLInputElement).value = "")}
          />
          <label
            className="flex cursor-pointer items-center gap-2.5 text-sm text-cyan-800"
            htmlFor="avatar"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span>{t("addAvatar")}</span>
          </label>

          {preview && <Preview src={preview} onClose={() => setImg(null)} />}

          <button className="cursor-pointer rounded-md border-none bg-blue-400  p-2.5 font-bold text-white hover:bg-blue-500">
            {t("signup")}
          </button>
          {error && (
            <span className="w-64 text-center text-sm font-semibold text-red-500">
              {error}
            </span>
          )}
        </form>
        <p className="mt-2.5 text-xs text-gray-500">
          {t("haveAccount")} <Link to="/login">{t("login")}</Link>
        </p>
      </div>
    </div>
  );
};

export default withPageLayout(Register);
