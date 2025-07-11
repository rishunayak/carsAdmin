import fs from 'fs';
import path from 'path';
import { Vehicle, Booking, AuditLog, BookingWithVehicle } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File paths
const VEHICLES_FILE = path.join(DATA_DIR, 'vehicles.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'audit-logs.json');

// Generic file operations
function readJsonFile<T>(filePath: string, defaultValue: T[] = []): T[] {
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filePath, defaultValue);
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

// Vehicle operations
export function getAllVehicles(): Vehicle[] {
  return readJsonFile<Vehicle>(VEHICLES_FILE);
}

export function getVehicleById(id: string): Vehicle | undefined {
  const vehicles = getAllVehicles();
  return vehicles.find(vehicle => vehicle.id === id);
}

export function updateVehicle(id: string, updates: Partial<Vehicle>): boolean {
  const vehicles = getAllVehicles();
  const index = vehicles.findIndex(vehicle => vehicle.id === id);
  
  if (index === -1) return false;
  
  vehicles[index] = {
    ...vehicles[index],
    ...updates,
    lastModified: new Date().toISOString()
  };
  
  writeJsonFile(VEHICLES_FILE, vehicles);
  return true;
}

export function createVehicle(vehicle: Vehicle): boolean {
  const vehicles = getAllVehicles();
  vehicles.push(vehicle);
  writeJsonFile(VEHICLES_FILE, vehicles);
  return true;
}

// Booking operations
export function getAllBookings(): Booking[] {
  return readJsonFile<Booking>(BOOKINGS_FILE);
}

export function getBookingById(id: string): BookingWithVehicle | undefined {
  const bookings = getAllBookings();
  const booking = bookings.find(booking => booking.id === id);
  
  if (!booking) return undefined;
  
  const vehicle = getVehicleById(booking.vehicleId);
  if (!vehicle) return undefined;
  
  return {
    ...booking,
    vehicle
  };
}

export function updateBooking(id: string, updates: Partial<Booking>): boolean {
  const bookings = getAllBookings();
  const index = bookings.findIndex(booking => booking.id === id);
  
  if (index === -1) return false;
  
  bookings[index] = {
    ...bookings[index],
    ...updates,
    lastModified: new Date().toISOString()
  };
  
  writeJsonFile(BOOKINGS_FILE, bookings);
  return true;
}

export function createBooking(booking: Booking): boolean {
  const bookings = getAllBookings();
  bookings.push(booking);
  writeJsonFile(BOOKINGS_FILE, bookings);
  return true;
}

export function deleteBooking(id: string): boolean {
  const bookings = getAllBookings();
  const filteredBookings = bookings.filter(booking => booking.id !== id);
  
  if (filteredBookings.length === bookings.length) return false;
  
  writeJsonFile(BOOKINGS_FILE, filteredBookings);
  return true;
}

// Audit log operations
export function getAllAuditLogs(): AuditLog[] {
  return readJsonFile<AuditLog>(AUDIT_LOGS_FILE);
}

export function createAuditLog(auditLog: AuditLog): boolean {
  const logs = getAllAuditLogs();
  logs.unshift(auditLog); // Add to beginning for newest first
  writeJsonFile(AUDIT_LOGS_FILE, logs);
  return true;
}

// Helper functions for filtering and pagination
export function getFilteredBookings(
  page: number = 1,
  limit: number = 10,
  status?: string,
  search?: string
) {
  let bookings = getAllBookings();

  // Apply status filter
  if (status && status !== 'all') {
    bookings = bookings.filter(booking => booking.status === status);
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    bookings = bookings.filter(booking => {
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
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookings = bookings.slice(startIndex, endIndex);

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
    total: bookings.length,
    totalPages: Math.ceil(bookings.length / limit),
    currentPage: page
  };
}

export function getFilteredAuditLogs(
  page: number = 1,
  limit: number = 20,
  action?: string,
  admin?: string,
  search?: string
) {
  let logs = getAllAuditLogs();

  // Apply action filter
  if (action && action !== 'all') {
    logs = logs.filter(log => log.action === action);
  }

  // Apply admin filter
  if (admin && admin !== 'all') {
    logs = logs.filter(log => log.adminName === admin);
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    logs = logs.filter(log =>
      log.entityId.toLowerCase().includes(searchLower) ||
      log.adminName.toLowerCase().includes(searchLower) ||
      log.details.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLogs = logs.slice(startIndex, endIndex);

  return {
    logs: paginatedLogs,
    total: logs.length,
    totalPages: Math.ceil(logs.length / limit),
    currentPage: page
  };
}

// Vehicle availability functions
export function checkVehicleAvailability(
  vehicleId: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
) {
  const vehicle = getVehicleById(vehicleId);
  
  if (!vehicle || vehicle.status !== 'active' || !vehicle.isAvailable) {
    return {
      vehicleId,
      isAvailable: false
    };
  }

  const bookings = getAllBookings();
  
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
  const vehicles = getAllVehicles();
  
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
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    const diffTime = endDateTime.getTime() - startDateTime.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);
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