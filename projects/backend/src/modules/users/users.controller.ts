import { Controller, Get, Patch, Param, Body, ParseIntPipe , Post } from '@nestjs/common'; // <-- Add Patch, Param, Body, ParseIntPipe
import { UserService } from './users.service';
import { UpdateUserDto } from './users.dto'; // <-- Import the DTO

@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService ){}

    @Patch(':id')
    update( @Param('id',ParseIntPipe) id : number , @Body() updateuserdto : UpdateUserDto){
        return this.userService.update(id, updateuserdto);
    }

    @Get()
    Getall(){
        return this.userService.findAll();
    }
}