import { Vehicle, Booking, BookingWithVehicle, AuditLog, VehicleAvailability } from '@/types';

// Vehicles Database
export const VEHICLES: Vehicle[] = [
  {
    id: 'V001',
    vehicleNumber: 'MH 12 AB 1234',
    title: 'BMW 320i - Premium Sedan',
    description: 'Luxury sedan perfect for business trips and special occasions. Features leather seats, premium sound system, and advanced safety features.',
    make: 'BMW',
    model: '320i',
    year: 2023,
    category: 'luxury',
    imageUrl: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg',
    location: 'Mumbai, Maharashtra',
    features: ['Leather Seats', 'Navigation', 'Bluetooth', 'Premium Audio', 'AC', 'Power Steering'],
    hourlyRate: 800,
    dailyRate: 5500,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z'
  },
  {
    id: 'V002',
    vehicleNumber: 'DL 01 CD 5678',
    title: 'Toyota Innova Crysta - Family SUV',
    description: 'Spacious 7-seater SUV perfect for family trips and group travel. Comfortable seating and excellent safety features.',
    make: 'Toyota',
    model: 'Innova Crysta',
    year: 2022,
    category: 'suv',
    imageUrl: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    location: 'Delhi, NCR',
    features: ['7 Seater', 'AC', 'Power Steering', 'Music System', 'Safety Features'],
    hourlyRate: 600,
    dailyRate: 4200,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-14T15:20:00Z',
    lastModified: '2024-01-14T16:45:00Z'
  },
  {
    id: 'V003',
    vehicleNumber: 'KA 03 EF 9012',
    title: 'Honda City - Compact Sedan',
    description: 'Fuel-efficient compact sedan ideal for city driving and short trips. Modern features and comfortable interior.',
    make: 'Honda',
    model: 'City',
    year: 2023,
    category: 'compact',
    imageUrl: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
    location: 'Bangalore, Karnataka',
    features: ['Fuel Efficient', 'AC', 'Power Steering', 'Music System', 'Airbags'],
    hourlyRate: 400,
    dailyRate: 2800,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-13T09:15:00Z',
    lastModified: '2024-01-13T11:30:00Z'
  },
  {
    id: 'V004',
    vehicleNumber: 'TN 09 GH 3456',
    title: 'Royal Enfield Classic 350',
    description: 'Classic motorcycle perfect for weekend rides and short trips. Iconic design with modern reliability.',
    make: 'Royal Enfield',
    model: 'Classic 350',
    year: 2023,
    category: 'bike',
    imageUrl: 'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg',
    location: 'Chennai, Tamil Nadu',
    features: ['Classic Design', 'Electric Start', 'LED Lights', 'Digital Console'],
    hourlyRate: 150,
    dailyRate: 800,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-12T14:45:00Z',
    lastModified: '2024-01-12T16:20:00Z'
  },
  {
    id: 'V005',
    vehicleNumber: 'GJ 01 IJ 7890',
    title: 'Maruti Swift - Economy Hatchback',
    description: 'Economical and reliable hatchback perfect for city commuting. Great fuel efficiency and easy handling.',
    make: 'Maruti Suzuki',
    model: 'Swift',
    year: 2022,
    category: 'economy',
    imageUrl: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg',
    location: 'Ahmedabad, Gujarat',
    features: ['Fuel Efficient', 'AC', 'Power Steering', 'Central Locking'],
    hourlyRate: 300,
    dailyRate: 2000,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-11T11:00:00Z',
    lastModified: '2024-01-11T11:00:00Z'
  },
  {
    id: 'V006',
    vehicleNumber: 'UP 32 KL 2468',
    title: 'Tata Nexon - Compact SUV',
    description: 'Modern compact SUV with excellent safety ratings. Perfect balance of style, comfort, and performance.',
    make: 'Tata',
    model: 'Nexon',
    year: 2023,
    category: 'suv',
    imageUrl: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg',
    location: 'Lucknow, Uttar Pradesh',
    features: ['5 Star Safety', 'Touchscreen', 'AC', 'Power Windows', 'ABS'],
    hourlyRate: 450,
    dailyRate: 3200,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-16T08:45:00Z',
    lastModified: '2024-01-16T08:45:00Z'
  },
  {
    id: 'V007',
    vehicleNumber: 'MH 14 XY 9876',
    title: 'Hyundai Creta - Premium SUV',
    description: 'Feature-rich compact SUV with modern amenities and excellent build quality.',
    make: 'Hyundai',
    model: 'Creta',
    year: 2023,
    category: 'suv',
    imageUrl: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg',
    location: 'Pune, Maharashtra',
    features: ['Sunroof', 'Touchscreen', 'AC', 'Cruise Control', 'Safety Features'],
    hourlyRate: 500,
    dailyRate: 3500,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-17T12:00:00Z',
    lastModified: '2024-01-17T12:00:00Z'
  },
  {
    id: 'V008',
    vehicleNumber: 'KL 07 AB 5432',
    title: 'Mahindra Scorpio - Rugged SUV',
    description: 'Powerful SUV perfect for long trips and rough terrain. Spacious and reliable.',
    make: 'Mahindra',
    model: 'Scorpio',
    year: 2022,
    category: 'suv',
    imageUrl: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    location: 'Kochi, Kerala',
    features: ['4WD', '7 Seater', 'AC', 'Power Steering', 'High Ground Clearance'],
    hourlyRate: 550,
    dailyRate: 3800,
    status: 'active',
    isAvailable: true,
    createdAt: '2024-01-18T09:30:00Z',
    lastModified: '2024-01-18T09:30:00Z'
  }
];

