import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearForgotPasswordData } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, forgotPassword } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            await dispatch(
                resetPassword({
                    resetToken: forgotPassword?.resetToken,
                    newPassword,
                })
            ).unwrap();

            toast.success("Password reset successful!");
            dispatch(clearForgotPasswordData());
            navigate("/login");
        } catch (error) {
            // ✅ Safe error handling
            const message =
                (error && typeof error === "object" && error.message)
                    ? error.message
                    : String(error);
            toast.error(message || "Something went wrong");
            console.error("Reset password error:", error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-saturate-50" />
            <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative z-10 w-full max-w-md px-5 sm:px-6 md:px-0">
                <div className="rounded-[28px] p-[1.5px] bg-gradient-to-b from-gray-700/70 to-gray-700/20 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                    <div className="rounded-[26px] bg-gray-800/80 backdrop-blur-xl border border-gray-700/60 px-8 sm:px-10 py-10">
                        <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-3 text-white">
                            Reset Password
                        </h1>
                        <br />
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="newPassword" className="text-sm text-gray-400 font-medium">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-700/70 bg-gray-900/80 px-5 py-3 shadow-inner outline-none text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="confirmPassword" className="text-sm text-gray-400 font-medium">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-xl border border-gray-700/70 bg-gray-900/80 px-5 py-3 shadow-inner outline-none text-white placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-3 font-semibold text-white shadow-md hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>

                        <div className="text-center mt-5">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-sm text-purple-400 hover:underline"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
