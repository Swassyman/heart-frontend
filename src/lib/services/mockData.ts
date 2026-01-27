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
        }
    },
    {
        id: 'p2',
        address: '456 Oak Street, Downtown',
        owner: 'Bob Builder', // Owned by builder for reno?
        ownerId: 'u2',
        riskScore: 85, // High risk
        imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
        description: 'Historic property requiring significant structural work.',
        technicalDetails: {
            foundation: 'Brick, signs of settling',
            roof: 'Slate, original (needs repair)',
            electrical: 'Knob and tube active',
            plumbing: 'Galvanized, corrosion present'
        }
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
        }
    }
];

const MOCK_INSPECTIONS: Inspection[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockService = {
    getProperties: async (role: UserRole): Promise<Property[]> => {
        await delay(500);
        // Logic to filter properties based on role if needed.
        // For now, return all for Builders/Inspectors, filtered for Buyers.
        // Using a simple logic: Buyers only see theirs (mocked as 'Alice Buyer' owning p1, p3).
        // Builders see everything (as example).

        if (role === 'BUYER') {
            return MOCK_PROPERTIES.filter(p => p.owner === 'Alice Buyer');
        }
        // Builders and Inspectors see all
        return MOCK_PROPERTIES;
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
