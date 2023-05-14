import { auth } from "@/firebase";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      // write firebase auth to local storage
      await setPersistence(auth, browserLocalPersistence);

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-sky-500">
      <div className="px-15 flex w-full max-w-md flex-col items-center gap-2.5 rounded-lg bg-white py-5">
        <span className="text-2xl font-bold text-gray-600">Chat</span>
        <span className="text-lg text-gray-600">Login</span>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            className="w-64 rounded-lg border-2 border-solid border-gray-200 p-2 outline-none placeholder:text-gray-400 focus:border-blue-300"
            type="password"
            name="password"
            placeholder="password"
          />
          <button className="cursor-pointer rounded-md border-none bg-blue-400  p-2.5 font-bold text-white hover:bg-blue-500">
            Sign in
          </button>
          {err && <span>Something went wrong</span>}
        </form>
        <p className="mt-2.5 text-xs text-gray-500">
          You don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
