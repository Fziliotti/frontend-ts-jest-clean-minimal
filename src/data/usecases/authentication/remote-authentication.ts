import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly body: object,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) {}

  async auth (params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({ url: this.url, body: params })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body
      case HttpStatusCode.unauthorized:
        throw new InvalidCredentialsError()
      // case HttpStatusCode.serverError:
      //   throw new ServerError()
      // case HttpStatusCode.notFoundError:
      //   throw new NotFoundError()
      default:
        throw new UnexpectedError()
    }
  }
}
