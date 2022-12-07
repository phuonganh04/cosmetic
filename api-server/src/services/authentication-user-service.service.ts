// Copyright h2platform - vntopmas@gmail.com. 2019,2020. All Rights Reserved.
// Node module: h2platform

import { UserService } from '@loopback/authentication';
import { Credentials } from '@loopback/authentication-jwt';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { securityId, UserProfile } from '@loopback/security';
import { User } from '../models';
import { UserRepository } from '../repositories';
import { compare } from 'bcryptjs';

export class AuthenticationUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {
  }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: { email: credentials.email },
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const credentialsFound = await this.userRepository.findCredentials(
      foundUser.id,
    );
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    const userProfile = {
      [securityId]: user.id,
      name: user.name,
      emails: user.email,
      id: user.id,
      orgId: user.orgId,
      type: user.type,
    };

    return userProfile;
  }

  //function to find user by id
  async findUserById(id: string): Promise<User> {
    const userNotfound = 'invalid User';
    const foundUser = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
}
