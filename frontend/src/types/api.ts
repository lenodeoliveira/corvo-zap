export type User = {
  id: string;
  name: string;
  email: string;
  cityId?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cityId: string;
};

export type TrackingStatus = 'TRAVELING' | 'DELIVERED';

export type MessageTracking = {
  status: TrackingStatus;
  progress: number;
  distanceKm: number;
  remainingMinutes: number;
  arrivalAt: string;
  deliveredAt?: string;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  canRead: boolean;
  departureAt: string;
  originCityId: string;
  destinationCityId: string;
  travelTimeMinutes: number;
  tracking: MessageTracking;
  content?: string;
};

export type Chat = {
  id: string;
  userOneId: string;
  userTwoId: string;
  messages?: Message[];
};

export type City = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type UserProfile = User & {
  city: City | null;
};
