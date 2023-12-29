import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginCredentialsDto, RegisterCredentialsDto } from './dto/post-credentials.dto';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Role } from './roles/roles.enum';
import { Roles } from './roles/roles.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  public async login(@Body() dto: LoginCredentialsDto): Promise<{ token: string }> {
    const token = this.authService.login(dto.login, dto.password);
    return token;
  }

  @Post('signup')
  public async register(@Body() dto: RegisterCredentialsDto): Promise<{ token: string }> {
    const token = this.authService.register(dto.login, dto.password, dto.role);
    return token;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUser(req.user.id);
  }
}
