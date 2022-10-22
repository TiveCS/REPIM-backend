import { CreateProjectRequestDto } from './dto/create-project-request.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/users/decorator/user.decorator';

@UseGuards(JwtAuthGuard)
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
