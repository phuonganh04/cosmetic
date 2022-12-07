import { AuthenticationComponent } from '@loopback/authentication';
import { JWTAuthenticationComponent, JWTService, RefreshTokenConstants, RefreshTokenServiceBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings } from '@loopback/authentication-jwt';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin, SchemaMigrationOptions } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { CosmeticDataSource } from './datasources/cosmetic.datasource';
import { MySequence } from './sequence';
import { AuthenticationUserService, LocationService, UserService } from './services';
import { RoleService } from "./services/role.service";
import multer from 'multer';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from './keys';

export { ApplicationConfig };

export class ApiServerApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(CosmeticDataSource, UserServiceBindings.DATASOURCE_NAME);

    // ------------- END OF SNIPPET -------------
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to(
      RefreshTokenConstants.REFRESH_EXPIRES_IN_VALUE,
    );
    this.bind(UserServiceBindings.USER_SERVICE).toClass(AuthenticationUserService);
  }

  // @ts-ignore
  async start(): Promise<void> {
    // Use `databaseSeeding` flag to control if products/users should be pre
    // populated into the database. Its value is default to `true`.
    if (this.options.databaseSeeding !== false) {
      await this.migrateSchema();
    }

    await super.start();
  }

  async migrateSchema(options?: SchemaMigrationOptions): Promise<void> {
    await super.migrateSchema(options);
    const locationService: LocationService = await this.get("services.LocationService")
    const userService: UserService = await this.get("services.UserService")
    const roleService: RoleService = await this.get("services.RoleService")

    await locationService.resyncDefaultCountry();
    await roleService.syncRole();
    await userService.reSyncAdminAccount();
  }

  protected configureFileUpload(destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../public/upload');
    console.log(destination)
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
