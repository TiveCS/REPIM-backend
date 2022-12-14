import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Body() dto: CreateProjectDto,
    @GetUser('id') ownerId: number,
  ) {
    return this.projectsService.createProject(dto, ownerId);
  }

  @Delete('/:id')
  async deleteProjectById(
    @Param('id', ParseIntPipe) projectId: number,
    @GetUser('id') ownerId: number,
  ) {
    return this.projectsService.deleteProjectById(projectId, ownerId);
  }

  @Get()
  async getProjectsByOwnerId(@GetUser('id') ownerId: number) {
    return this.projectsService.getProjectsByOwnerId(ownerId);
  }

  @Post('/:id/requests')
  async createProjectRequest(
    @Body() dto: CreateProjectRequestDto,
    @Param('id', ParseIntPipe) projectId: number,
    @GetUser('id') ownerId: number,
  ) {
    return this.projectsService.createProjectRequest(dto, projectId, ownerId);
  }
}