// Bookings Database
export const BOOKINGS: Booking[] = [
  {
    id: 'B001',
    vehicleId: 'V001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    customerAddress: '123 MG Road, Bandra West, Mumbai, Maharashtra 400050',
    bookingType: 'hourly',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    startTime: '10:00',
    endTime: '18:00',
    totalCost: 6400, // 8 hours * 800
    status: 'pending',
    createdAt: '2024-01-20T14:30:00Z',
    lastModified: '2024-01-20T14:30:00Z'
  },
  {
    id: 'B002',
    vehicleId: 'V002',
    customerName: 'Priya Patel',
    customerPhone: '+91 9876543211',
    customerAddress: '456 Connaught Place, New Delhi 110001',
    bookingType: 'daily',
    startDate: '2024-01-28',
    endDate: '2024-01-30',
    startTime: '09:00',
    endTime: '21:00',
    totalCost: 12600, // 3 days * 4200
    status: 'pending',
    createdAt: '2024-01-21T11:15:00Z',
    lastModified: '2024-01-21T11:15:00Z'
  },
  {
    id: 'B003',
    vehicleId: 'V004',
    customerName: 'Amit Kumar',
    customerPhone: '+91 9876543212',
    customerAddress: '789 Brigade Road, Bangalore, Karnataka 560025',
    bookingType: 'hourly',
    startDate: '2024-01-26',
    endDate: '2024-01-26',
    startTime: '14:00',
    endTime: '20:00',
    totalCost: 900, // 6 hours * 150
    status: 'confirmed',
    createdAt: '2024-01-22T09:30:00Z',
    lastModified: '2024-01-22T10:45:00Z'
  },
  {
    id: 'B004',
    vehicleId: 'V003',
    customerName: 'Sneha Reddy',
    customerPhone: '+91 9876543213',
    customerAddress: '321 Koramangala 4th Block, Bangalore, Karnataka 560034',
    bookingType: 'daily',
    startDate: '2024-01-29',
    endDate: '2024-01-31',
    startTime: '08:00',
    endTime: '20:00',
    totalCost: 8400, // 3 days * 2800
    status: 'pending',
    createdAt: '2024-01-23T16:45:00Z',
    lastModified: '2024-01-23T16:45:00Z'
  },
  {
    id: 'B005',
    vehicleId: 'V005',
    customerName: 'Vikram Singh',
    customerPhone: '+91 9876543214',
    customerAddress: '654 Satellite Road, Ahmedabad, Gujarat 380015',
    bookingType: 'hourly',
    startDate: '2024-01-27',
    endDate: '2024-01-27',
    startTime: '12:00',
    endTime: '18:00',
    totalCost: 1800, // 6 hours * 300
    status: 'pending',
    createdAt: '2024-01-24T10:20:00Z',
    lastModified: '2024-01-24T10:20:00Z'
  },
  {
    id: 'B006',
    vehicleId: 'V006',
    customerName: 'Anita Gupta',
    customerPhone: '+91 9876543215',
    customerAddress: '987 Hazratganj, Lucknow, Uttar Pradesh 226001',
    bookingType: 'daily',
    startDate: '2024-02-01',
    endDate: '2024-02-02',
    startTime: '10:00',
    endTime: '19:00',
    totalCost: 6400, // 2 days * 3200
    status: 'pending',
    createdAt: '2024-01-25T13:15:00Z',
    lastModified: '2024-01-25T13:15:00Z'
  },
  {
    id: 'B007',
    vehicleId: 'V001',
    customerName: 'Rajesh Khanna',
    customerPhone: '+91 9876543216',
    customerAddress: '111 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    bookingType: 'daily',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    startTime: '09:00',
    endTime: '21:00',
    totalCost: 16500, // 3 days * 5500
    status: 'confirmed',
    createdAt: '2024-01-26T15:30:00Z',
    lastModified: '2024-01-26T16:00:00Z'
  },
  {
    id: 'B008',
    vehicleId: 'V007',
    customerName: 'Deepika Sharma',
    customerPhone: '+91 9876543217',
    customerAddress: '222 FC Road, Pune, Maharashtra 411005',
    bookingType: 'hourly',
    startDate: '2024-01-30',
    endDate: '2024-01-30',
    startTime: '11:00',
    endTime: '17:00',
    totalCost: 3000, // 6 hours * 500
    status: 'pending',
    createdAt: '2024-01-27T12:45:00Z',
    lastModified: '2024-01-27T12:45:00Z'
  }
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    entityType: 'booking',
    entityId: 'B003',
    action: 'approve',
    adminId: '1',
    adminName: 'John Admin',
    timestamp: '2024-01-22T10:45:00Z',
    details: 'Confirmed booking B003 for Amit Kumar - Royal Enfield Classic 350'
  },
  {
    id: '2',
    entityType: 'booking',
    entityId: 'B007',
    action: 'approve',
    adminId: '2',
    adminName: 'Sarah Manager',
    timestamp: '2024-01-26T16:00:00Z',
    details: 'Confirmed booking B007 for Rajesh Khanna - BMW 320i'
  },
  {
    id: '3',
    entityType: 'booking',
    entityId: 'B001',
    action: 'create',
    adminId: '1',
    adminName: 'John Admin',
    timestamp: '2024-01-20T14:30:00Z',
    details: 'Created booking B001 for Rahul Sharma - BMW 320i'
  }
];

