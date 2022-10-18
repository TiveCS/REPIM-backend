import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(dto: CreateProjectDto, ownerId: number) {
    const project = await this.prisma.project.create({
      data: {
        ...dto,
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return project;
  }

  async deleteProjectById(projectId: number, ownerId: number) {
    await this.verifyProjectOwner(projectId, ownerId);

    const project = await this.prisma.project.delete({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return project;
  }

  async getProjectsByOwnerId(ownerId: number) {
    const projects = await this.prisma.project.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return projects;
  }

  async verifyProjectOwner(projectId: number, ownerId: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        ownerId: true,
      },
    });

    if (!project) throw new NotFoundException('Project not found');

    if (project.ownerId !== ownerId)
      throw new ForbiddenException('You are not the owner of this project');
  }
}
