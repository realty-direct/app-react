import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, supabase } from "../lib/supabase";
import { useRealtyStore } from "../store/store";

export default function Signin() {
  const navigate = useNavigate();
  const { setSession } = useRealtyStore(); // Zustand session state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      console.log(user);

      if (user) {
        // ✅ Fetch the user profile from the `profiles` table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single(); // Ensure we get a single record

        if (profileError) {
          setError("Failed to load user profile");
          setLoading(false);
          return;
        }

        // ✅ Store the full user info in Zustand
        setSession({
          id: user.id,
          fname: profile?.first_name || "", // ✅ Now fetched from `profiles` table
          lname: profile?.last_name || "", // ✅ Now fetched from `profiles` table
          email: user.email ?? "",
        });

        navigate("/"); // ✅ Redirect after login
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white w-full">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="text-sm">
              <a
                href="/forgot-password"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm 
                hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
