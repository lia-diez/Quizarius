import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Request, UseGuards } from '@nestjs/common';
import { CreateGroupDto } from './dto/group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { GroupService } from './group.service';
import { Group, GroupUser, JoinRequest } from './types/group';

@ApiTags('group')
@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @ApiBearerAuth()
    @Post('create')
    public async createGroup(
        @Request() req,
        @Body() dto: CreateGroupDto
    ): Promise<Group> {
        return await this.groupService.createGroup(req.user.id, dto.name, dto.description) as Group;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Student)
    @ApiBearerAuth()
    @Post('join/:id')
    public async joinGroup(
        @Param('id', new ParseUUIDPipe()) groupId: string,
        @Request() req
    ): Promise<JoinRequest> {
        return this.groupService.createJoinRequest(req.user.id, groupId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @ApiBearerAuth()
    @Get(':id/requests')
    public async showRequests(
        @Param('id', new ParseUUIDPipe()) groupId: string,
        @Request() req
    ): Promise<JoinRequest[]> {
        return this.groupService.getJoinRequests(req.user.id, groupId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @ApiBearerAuth()
    @Post('requests/accept/:id')
    public async acceptRequest(
        @Param('id', new ParseUUIDPipe()) requestId: string,
        @Request() req
    ): Promise<{ id: string }> {
        return this.groupService.acceptJoinRequest(req.user.id, requestId);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    @ApiBearerAuth()
    @Post('requests/reject/:id')
    public async rejectRequest(
        @Param('id', new ParseUUIDPipe()) requestId: string,
        @Request() req
    ): Promise<{ id: string }> {
        return this.groupService.rejectJoinRequest(req.user.id, requestId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get(':id/members')
    public async getMembers(
        @Param('id', new ParseUUIDPipe()) groupId: string,
        @Request() req
    ): Promise<GroupUser[]> {
        return await this.groupService.getMembers(req.user.id, groupId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    public async getGroup(
        @Param('id', new ParseUUIDPipe()) groupId: string
    ): Promise<Group> {
        return await this.groupService.getGroupById(groupId);
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get()
    public async getGroups(
        @Request() req
    ): Promise<Group[]> {
        return await this.groupService.getGroupsByUser(req.user);
    }
}
