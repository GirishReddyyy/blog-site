import { useForm } from 'react-hook-form'
import { useAuth } from '../store/authStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'


function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const login = useAuth((state) => state.login)
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const currentUser = useAuth((state) => state.currentUser)
    const loading = useAuth((state) => state.loading)
    const error = useAuth((state) => state.error)
    const navigate = useNavigate()

    // console.log("Is Authenticated :", isAuthenticated)   
    // console.log("Current user", currentCredObj)

    const onUserLogin = async (userCredObj) => {
        console.log("Logging in with:", userCredObj)
        await login(userCredObj)
    }

    useEffect(() => {
        if (isAuthenticated) {
            toast.success("Logged in successfully")
            if (currentUser?.role === 'USER') {
                navigate("/user-profile")
                return
            }
            if (currentUser?.role === 'AUTHOR') {
                navigate("/author-profile")
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
        <div>
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <h1 className='text-2xl text-center font-bold'>Login</h1>
                
                {/* Display error message if any */}
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                
                <form onSubmit={handleSubmit(onUserLogin)} className='p-10 rounded-lg max-w-lg shadow-lg'>
                    {/* email */}
                    <input type="email" placeholder='enter your email'
                        {...register("email", { required: "email is required(so that we can spam you! jk)" })}
                        className='border rounded w-full mt-5 p-2'
                    />
                    {
                        errors.email && (<p className='text-red-500'>{errors.email.message}</p>)
                    }
                    {/* password */}
                    <input type="password" placeholder='enter your password'
                        {...register("password", { required: "password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                        className='border rounded w-full mt-5 p-2'
                    />
                    {
                        errors.password && (<p className='text-red-500'>{errors.password.message}</p>)
                    }
                    {/* submit button */}
                    <div className='flex justify-center'>
                        <button disabled={loading} className='bg-blue-400 text-white rounded mt-5 px-7 py-2 disabled:opacity-50'>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login