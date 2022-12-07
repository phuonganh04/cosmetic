export const endpoints = {
  endpointWithApiDomain: (api: string) => {
    return `http://localhost:3000/api/v1${api}`
  }
}
