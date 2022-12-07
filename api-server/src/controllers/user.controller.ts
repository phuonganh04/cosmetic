import { authenticate, TokenService } from '@loopback/authentication';
import {
  Credentials, RefreshTokenService, RefreshTokenServiceBindings, TokenObject, TokenServiceBindings, User, UserRepository
} from '@loopback/authentication-jwt';
import { inject, service } from '@loopback/core';
import { Count, CountSchema, Filter, FilterExcludingWhere, repository, Where } from '@loopback/repository';
import { del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody, response } from '@loopback/rest';
import { SecurityBindings, UserProfile } from '@loopback/security';
import { genSalt, hash } from 'bcryptjs';
import _ from 'lodash';
import { getApplication } from '..';
import { CredentialsRequestBody, NewUserRequest, RefreshGrant, RefreshGrantRequestBody } from '../common/types';
import {Request, RestBindings} from '@loopback/rest';
import { RoleRepository } from '../repositories';

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(SecurityBindings.USER, { optional: true })
    public user: UserProfile,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(RoleRepository) public roleRepository: RoleRepository,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    public refreshService: RefreshTokenService,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    public expiresIn: string,
    @inject(RestBindings.Http.REQUEST) 
    private request: Request
  ) { }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    // ensure the user exists, and the password is correct
    const APPLICATION = await getApplication();

    const authenticationUserService = await APPLICATION.get('services.AuthenticationUserService')
    const user = await authenticationUserService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = await authenticationUserService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    // create refresh token and expiresIn
    const refreshToken = await this.refreshService.generateToken(userProfile, token);

    return {
      expiresIn: this.expiresIn,
      ...refreshToken,
    };
  }

  @authenticate('jwt')
  @get('/me', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<User> {
    return this.userRepository.findById(currentUserProfile.id);
  }

  @authenticate('jwt')
  @get('/me-with-roles', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmIWithRoleCode(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<any> {
    const user = await this.userRepository.findById(currentUserProfile.id);
    const roleIds = user.roleIds;
    const roles = await this.roleRepository.find({
      where: {
        id: {
          inq: roleIds
        }
      },
      fields: ['id', 'code']
    })
    return {
      ...user,
      roles,
    }
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const user = await this.userRepository.findOne({
      where: {
        email: newUserRequest.email
      }
    })
    if (user) {
      throw new HttpErrors[409]('Email đã có trong hệ thống')
    }

    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({ password });

    return savedUser;
  }

  @post('/refresh', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async refresh(
    @requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
  ): Promise<TokenObject> {
    return this.refreshService.refreshToken(refreshGrant.refreshToken);
  }

  @authenticate('jwt')
  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {},
        },
      },
    })
    newUserRequest: Omit<User, 'id'>,
  ): Promise<User> {
    const password = await hash('123123123', await genSalt());
    const user = await this.userRepository.findOne({
      where: {
        email: newUserRequest.email
      }
    })
    if (user) {
      throw new HttpErrors[409]('Email đã có trong hệ thống')
    }

    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({ password });
    await this.userRepository.updateById(savedUser.id, newUserRequest)
    return this.userRepository.findById(savedUser.id)
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, { exclude: 'where' }) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @authenticate("jwt")
  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    try {
      await this.userRepository.updateById(id, user);
    } catch(error) {
      if(error.code === 11000) {
        const keyValue = error.keyValue;
        const keysDuplicate = Object.keys(keyValue);
        throw new HttpErrors.Conflict(`${keysDuplicate.join(", ")} duplicate`);
      }
    }
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/create_payment_url')
  @response(200, {
    description: 'payment',
    content: { 'application/json': { schema: getModelSchemaRef(User) } },
  })
  async createPayment(
    @requestBody({
      content: {
        'application/json': {
          schema: {},
        },
      },
    })
    postData: {
      amount: number,
      bankCode: string,
      orderInfo: string,
    },
  ): Promise<string> {
    let vnp_Params: any = {};
    const tmnCode = "67IWMU36"
    const secretKey = "CBNAETHXCIRSMLDXSVAHTPWHMJHMSHAB"
    const returnUrl = "http://localhost:8080/cart"
    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    const request: any = this.request;

    var ipAddr = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    
    const date = new Date();
    const dateFormat = require('dateformat');

    const currCode = 'VND';
    const orderId = dateFormat(date, 'HHmmss');
    const createDate = dateFormat(date, 'yyyymmddHHmmss');

    const {
      amount,
      bankCode,
      orderInfo,
    } = postData;

    function sortObject(obj: any) {
      var sorted: any = {};
      var str = [];
      var key;
      for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
      }
      str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = "Thanh toán hóa đơn Tiệm bí ngô";
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    if(bankCode !== null && bankCode !== ''){
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require("crypto");     
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }
}
