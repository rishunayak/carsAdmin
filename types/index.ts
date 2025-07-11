export interface Vehicle {
  id: string;
  vehicleNumber: string; // Indian vehicle number format
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  category: 'economy' | 'compact' | 'luxury' | 'suv' | 'sports' | 'bike' | 'auto';
  imageUrl: string;
  location: string;
  features: string[];
  
  // Pricing
  hourlyRate: number;
  dailyRate: number;
  
  // Status
  status: 'active';
  isAvailable: boolean;
  
  // Metadata
  createdAt: string;
  lastModified: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  
  // Customer Information
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  
  // Booking Details
  bookingType: 'hourly' | 'daily';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  
  // Pricing
  totalCost: number;
  
  // Status and Admin
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' ;
  createdAt: string;
  lastModified: string;
}

export interface BookingWithVehicle extends Booking {
  vehicle: Vehicle;
}

export interface VehicleAvailability {
  vehicleId: string;
  isAvailable: boolean;
  conflictingBookings?: Booking[];
  nextAvailableDate?: string;
  nextAvailableTime?: string;
}

export interface AuditLog {
  id: string;
  entityType: 'vehicle' | 'booking';
  entityId: string;
  action: 'approve' | 'reject' | 'edit' | 'create' | 'book';
  adminId: string;
  adminName: string;
  timestamp: string;
  details: string;
  previousData?: any;
  newData?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Legacy interface for backward compatibility
export interface Listing {
  id: string;
  vehicleNumber: string; // Indian vehicle number format
  title: string;
  description: string;
  make: string;
  model: string;
  year: number;
  category: 'economy' | 'compact' | 'luxury' | 'suv' | 'sports' | 'bike' | 'auto';
  imageUrl: string;
  location: string;
  features: string[];
  
  // Pricing
  hourlyRate: number;
  dailyRate: number;
  isAvailable: boolean;
  
  // Metadata
  createdAt: string;
  lastModified: string;
  price: number; // Maps to dailyRate for backward compatibility
  status: "pending" | "confirmed" | "cancelled"
}