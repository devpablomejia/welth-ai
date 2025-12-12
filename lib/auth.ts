export interface User {
    id: number;
    username: string;
    password: string;
    createdAt: string;
}

const USERS_KEY = 'welth_users';
const CURRENT_USER_KEY = 'welth_current_user';

export class AuthService {
    private getUsers(): User[] {
        if (typeof window === 'undefined') return [];
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    private saveUsers(users: User[]): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    register(username: string, password: string): { success: boolean; message: string; user?: User } {
        const users = this.getUsers();

        // Check if username already exists
        if (users.some(u => u.username === username)) {
            return { success: false, message: 'El nombre de usuario ya existe' };
        }

        // Validate inputs
        if (username.length < 3) {
            return { success: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
        }

        if (password.length < 6) {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres' };
        }

        // Create new user
        const newUser: User = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username,
            password, // In production, this should be hashed!
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Usuario registrado exitosamente', user: newUser };
    }

    login(username: string, password: string): { success: boolean; message: string; user?: User } {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }

        // Store current user (without password)
        const userWithoutPassword = { ...user, password: '' };
        if (typeof window !== 'undefined') {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        }

        return { success: true, message: 'Inicio de sesión exitoso', user };
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    }

    getCurrentUser(): User | null {
        if (typeof window === 'undefined') return null;
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    getCurrentUserId(): number | null {
        const user = this.getCurrentUser();
        return user ? user.id : null;
    }
}

export const authService = new AuthService();
