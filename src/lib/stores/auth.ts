import { writable } from 'svelte/store';
import type { User, UserRole } from '$lib/types';
import { browser } from '$app/environment';

const STORE_KEY = 'heart_user_token';

// Initial state from localStorage if available
const savedToken = browser ? localStorage.getItem(STORE_KEY) : null;
let initialUser: User | null = null;

if (savedToken) {
    try {
        initialUser = JSON.parse(atob(savedToken));
    } catch (e) {
        console.error('Failed to parse token', e);
        if (browser) localStorage.removeItem(STORE_KEY);
    }
}

export const authStore = writable<User | null>(initialUser);

export const login = (role: UserRole, name: string) => {
    // Mock token creation: Base64 encode the user object
    const user: User = {
        id: crypto.randomUUID(),
        name,
        role,
        token: ''
    };
    user.token = btoa(JSON.stringify(user));

    if (browser) {
        localStorage.setItem(STORE_KEY, user.token);
    }
    authStore.set(user);
};

export const logout = () => {
    if (browser) {
        localStorage.removeItem(STORE_KEY);
    }
    authStore.set(null);
};
