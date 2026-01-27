import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface AuthUser {
    id: string;
    name: string;
    role: string;
}

const STORE_KEY = 'heart_auth_user';

// Initial state from localStorage if available
let initialUser: AuthUser | null = null;

if (browser) {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
        try {
            initialUser = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to restore auth session', e);
            localStorage.removeItem(STORE_KEY);
        }
    }
}

export const authStore = writable<AuthUser | null>(initialUser);

export const login = (user: AuthUser) => {
    if (browser) {
        localStorage.setItem(STORE_KEY, JSON.stringify(user));
    }
    authStore.set(user);
};

export const logout = () => {
    if (browser) {
        localStorage.removeItem(STORE_KEY);
    }
    authStore.set(null);
};
