import { create } from 'zustand'
import axios from 'axios'

export const useAuth = create((set) => ({
    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,
    login: async (userCreditWithRole) => {
        const { role, ...userCredObj } = userCreditWithRole
        try {
            //set loading true
            console.log("Login attempt with:", userCredObj)
            set({ loading: true, error: null })
            //make api call
            let res = await axios.post("http://localhost:4000/common-api/login", userCredObj, { withCredentials: true })
            console.log("Login response:", res)
            //update state
            set({
                loading: false,
                isAuthenticated: true,
                currentUser: res.data.payload
            })
        } catch (err) {
            console.log("Login error:", err)
            console.log("Error response:", err.response?.data)
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err.response?.data?.message || err.response?.data?.error || err.message || "Login failed",
            })
        }
    },
    logout: async () => {
        try {
            //set loading state
            set({ loading: true, error: null })
            //make logout api req
            await axios.get("http://localhost:4000/common-api/logout", { withCredentials: true })
            //update state
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,

            })
        } catch (err) {
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null,
                error: err.response?.data?.error || "Logout failed"
            })
        }
    },
    checkAuth: async()=>{
        try {
            //set loading true
            set({ loading: true })
            //make api call
            let res = await axios.get("http://localhost:4000/common-api/check-auth", { withCredentials: true })
            //update state
            set({
                loading: false,
                isAuthenticated: true,
                currentUser: res.data.payload
            })
        } catch (err) {
            console.log("Auth check error:", err)
            console.log("Error response:", err.response?.data)
            set({
                loading: false,
                isAuthenticated: false,
                currentUser: null
            })
        }
    }
}))