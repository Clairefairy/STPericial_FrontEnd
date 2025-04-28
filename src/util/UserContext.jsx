import { createContext, useEffect, useState } from "react"
import { login } from "./service"
import toast from "react-hot-toast"

export const AuthContext = createContext({})

export function AuthProvider({ children }) {


    const [usuario, setUsuario] = useState(() => {
        const usuarioSalvo = localStorage.getItem("usuario")
        return usuarioSalvo
            ? JSON.parse(usuarioSalvo)
            : {
                user: {
                    id: "",
                    name: "",
                    email: "",
                    role: "deslogado"
                },
                token: ""
            }
    })

    useEffect(() => {
        localStorage.setItem("usuario", JSON.stringify(usuario))
    }, [usuario])

    async function handleLogin(userLogin) {
        try {
            await login(`/users/login`, userLogin, setUsuario)
            toast.success("Usuario logado!")
            return true
        } catch (error) {
            console.error("Erro no login:", error)
            toast.error("Erro no login")
            return false
        }
        
    }

    function handleLogout() {
        setUsuario({
            user: {
                id: "",
                name: "",
                email: "",
                role: "deslogado"
            },
            token: ""
        })
        localStorage.removeItem("usuario")
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
