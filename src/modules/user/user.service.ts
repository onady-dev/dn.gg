import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../entities/User.entity';
import { CreateUserDto, UpdateUserDto } from './user.request.dto';
import { Group } from 'src/entities/Group.entity';
import * as bcrypt from 'bcrypt';
import { encrypt } from './crypto.util';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/repository/user.repository';
import { GroupRepository } from 'src/repository/group.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { groupName, ...userData } = dto;
      const group = this.groupRepository.create({ name: groupName });
      const savedGroup = await this.groupRepository.save(group);
      const {id: groupId} = savedGroup;
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const encryptedPhone = encrypt(dto.phoneNumber);
      const user = this.userRepository.create({...userData, groupId, password: hashedPassword, phoneNumber: encryptedPhone});
      const savedUser = await this.userRepository.save(user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.phoneNumber) {
      updateData.phoneNumber = encrypt(dto.phoneNumber);
    }
    await this.userRepository.update(id, updateData);
    return await this.userRepository.findOneOrFail({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async loginUser(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }
} 