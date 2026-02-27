import React, { useState, useRef } from "react";
import bgImage from "../../assets/scenes-highland-and-river-landscape-background.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupUser } from "../../redux/slices/AuthSlice";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    contactNumber: "",
    bio: "",
    avatar: null,
  });

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (formData.name.length < 2 || formData.name.length > 100)
      newErrors.name = "Name must be 2–100 characters.";
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(formData.username))
      newErrors.username =
        "Username must be 3–50 letters, numbers, or underscores.";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!["USER", "NGO", "GOVERNMENT"].includes(formData.role))
      newErrors.role = "Invalid role.";
    if (!/^[+\-\s()0-9]{10,20}$/.test(formData.contactNumber))
      newErrors.contactNumber =
        "Contact number must be 10–20 valid characters.";
    if (formData.bio.length > 500)
      newErrors.bio = "Bio must be 500 characters or less.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await dispatch(signupUser(data)).unwrap();
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-saturate-50" />
      <div className="pointer-events-none absolute -top-10 -left-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative z-10 w-full max-w-md px-5 sm:px-6 md:px-0">
        <div className="rounded-[28px] p-[1.5px] bg-gradient-to-b from-gray-700/70 to-gray-700/20 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="rounded-[26px] bg-gray-800/80 backdrop-blur-xl border border-gray-700/60 px-8 sm:px-10 py-10">
            <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-3 text-white">
              Create your ImpactLog account
            </h1>
            <br />
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />
              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <SelectField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={["USER", "NGO", "GOVERNMENT"]}
                error={errors.role}
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                error={errors.contactNumber}
              />
              <TextareaField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                error={errors.bio}
              />
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Avatar
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full p-2 border border-gray-700/70 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-white"
                >
                  Choose File
                </button>
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Sign Up"}
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

// Helper for input fields
const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-400">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-700/70 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-purple-400 text-white placeholder:text-gray-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, error }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-400">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-700/70 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-purple-400 text-white"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-900 text-white">
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-400">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className="w-full p-2 border border-gray-700/70 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-purple-400 text-white placeholder:text-gray-500"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default SignupForm;
