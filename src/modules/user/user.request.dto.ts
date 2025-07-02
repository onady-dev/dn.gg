export class CreateUserDto {
  email: string;
  password: string;
  phoneNumber: string;
  groupName: string;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  phoneNumber?: string;
  groupId?: number;
} 