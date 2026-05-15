import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  divider,
  loadingClass,
} from "../styles/common";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router";

function Register() {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onUserRegister = async (newUser) => {
    setLoading(true);

    // Create form data object
    const formData = new FormData();
    //get user object
    let { role, profileImageUrl, ...userObj } = newUser;
    console.log("role", role);
    console.log("profileImageUrl", profileImageUrl);
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    if (profileImageUrl && profileImageUrl.length > 0) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }
    try {
      if (role === "user") {
        //make API req to user-api
        let resObj = await axios.post(`${API_BASE_URL}/user-api/users`, formData);
        if (resObj.status === 201) {
          //navigate to login
          navigate("/login");
        }
      } else if (role === "author") {
        //make API req to author-api
        //make API req to user-api
        let resObj = await axios.post(`${API_BASE_URL}/author-api/users`, formData);
        console.log("res obj is ", resObj);
        if (resObj.status === 201) {
          //navigate to login
          navigate("/login");
        }
      } else {
        setError("Please select a role to register");
      }
    } catch (err) {
      // console.log("err is ", err);
      let errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0];
        if (firstError?.message) {
            errorMsg = firstError.message;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  //cleanup(remove preview image from browser memory)
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  //loading
  if (loading === true) {
    return <p className={loadingClass}></p>;
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Create an Account</h2>
        {/* error message */}
        {error && <p className={errorClass}>{error}</p>}
        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* Role Selection */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  id="user"
                  value="user"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  {...register("role")}
                  id="author"
                  value="author"
                  className="accent-violet-600 w-4 h-4"
                />
                <span className="text-sm text-stone-700 font-medium">Author</span>
              </label>
            </div>
          </div>

          <div className={divider} />

          {/* First & Last Name — side by side */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input type="text" {...register("firstName")} placeholder="First name" className={inputClass} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input type="text" {...register("lastName")} placeholder="Last name" className={inputClass} />
            </div>
          </div>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input type="email" {...register("email")} placeholder="you@example.com" className={inputClass} />
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Min. 8 characters"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Profile Image URL */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-[#e8e8ed] border-dashed rounded-xl bg-[#f5f5f7] hover:bg-[#ebebf0] transition-colors relative">
              <div className="space-y-2 text-center flex flex-col items-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-full shadow-sm" />
                ) : (
                  <svg className="mx-auto h-10 w-10 text-[#a1a1a6]" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-[#6e6e73] justify-center mt-2">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-[#0066cc] hover:text-[#005bb5] focus-within:outline-none">
                    <span>{preview ? "Change image" : "Upload a file"}</span>
                    <input
                      id="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/png, image/jpeg"
                      {...register("profileImageUrl")}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (!["image/jpeg", "image/png"].includes(file.type)) {
                            setError("Only JPG or PNG allowed");
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            setError("File size must be less than 2MB");
                            return;
                          }
                          const previewUrl = URL.createObjectURL(file);
                          setPreview(previewUrl);
                          setError(null);
                        }
                      }}
                    />
                  </label>
                  {!preview && <p className="pl-1">or drag and drop</p>}
                </div>
                {!preview && <p className="text-xs text-[#a1a1a6]">PNG, JPG up to 2MB</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className={submitBtn}>
            Create Account
          </button>
        </form>

        {/* Footer note */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-violet-600 hover:text-violet-500 font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;

//res.data
//err.response.

//append(fn,userObj.profileImageUrl)