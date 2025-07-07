import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('usuario')) || '');
    const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');
    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    // Método para login: guarda usuario y token en sessionStorage y actualiza el contexto
    const login = (userData, tokenData) => {
        sessionStorage.setItem('usuario', JSON.stringify(userData));
        sessionStorage.setItem('token', tokenData);
        setUser(userData);
        setToken(tokenData);
        navigate('/'); // Redirige al home
    };

    // Método para logout: limpia sessionStorage y contexto
    const logout = () => {
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('token');
        setUser('');
        setToken('');
        navigate('/auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}