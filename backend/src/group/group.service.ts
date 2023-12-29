import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Group, GroupUser, JoinRequest } from './types/group';

@Injectable()
export class GroupService {
    constructor(private readonly prismaService: PrismaService) { }

    public async createGroup(ownerId: string, name: string, description?: string): Promise<Group> {
        let group = await this.prismaService.group.create({
            data: {
                id: randomUUID(),
                name: name,
                ownerId: ownerId,
                description: description
            }
        });

        return group as Group;
    }

    public async getGroupById(groupId: string): Promise<Group> {
        let group = await this.verifyGroupById(groupId);
        return group as Group;
    }

    public async getGroupUserById(userId: string): Promise<GroupUser> {
        let user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });

        return {
            id: user.id,
            login: user.login,
            role: user.role
        } as GroupUser;
    }

    public async getMembers(userId: string, groupId: string): Promise<GroupUser[]> {
        await this.verifyGroupAndMember(userId, groupId);

        let members = await this.prismaService.groupUser.findMany({
            where: {
                groupId: groupId
            }
        });

        let users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: members.map(member => member.userId)
                }
            }
        });

        return users.map(user => {
            return {
                id: user.id,
                login: user.login,
                role: user.role
            } as GroupUser;
        });
    }

    public async createJoinRequest(userId: string, groupId: string): Promise<JoinRequest> {
        // check if there is already a request from this user to this group
        const request = await this.prismaService.joinRequest.findFirst({
            where: {
                userId: userId,
                groupId: groupId
            }
        });

        if (request) {
            throw new BadRequestException('Request already exists');
        }

        return await this.prismaService.joinRequest.create({
            data: {
                id: randomUUID(),
                userId: userId,
                groupId: groupId
            }
        }) as JoinRequest;
    }

    public async getJoinRequests(userId: string, groupId: string): Promise<JoinRequest[]> {
        await this.verifyGroupAndOwner(userId, groupId);

        let requests = await this.prismaService.joinRequest.findMany({
            where: {
                groupId: groupId
            }
        }) as JoinRequest[];

        let users = await this.prismaService.user.findMany({
            where: {
                id: {
                    in: requests.map(request => request.userId)
                }
            }
        });

        requests.forEach(request => {
            request.userLogin = users.find(user => user.id === request.userId).login;
        });

        return requests;
    }

    public async acceptJoinRequest(userId: string, requestId: string): Promise<{ id: string }> {
        let request = await this.getJoinRequest(requestId);
        await this.verifyGroupAndOwner(userId, request.groupId);

        await this.prismaService.groupUser.create({
            data: {
                id: randomUUID(),
                groupId: request.groupId,
                userId: request.userId
            }
        });

        await this.prismaService.joinRequest.delete({
            where: {
                id: requestId
            }
        });

        return { id: request.userId };
    }

    public async rejectJoinRequest(userId: string, requestId: string): Promise<{ id: string }> {
        let request = await this.getJoinRequest(requestId);
        await this.verifyGroupAndOwner(userId, request.groupId);

        await this.prismaService.joinRequest.delete({
            where: {
                id: requestId
            }
        });

        return { id: request.userId };
    }

    public async getGroupsByUser(user: GroupUser): Promise<Group[]> {
        if (user.role === 'teacher') {
            let groups = await this.prismaService.group.findMany({
                where: {
                    ownerId: user.id
                }
            }) as Group[];
            groups.forEach(group => group.ownerLogin = user.login);
            return groups;
        } else {
            let groupIds = await this.prismaService.groupUser.findMany({
                where: {
                    userId: user.id
                }
            });

            let groups = await this.prismaService.group.findMany({
                where: {
                    id: {
                        in: groupIds.map(group => group.groupId)
                    }
                }
            }) as Group[];

            let ownerLogins = await this.prismaService.user.findMany({
                where: {
                    id: {
                        in: groups.map(group => group.ownerId)
                    }
                }
            });

            groups.forEach(group => {
                group.ownerLogin = ownerLogins.find(user => user.id === group.ownerId).login;
            });

            return groups;
        }
    }

    private async getJoinRequest(requestId: string): Promise<JoinRequest> {
        let request = await this.prismaService.joinRequest.findUnique({
            where: {
                id: requestId
            }
        });

        if (!request) {
            throw new BadRequestException('Request not found');
        }

        return request as JoinRequest;
    }

    private async verifyGroupById(groupId: string): Promise<Group> {
        let group = await this.prismaService.group.findUnique({
            where: {
                id: groupId
            }
        }) as Group;

        if (!group) {
            throw new BadRequestException('Group not found');
        }

        group.ownerLogin = (await this.prismaService.user.findUnique({
            where: {
                id: group.ownerId
            }
        })).login;

        return group as Group;
    }

    public async verifyGroupAndOwner(userId: string, groupId: string) {
        let group = await this.verifyGroupById(groupId);

        if (group.ownerId !== userId) {
            throw new UnauthorizedException('You are not the owner of this group');
        }
    }

    public async verifyGroupAndMember(userId: string, groupId: string) {
        let group = await this.verifyGroupById(groupId);

        let groupUser = await this.prismaService.groupUser.findFirst({
            where: {
                groupId: groupId,
                userId: userId
            }
        });

        if (!groupUser && group.ownerId !== userId) {
            throw new UnauthorizedException('You are not allowed to see this group');
        }
    }
}

