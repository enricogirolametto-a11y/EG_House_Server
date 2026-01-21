import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="p-4 shadow-2xl rounded-2xl bg-white">
        <SignIn routing="path" path="/login" />
      </div>
    </div>
  );
}
