import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException, Session} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/\buser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto) // 아무거나 넣어도 오류가 나지 않음 -> 이 데코레이터를 사용할 때 클래스만 전달해야하는 요구사항 추가
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {}

    // 쿠키 세션 미들웨어 추가 예시
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }

    @Get('/whoami')
    whoAmI(@Session() session: any) {
        return this.usersService.findOne(session.userId);
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;

    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) { //id는 데이터베이스에서 숫자로 저장되지만, URL에서는 문자열로 전달됨
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
