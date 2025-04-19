import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { PostGroupRequestDto } from './group.request.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroupByName(@Query('name') name: string) {
    return this.groupService.getGroupByName(name);
  }

  @Get('/all')
  async getAllGroups() {
    return this.groupService.getAllGroups();
  }

  @Post()
  async createGroup(@Body(ValidationPipe) group: PostGroupRequestDto) {
    return this.groupService.createGroup(group);
  }
}
