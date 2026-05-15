import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router'
import toast from 'react-hot-toast'
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
} from '../styles/common'

function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const login = useAuth((state) => state.login)
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const currentUser = useAuth((state) => state.currentUser)
    const loading = useAuth((state) => state.loading)
    const error = useAuth((state) => state.error)
    const navigate = useNavigate()
    
    const [showPassword, setShowPassword] = useState(false)

    const onUserLogin = async (userCredObj) => {
        await login(userCredObj)
    }

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Logged in successfully")
            if (currentUser?.role === 'USER') {
                navigate("/user-dashboard")
                return
            }
            if (currentUser?.role === 'AUTHOR') {
                navigate("/author-dashboard")
                return
            }
            if (currentUser?.role === 'ADMIN') {
                navigate("/admin-dashboard")
                return
            }
            navigate("/")
        }
    }, [isAuthenticated, currentUser])


    return (
        <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
            <div className={formCard}>
                <h2 className={formTitle}>Welcome Back</h2>
                
                {error && <p className={`${errorClass} text-center mb-4`}>{error}</p>}
                
                <form onSubmit={handleSubmit(onUserLogin)}>
                    {/* email */}
                    <div className={formGroup}>
                        <label className={labelClass}>Email</label>
                        <input 
                            type="email" 
                            placeholder='you@example.com'
                            {...register("email", { required: "Email is required" })}
                            className={inputClass}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>

                    {/* password */}
                    <div className={formGroup}>
                        <label className={labelClass}>Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder='Enter your password'
                                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
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
                        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                    </div>

                    {/* submit button */}
                    <button type="submit" disabled={loading} className={submitBtn}>
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer note */}
                <p className={`${mutedText} text-center mt-6`}>
                    Not registered yet?{" "}
                    <NavLink to="/register" className="text-violet-600 hover:text-violet-500 font-medium">
                        Create an account
                    </NavLink>
                </p>
            </div>
        </div>
    )
}

export default Login