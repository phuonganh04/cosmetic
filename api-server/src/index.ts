import {ApplicationConfig, ApiServerApplication} from './application';

export * from './application';

let APPLICATION: any = null;

export const getApplication = () => {
  return APPLICATION;
}

export async function main(options?: ApplicationConfig) {
  const applicationOptions = options ?? {}
  applicationOptions.rest = applicationOptions.rest || {}
  applicationOptions.rest.basePath = '/api/v1';
  applicationOptions.rest.port = process.env.API_PORT || 3000;
  APPLICATION = new ApiServerApplication(applicationOptions);

  await APPLICATION.boot();
  await APPLICATION.start();

  const url = APPLICATION.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return APPLICATION;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
