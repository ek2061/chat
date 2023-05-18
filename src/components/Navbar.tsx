import UserImage from "@/assets/user.png";
import { AuthContext } from "@/context/AuthContext";
import { auth, db, storage } from "@/firebase";
import {
  ArrowRightOnRectangleIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const { currentUser } = useContext(AuthContext);

  const [img, setImg] = useState<File | null>(null); // selected image file

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files?.[0] || null);
  };

  useEffect(() => {
    if (!img) return;
    if (!currentUser?.uid) return;

    const storageRef = ref(storage, `avatar/${currentUser.uid}`);

    const uploadTask = uploadBytesResumable(storageRef, img as Blob);

    uploadTask.on(
      "state_changed",
      null,
      (err) => {
        console.log(err);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateProfile(auth.currentUser!, { photoURL: downloadURL });

        await updateDoc(doc(db, "users", currentUser.uid), {
          photoURL: downloadURL,
        });

        console.log(downloadURL);
      }
    );
  }, [img, currentUser]);

  return (
    <div className="flex h-16 items-center justify-between bg-navbar p-2.5 text-gray-100">
      <span className="text-2xl font-bold">Chat</span>
      <div className="flex gap-2.5">
        <div className="relative">
          <img
            className="h-10 w-10 rounded-full bg-gray-100"
            src={currentUser?.photoURL ?? UserImage}
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
          {currentUser?.displayName}
        </span>
        <button
          className="flex cursor-pointer items-center space-x-2 rounded-md border-none bg-gray-500 text-sm text-gray-100"
          onClick={() => signOut(auth)}
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
          <span className="max-sm:hidden">logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
