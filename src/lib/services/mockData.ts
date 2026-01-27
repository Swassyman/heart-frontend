import type { Property, Inspection, UserRole } from '$lib/types';

const MOCK_PROPERTIES: Property[] = [
    {
        id: 'p1',
        address: '123 Maple Avenue, Springfield',
        owner: 'Alice Buyer',
        ownerId: 'u1',
        riskScore: 15, // Low risk
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
        description: 'Charming suburban home with minimal wear. Recently renovated.',
        technicalDetails: {
            foundation: 'Slab on grade, good condition',
            roof: 'Asphalt shingles, 5 years old',
            electrical: '200A Service, updated 2020',
            plumbing: 'Copper piping throughout'
        },
        findings: [
            {
                id: 'f1',
                inspectionId: 'i1',
                roomId: 'Kitchen',
                observationText: 'Minor cosmetic chip in countertop.',
                defectType: 'Cosmetic',
                severity: 'LOW',
                confidence: 0.95
            }
        ],
        rootCauses: [],
        futureEvents: [],
        alerts: []
    },
    {
        id: 'p2',
        address: '456 Oak Street, Downtown',
        owner: 'Bob Builder',
        ownerId: 'u2',
        riskScore: 85, // High risk
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
        description: 'Historic property requiring significant structural work.',
        technicalDetails: {
            foundation: 'Brick, signs of settling',
            roof: 'Slate, original (needs repair)',
            electrical: 'Knob and tube active',
            plumbing: 'Galvanized, corrosion present'
        },
        findings: [
            {
                id: 'f2',
                inspectionId: 'i2',
                roomId: 'Basement',
                observationText: 'Significant vertical cracking in foundation wall.',
                defectType: 'Structural Crack',
                severity: 'CRITICAL',
                confidence: 0.98
            },
            {
                id: 'f3',
                inspectionId: 'i2',
                roomId: 'Attic',
                observationText: 'Water staining on rafters, signs of active leak.',
                defectType: 'Water Intrusion',
                severity: 'HIGH',
                confidence: 0.92
            },
            {
                id: 'f4',
                inspectionId: 'i2',
                roomId: 'Living Room',
                observationText: 'Ungrounded outlets detected.',
                defectType: 'Electrical Safety',
                severity: 'HIGH',
                confidence: 0.99
            }
        ],
        rootCauses: [
            {
                roomId: 'Basement',
                defectType: 'Structural Crack',
                rootCause: 'Soil Subsidence',
                confidence: 0.85,
                supportingSignals: 3
            },
            {
                roomId: 'Attic',
                defectType: 'Water Intrusion',
                rootCause: 'Flashing Failure',
                confidence: 0.78,
                supportingSignals: 2
            }
        ],
        futureEvents: [
            {
                eventName: 'Foundation Collapse',
                severity: 'CRITICAL',
                roomId: 'Basement',
                probability: 'Likely within 5 years'
            },
            {
                eventName: 'Mold Outbreak',
                severity: 'HIGH',
                roomId: 'Attic',
                probability: 'Imminent if untreated'
            }
        ],
        alerts: [
            {
                id: 'a1',
                level: 'PROPERTY',
                entityId: 'p2',
                riskScore: 0.85,
                type: 'HIGH_RISK',
                message: 'Property risk exceeds threshold (85%)',
                createdAt: new Date().toISOString()
            }
        ]
    },
    {
        id: 'p3',
        address: '789 Pine Lane, Westside',
        owner: 'Alice Buyer',
        ownerId: 'u1',
        riskScore: 45, // Medium risk
        imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80',
        description: 'Modern condo unit. Standard finishes.',
        technicalDetails: {
            foundation: 'Shared concrete structure',
            roof: 'Flat membrane (HOA managed)',
            electrical: '100A Service',
            plumbing: 'PEX'
        },
        findings: [
            {
                id: 'f5',
                inspectionId: 'i3',
                roomId: 'Bathroom',
                observationText: 'Slow drain in shower.',
                defectType: 'Plumbing Clog',
                severity: 'MEDIUM',
                confidence: 0.88
            }
        ],
        rootCauses: [
            {
                roomId: 'Bathroom',
                defectType: 'Plumbing Clog',
                rootCause: 'Pipe Scaling',
                confidence: 0.70,
                supportingSignals: 1
            }
        ],
        futureEvents: [],
        alerts: []
    }
];

const MOCK_INSPECTIONS: Inspection[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockService = {
    getProperties: async (role: UserRole): Promise<Property[]> => {
        await delay(500);
        if (role === 'BUYER') {
            return MOCK_PROPERTIES.filter(p => p.owner === 'Alice Buyer');
        }
        return MOCK_PROPERTIES;
    },

    getPropertyById: async (id: string): Promise<Property | null> => {
        await delay(300);
        return MOCK_PROPERTIES.find(p => p.id === id) || null;
    },

    getRisks: async (propertyId: string) => {
        await delay(300);
        const prop = MOCK_PROPERTIES.find(p => p.id === propertyId);
        return prop ? { score: prop.riskScore, details: prop.technicalDetails } : null;
    },

    submitInspection: async (data: Omit<Inspection, 'id'>) => {
        await delay(1000);
        const newInspection: Inspection = {
            ...data,
            id: crypto.randomUUID(),
        };
        MOCK_INSPECTIONS.push(newInspection);
        return newInspection;
    }
};