// In-memory storage
let vehicles: Vehicle[] = [];
let bookings: Booking[] = [];
let auditLogs: AuditLog[] = [];

// Initialize data only once
function initializeData() {
  if (vehicles.length === 0) {
    vehicles = [...VEHICLES];
  }
  if (bookings.length === 0) {
    bookings = [...BOOKINGS];
  }
  if (auditLogs.length === 0) {
    auditLogs = [...AUDIT_LOGS];
  }
}

// Call initialization
initializeData();

// Vehicle functions
export function getVehicleById(id: string): Vehicle | undefined {
  initializeData();
  return vehicles.find(vehicle => vehicle.id === id);
}

export function getAllVehicles(): Vehicle[] {
  initializeData();
  return vehicles.filter(vehicle => vehicle.status === 'active');
}

// Booking functions
export function getBookings(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) {
  initializeData();
  let filteredBookings = [...bookings];

  if (status && status !== 'all') {
    filteredBookings = filteredBookings.filter(booking => booking.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredBookings = filteredBookings.filter(booking => {
      const vehicle = getVehicleById(booking.vehicleId);
      return (
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.customerPhone.includes(search) ||
        booking.id.toLowerCase().includes(searchLower) ||
        (vehicle && vehicle.vehicleNumber.toLowerCase().includes(searchLower))
      );
    });
  }

  // Sort by creation date (newest first)
  filteredBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Add vehicle details to bookings
  const bookingsWithVehicles: BookingWithVehicle[] = paginatedBookings.map(booking => {
    const vehicle = getVehicleById(booking.vehicleId);
    return {
      ...booking,
      vehicle: vehicle!
    };
  });

  return {
    bookings: bookingsWithVehicles,
    total: filteredBookings.length,
    totalPages: Math.ceil(filteredBookings.length / limit),
    currentPage: page
  };
}

export function getBookingById(id: string): BookingWithVehicle | undefined {
  initializeData();
  const booking = bookings.find(booking => booking.id === id);
  if (!booking) return undefined;

  const vehicle = getVehicleById(booking.vehicleId);
  if (!vehicle) return undefined;

  return {
    ...booking,
    vehicle
  };
}

export function updateBooking(
  id: string,
  updates: Partial<Booking>,
  adminId: string,
  adminName: string
): boolean {
  initializeData();
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  if (bookingIndex === -1) return false;

  const previousData = { ...bookings[bookingIndex] };
  
  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    ...updates,
    lastModified: new Date().toISOString()
  };

  // Add audit log
  const auditLog: AuditLog = {
    id: Date.now().toString(),
    entityType: 'booking',
    entityId: id, // This is the booking ID
    action: 'edit',
    adminId,
    adminName,
    timestamp: new Date().toISOString(),
    details: `Updated booking for ${bookings[bookingIndex].customerName} - Vehicle: ${getVehicleById(bookings[bookingIndex].vehicleId)?.vehicleNumber || 'Unknown'}`,
    previousData,
    newData: updates
  };
  
  auditLogs.unshift(auditLog);
  
  // Force data to persist by creating new references
  bookings = [...bookings];
  auditLogs = [...auditLogs];
  return true;
}

