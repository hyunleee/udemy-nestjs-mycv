import { NotFoundException, BadRequestException, Injectable } from "@nestjs/common";
import {UsersService} from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; //crypto 모듈은 Node.js의 내장 모듈로, 암호화와 관련된 다양한 기능을 제공 -> scrypt 함수는 비밀번호를 해싱하는데 사용
import { promisify } from "util"; //promisify 함수는 콜백 패턴을 프로미스 패턴으로 변환

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        //See if email is in use
        const users = await this.usersService.find(email);
        if (users.length)   {
            throw new BadRequestException('email in use');
        }

        //Hash the users password
        //Generate a salt
        const salt = randomBytes(8).toString('hex'); //randomBytes(8)은 8바이트의 랜덤 바이트를 생성(raw data -> 0 or 1), toString('hex')는 16진수로 변환

        //Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer; //Buffer 는 타입스크립트가 잘 알아들을 수 있도록 도와주는 역할

        //Join the hashed password and the salt together -> 이 결과를 데이터 베이스에 저장
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and save it
        const user = await this.usersService.create(email, result);

        //Return the user
        return user;
    }
    
    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        //salt와 hash를 분리
        const [salt, storedhash] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedhash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}