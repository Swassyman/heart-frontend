export type UserRole = 'BUYER' | 'BUILDER' | 'INSPECTOR';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    token: string;
}

export interface InspectionFinding {
    id: string;
    inspectionId: string;
    roomId: string; // e.g., 'Master Bedroom', 'Basement'
    observationText: string;
    imageRef?: string;
    defectType: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
}

export interface RootCause {
    roomId: string; // The affected systems string
    defectType: string;
    rootCause: string;
    confidence: number;
    supportingSignals: string; // Changed to string to match usage
    reasoning?: string; // Added field
    recommendations?: string[]; // Added field
}

export interface FutureEvent {
    eventName: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    roomId: string;
    probability?: string; // e.g., "High", "Likely"
    timeframe?: string; // Added field
    preventiveMeasures?: string[]; // Added field
}

export interface Alert {
    id: string;
    level: 'ROOM' | 'PROPERTY' | 'REGION';
    entityId: string;
    riskScore: number;
    type: string;
    message: string;
    createdAt: string;
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
    // Detailed Data (loaded for detail view)
    findings?: InspectionFinding[];
    rootCauses?: RootCause[];
    futureEvents?: FutureEvent[];
    alerts?: Alert[];
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