export function updateBookingStatus(
  id: string,
  status: 'confirmed' | 'cancelled',
  adminId: string,
  adminName: string
): boolean {
  initializeData();
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  if (bookingIndex === -1) return false;

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status,
    lastModified: new Date().toISOString()
  };

  // Add audit log
  const auditLog: AuditLog = {
    id: Date.now().toString(),
    entityType: 'booking',
    entityId: id, // This is the booking ID
    action: status === 'confirmed' ? 'approve' : 'reject',
    adminId,
    adminName,
    timestamp: new Date().toISOString(),
    details: `${status === 'confirmed' ? 'Confirmed' : 'Cancelled'} booking for ${bookings[bookingIndex].customerName} - Vehicle: ${getVehicleById(bookings[bookingIndex].vehicleId)?.vehicleNumber || 'Unknown'}`
  };
  
  auditLogs.unshift(auditLog);
  
  // Force data to persist by creating new references
  bookings = [...bookings];
  auditLogs = [...auditLogs];
  return true;
}

// Vehicle availability functions
export function checkVehicleAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): VehicleAvailability {
  const vehicle = getVehicleById(vehicleId);
  
  if (!vehicle || vehicle.status !== 'active' || !vehicle.isAvailable) {
    return {
      vehicleId,
      isAvailable: false
    };
  }

  // Check for conflicting bookings
  const conflictingBookings = bookings.filter(booking => 
    booking.vehicleId === vehicleId && 
    booking.status !== 'cancelled' &&
    booking.id !== excludeBookingId && // Exclude current booking when editing
    isDateTimeOverlap(
      booking.startDate, booking.endDate, booking.startTime, booking.endTime,
      startDate, endDate, startTime, endTime
    )
  );

  if (conflictingBookings.length === 0) {
    return {
      vehicleId,
      isAvailable: true
    };
  }

  // Find next available slot
  const futureBookings = bookings.filter(booking => 
    booking.vehicleId === vehicleId && 
    booking.status !== 'cancelled' &&
    new Date(`${booking.endDate}T${booking.endTime}`) > new Date()
  ).sort((a, b) => 
    new Date(`${a.startDate}T${a.startTime}`).getTime() - 
    new Date(`${b.startDate}T${b.startTime}`).getTime()
  );

  let nextAvailableDate: string | undefined;
  let nextAvailableTime: string | undefined;

  if (futureBookings.length > 0) {
    const lastBooking = futureBookings[futureBookings.length - 1];
    const nextAvailableDateTime = new Date(`${lastBooking.endDate}T${lastBooking.endTime}`);
    nextAvailableDate = nextAvailableDateTime.toISOString().split('T')[0];
    nextAvailableTime = nextAvailableDateTime.toTimeString().slice(0, 5);
  }

  return {
    vehicleId,
    isAvailable: false,
    conflictingBookings,
    nextAvailableDate,
    nextAvailableTime
  };
}

