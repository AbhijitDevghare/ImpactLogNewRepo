import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/AuthSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginForm = () => {
    const [showPwd, setShowPwd] = useState(false);
    const [identifier, setIdentifier] = useState(""); // email or username
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    useEffect(() => {
        console.log(isLoggedIn)
        if (isLoggedIn) {
            navigate("/app");
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-saturate-50" />
            <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 w-full max-w-md px-5 sm:px-6 md:px-0">
                <div className="rounded-[28px] p-[1.5px] bg-gradient-to-b from-gray-700/70 to-gray-700/20 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                    <div className="rounded-[26px] bg-gray-800/80 backdrop-blur-xl border border-gray-700/60 px-8 sm:px-10 py-10">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-3 text-white">
                            Login
                        </h1>
                        <br />
                        <form
                            className="flex flex-col gap-5"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!identifier || !password) return;
                                const isEmail = /\S+@\S+\.\S+/.test(identifier.trim());
                                const payload = { password: password };
                                if (isEmail) payload.email = identifier.trim();
                                else payload.username = identifier.trim();
                                try {
                                    setSubmitting(true);
                                    console.log(payload)
                                    await dispatch(login(payload));
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {/* Username */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="username" className="text-sm text-gray-400 font-medium">Username or Email</label>
                                <input
                                    id="username"
                                    type="text"
                                    inputMode="text"
                                    autoComplete="username email"
                                    placeholder="yourname@impactlog.com or username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full rounded-xl border border-gray-700/70 bg-gray-900/80 px-5 py-3 shadow-inner outline-none text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                                />
                            </div>

                            {/* Password with visibility toggle */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-sm text-gray-400 font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPwd ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="***************"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-gray-700/70 bg-gray-900/80 px-5 py-3 pr-14 shadow-inner outline-none text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPwd ? "Hide password" : "Show password"}
                                        onClick={() => setShowPwd((v) => !v)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-medium text-gray-400 hover:bg-purple-900/40"
                                    >
                                        {showPwd ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Login button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-1 w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-semibold text-white shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Logging In..." : "Log In"}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3">
                                <hr className="flex-1 border-gray-700/60" />
                                <span className="text-sm text-gray-500">or</span>
                                <hr className="flex-1 border-gray-700/60" />
                            </div>

                            {/* Sign Up button (outlined) */}
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="w-full rounded-xl border-2 border-purple-400/70 py-3 font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors"
                            >
                                Create an Account
                            </button>
                        </form>

                        <div className="text-center mt-5">
                             <Link to={"/forgot-password"}>
                             <div  className="text-sm text-purple-400 hover:underline">Forgot Password?</div>
                            </Link>
                            
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
