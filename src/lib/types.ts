export type UserRole = 'BUYER' | 'BUILDER' | 'INSPECTOR';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    token: string;
}

export interface Property {
    id: string;
    address: string;
    owner: string;
    ownerId: string;
    riskScore: number; // 0-100
    imageUrl: string;
    description: string;
    technicalDetails?: {
        foundation: string;
        roof: string;
        electrical: string;
        plumbing: string;
    };
}

export interface Inspection {
    id: string;
    propertyId: string;
    inspectorId: string;
    date: string;
    summary: string;
    status: 'PENDING' | 'COMPLETED';
    riskScore?: number;
    images: string[];
}
