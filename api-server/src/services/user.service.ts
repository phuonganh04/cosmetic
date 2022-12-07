import { BindingScope, injectable } from '@loopback/core';
import { repository } from '@loopback/repository';
import { RoleRepository, UserRepository } from '../repositories';
import { SystemFileUtils } from "../common/system-utils";
import { genSalt, hash } from "bcryptjs";
import { HttpErrors } from "@loopback/rest";
import _ from "lodash";
import { User } from "../models";

const ObjectId = require('mongodb').ObjectId
@injectable({ scope: BindingScope.TRANSIENT })
export class UserService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) { }

  async reSyncAdminAccount() {
    const adminAccount = await SystemFileUtils.getConfigs("admin-account.json");

    const password = await hash(adminAccount.password, await genSalt());
    const user = await this.userRepository.findOne({
      where: {
        email: adminAccount.email
      }
    })
    if (user) return;

    const savedUser = await this.userRepository.create(
      _.omit(adminAccount, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({ password });
    const adminRole = await this.roleRepository.findOne({ where: { code: "ADMIN" } })
    if (!adminRole) throw Error('Could not found role');
    await this.userRepository.updateById(savedUser.id, {
      type: User.TYPE.ADMIN,
      roleIds: [new ObjectId(adminRole.id)],
      name: "ADMIN"
    })
  }
}
