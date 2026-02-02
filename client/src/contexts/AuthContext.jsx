import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                try {
                    const response = await authService.getMe();
                    if (response.success && response.data?.user) {
                        setUser(response.data.user);
                        setIsAuthenticated(true);
                    } else {
                        // Invalid token, clear storage
                        logout();
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    logout();
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        const response = await authService.login({ email, password });

        if (response.success && response.data) {
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        }

        return { success: false, message: response.message };
    }, []);

    const register = useCallback(async (name, email, password) => {
        const response = await authService.register({ name, email, password });

        if (response.success && response.data) {
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(newToken);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true, user: userData };
        }

        return { success: false, message: response.message };
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
