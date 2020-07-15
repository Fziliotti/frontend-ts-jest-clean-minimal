export class ServerError extends Error {
  constructor () {
    super('Algum erro aconteceu no servidor da aplicação.')
    this.name = 'ServerError'
  }
}