export function getAvailableVehicles(
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Vehicle[] {
  initializeData();
  return vehicles.filter(vehicle => {
    if (vehicle.status !== 'active' || !vehicle.isAvailable) {
      return false;
    }

    const availability = checkVehicleAvailability(
      vehicle.id,
      startDate,
      endDate,
      startTime,
      endTime,
      excludeBookingId
    );

    return availability.isAvailable;
  });
}

function isDateTimeOverlap(
  start1: string, end1: string, startTime1: string, endTime1: string,
  start2: string, end2: string, startTime2: string, endTime2: string
): boolean {
  const datetime1Start = new Date(`${start1}T${startTime1}`);
  const datetime1End = new Date(`${end1}T${endTime1}`);
  const datetime2Start = new Date(`${start2}T${startTime2}`);
  const datetime2End = new Date(`${end2}T${endTime2}`);

  return datetime1Start < datetime2End && datetime2Start < datetime1End;
}

// Pricing calculation
export function calculateBookingCost(
  vehicleId: string,
  bookingType: 'hourly' | 'daily',
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string
): number {
  const vehicle = getVehicleById(vehicleId);
  if (!vehicle) return 0;

  if (bookingType === 'daily') {
    // Create datetime objects with actual start and end times
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    // Calculate the difference in milliseconds
    const diffTime = endDateTime.getTime() - startDateTime.getTime();
    
    // Convert to hours and then to days (24 hours = 1 day)
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);
    
    // Ensure minimum 1 day
    const finalDays = Math.max(diffDays, 1);
    
    return finalDays * vehicle.dailyRate;
  } else {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const hours = Math.ceil((endTotalMinutes - startTotalMinutes) / 60);
    return hours * vehicle.hourlyRate;
  }
}

// Audit logs
export function getAuditLogs(
  page: number = 1,
  limit: number = 20,
  action?: string,
  admin?: string,
  search?: string
) {
  initializeData();
  let filteredLogs = [...auditLogs];

  if (action && action !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }

  if (admin && admin !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.adminName === admin);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredLogs = filteredLogs.filter(log =>
      log.entityId.toLowerCase().includes(searchLower) ||
      log.adminName.toLowerCase().includes(searchLower) ||
      log.details.toLowerCase().includes(searchLower)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  return {
    logs: paginatedLogs,
    total: filteredLogs.length,
    totalPages: Math.ceil(filteredLogs.length / limit),
    currentPage: page
  };
}

// Legacy functions for backward compatibility
export function getListings(page: number = 1, limit: number = 10, status?: string, search?: string) {
  const result = getBookings(page, limit, status, search);
  return {
    listings: result.bookings.map(booking => ({
      ...booking.vehicle,
      price: booking.vehicle.dailyRate,
      status: booking.status as any,
      submittedAt: booking.createdAt,
      submittedBy: booking.createdBy
    })),
    total: result.total,
    totalPages: result.totalPages,
    currentPage: result.currentPage
  };
}

export function getListingById(id: string) {
  const booking = getBookingById(id);
  if (!booking) return undefined;
  
  return {
    ...booking.vehicle,
    price: booking.vehicle.dailyRate,
    status: booking.status as any,
    submittedAt: booking.createdAt,
    submittedBy: booking.createdBy
  };
}

export function updateListingStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminId: string,
  adminName: string
): boolean {
  return updateBookingStatus(id, status === 'approved' ? 'confirmed' : 'cancelled', adminId, adminName);
}

export function updateListing(
  id: string,
  updates: any,
  adminId: string,
  adminName: string
): boolean {
  return updateBooking(id, updates, adminId, adminName);
}