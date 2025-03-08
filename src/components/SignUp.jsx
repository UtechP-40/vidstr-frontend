import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/features/user.slice";

const Signup = ({ onClose, showSignIn }) => {
  const dispatch = useDispatch();
  const { isRegistring: loading, error } = useSelector((state) => state.user);

  const handleSignInClick = () => {
    onClose(); // Close signup
    showSignIn(); // Show signin
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatar) {
      alert("Avatar is required!");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      const response = await dispatch(signup(form));
      if (response.payload) {
        // Call success callback if provided
        onClose?.(); // Close the popup
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground rounded-full p-1 hover:bg-accent transition-colors"
      >
        ✕
      </button>
        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-destructive text-center mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
            required
          />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
            required
          />
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-input text-foreground"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="text-center my-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-sm">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        <button
          className="w-full bg-secondary text-secondary-foreground py-2 rounded-md mb-4"
          onClick={() => window.open("/api/auth/google", "_self")}
        >
          Continue with Google
        </button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button 
            onClick={handleSignInClick}
            className="text-primary hover:text-primary/90 font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
