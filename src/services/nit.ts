export interface NIT {
    id: string;
    title: string;
    description?: string;
    department?: string;
    tenderNumber?: string;
    publishedDate?: string;
    lastDate?: string;
    value?: string;
    status?: 'active' | 'closed' | 'upcoming';
    category?: string;
    downloadUrl?: string;
    contactInfo?: {
        officer: string;
        phone: string;
        email: string;
    };
    location?: string;
    imageUrl?: string; // Add imageUrl field for API response
    date?: string;     // Add date field for API response
    createdAt: string;
    updatedAt?: string;
}

export interface NITFilters {
    category?: string;
    department?: string;
    status?: 'active' | 'closed' | 'upcoming';
    limit?: number;
    search?: string;
}

// Mock NIT data for development
const mockNITs: NIT[] = [
    {
        id: '1',
        title: 'Construction of Highway Bridge Project',
        description: 'Tender for construction of a new highway bridge connecting the eastern and western districts.',
        department: 'Public Works Department',
        tenderNumber: 'PWD/2024/001',
        publishedDate: '2024-09-25T00:00:00Z',
        lastDate: '2024-10-25T23:59:59Z',
        value: '₹50,00,000',
        status: 'active',
        category: 'Construction',
        downloadUrl: '/tenders/pwd-001.pdf',
        contactInfo: {
            officer: 'Eng. Rajesh Kumar',
            phone: '+91-9876543210',
            email: 'rajesh.kumar@pwd.gov.in'
        },
        location: 'District Headquarters',
        createdAt: '2024-09-25T00:00:00Z',
        updatedAt: '2024-09-25T00:00:00Z'
    },
    {
        id: '2',
        title: 'Supply of Medical Equipment',
        description: 'Procurement of advanced medical equipment for district hospital including MRI machine and CT scanner.',
        department: 'Health Department',
        tenderNumber: 'HD/2024/002',
        publishedDate: '2024-09-20T00:00:00Z',
        lastDate: '2024-10-20T23:59:59Z',
        value: '₹2,50,00,000',
        status: 'active',
        category: 'Medical',
        downloadUrl: '/tenders/hd-002.pdf',
        contactInfo: {
            officer: 'Dr. Priya Sharma',
            phone: '+91-9876543211',
            email: 'priya.sharma@health.gov.in'
        },
        location: 'District Hospital',
        createdAt: '2024-09-20T00:00:00Z',
        updatedAt: '2024-09-20T00:00:00Z'
    },
    {
        id: '3',
        title: 'IT Infrastructure Upgrade',
        description: 'Modernization of IT infrastructure including servers, networking equipment, and software licenses.',
        department: 'IT Department',
        tenderNumber: 'IT/2024/003',
        publishedDate: '2024-09-15T00:00:00Z',
        lastDate: '2024-10-15T23:59:59Z',
        value: '₹75,00,000',
        status: 'active',
        category: 'Technology',
        downloadUrl: '/tenders/it-003.pdf',
        contactInfo: {
            officer: 'Mr. Amit Singh',
            phone: '+91-9876543212',
            email: 'amit.singh@it.gov.in'
        },
        location: 'Government Complex',
        createdAt: '2024-09-15T00:00:00Z',
        updatedAt: '2024-09-15T00:00:00Z'
    },
    {
        id: '4',
        title: 'School Building Renovation',
        description: 'Complete renovation of primary school building including classrooms, laboratories, and playground.',
        department: 'Education Department',
        tenderNumber: 'ED/2024/004',
        publishedDate: '2024-09-10T00:00:00Z',
        lastDate: '2024-10-10T23:59:59Z',
        value: '₹30,00,000',
        status: 'closed',
        category: 'Education',
        downloadUrl: '/tenders/ed-004.pdf',
        contactInfo: {
            officer: 'Mrs. Sunita Devi',
            phone: '+91-9876543213',
            email: 'sunita.devi@education.gov.in'
        },
        location: 'Primary School, Block A',
        createdAt: '2024-09-10T00:00:00Z',
        updatedAt: '2024-09-10T00:00:00Z'
    },
    {
        id: '5',
        title: 'Water Supply System Installation',
        description: 'Installation of new water supply system for rural areas including pipelines and storage tanks.',
        department: 'Water Resources Department',
        tenderNumber: 'WRD/2024/005',
        publishedDate: '2024-10-01T00:00:00Z',
        lastDate: '2024-11-01T23:59:59Z',
        value: '₹1,20,00,000',
        status: 'upcoming',
        category: 'Infrastructure',
        downloadUrl: '/tenders/wrd-005.pdf',
        contactInfo: {
            officer: 'Eng. Mohan Lal',
            phone: '+91-9876543214',
            email: 'mohan.lal@wrd.gov.in'
        },
        location: 'Rural Development Office',
        createdAt: '2024-10-01T00:00:00Z',
        updatedAt: '2024-10-01T00:00:00Z'
    }
];

export { mockNITs };