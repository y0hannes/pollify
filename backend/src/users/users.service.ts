import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getAll() {
    return {
      msg: 'all the users will be returned',
    };
  }

  getOne(id: string) {
    return {
      msg: `Only a single user with id ${id} will be returned`,
    };
  }
}
