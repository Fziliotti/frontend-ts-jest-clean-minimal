import { AccountModel } from '@/domain/models'
import { AuthenticationParams } from '@/domain/usecases'
import { HttpPostClientSpy } from '@/data/test'
import { mockAuthentication, mockAccountModel } from '@/domain/test'
import { RemoteAuthentication } from './remote-authentication'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { HttpStatusCode } from '@/data/protocols/http'
import faker from 'faker'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url(), body: object = {}): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  // systemUnderTest its the sut of other projects
  const systemUnderTest = new RemoteAuthentication(url, body, httpPostClientSpy)

  return {
    sut: systemUnderTest,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with corret URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpClient with corret body', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const authenticationParams = mockAuthentication()
    await sut.auth(
      authenticationParams
    )
    expect(httpPostClientSpy.body).toEqual(authenticationParams) // Comparar valores dos objetos
  })

  test('Should throw InvalidCredentialsError if HttpPostClient return 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw ServerError if HttpPostClient return 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw NotFoundError if HttpPostClient return 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFoundError
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const httpResult = mockAccountModel()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await sut.auth(mockAuthentication())
    await expect(account).toEqual(httpResult)
  })
})
