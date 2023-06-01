import UserImage from "@/assets/user.png";
import { auth, db, storage } from "@/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleSidebar } from "@/store/app.slice";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { signOut, updateProfile, User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { authData } = useAppSelector((state) => state.user);

  const [img, setImg] = useState<File | null>(null); // selected image file

  const { t } = useTranslation();

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files?.[0] || null);
  };

  useEffect(() => {
    if (!img || !authData.currentUser?.uid || !auth.currentUser) return;

    const handleUpload = async () => {
      const storageRef = ref(
        storage,
        `avatar/${authData.currentUser?.uid as string}`
      );

      const uploadTask = uploadBytesResumable(storageRef, img as Blob);

      try {
        await toast.promise(
          new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (err) => {
                console.log(err);
                reject(err);
              },
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                await updateProfile(auth.currentUser as User, {
                  photoURL: downloadURL,
                });
                await updateDoc(
                  doc(db, "users", authData.currentUser?.uid as string),
                  {
                    photoURL: downloadURL,
                  }
                );

                resolve(downloadURL);
              }
            );
          }),
          {
            pending: t("uploadAvatar") ?? "uploading",
            success: t("uploadAvatarSuccess") ?? "success",
            error: t("uploadAvatarError") ?? "error",
          },
          {
            autoClose: 8000,
          }
        );
      } catch (error) {
        console.error("avatar upload error:", error);
      }
    };

    handleUpload();
  }, [img, authData.currentUser, t]);

  return (
    <div className="flex h-16 items-center justify-between bg-navbar p-2.5 text-gray-100">
      <span className="flex items-center space-x-3">
        <Bars3Icon
          className="h-6 w-6 cursor-pointer sm:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
        <p className="select-none text-2xl font-bold">Chat</p>
      </span>
      <div className="flex gap-2.5">
        <div className="relative">
          <img
            className="h-10 w-10 select-none rounded-full bg-gray-100 object-cover"
            src={authData.currentUser?.photoURL ?? UserImage}
            alt="user-avatar"
          />
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-full bg-gray-700 opacity-0 transition-opacity duration-300 hover:opacity-75">
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              className="hidden"
              id="upload-avatar"
              onChange={handleUploadAvatar}
            />
            <label
              htmlFor="upload-avatar"
              className="flex h-full w-full items-center justify-center"
            >
              <CameraIcon className="h-5 w-5" />
            </label>
          </div>
        </div>

        <span className="flex items-center text-lg">
          {authData.currentUser?.displayName}
        </span>
        <button
          className="flex cursor-pointer items-center space-x-2 rounded-md border-none bg-gray-500 text-sm text-gray-100"
          onClick={() => signOut(auth)}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="max-sm:hidden">{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
