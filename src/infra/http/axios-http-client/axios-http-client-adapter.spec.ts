
import { AxiosHttpClientAdapter } from './axios-http-client-adapter'
import { mockPostRequest } from '@/data/test'
import { mockAxios } from '@/infra/test'
import axios from 'axios'
jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClientAdapter
  mockedAxios: jest.Mocked<typeof axios>
}

// essa factory por mais que seja simples, vai permitir com que a gente possa alterar alguma dependencia da instancia do AxiosHttpClient sem mudar todos os testes
const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClientAdapter()
  const mockedAxios = mockAxios()

  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpClientAdapter', () => {
  test('Should call axios with correct values', async () => {
    const { sut, mockedAxios } = makeSut()
    const request = mockPostRequest()
    await sut.post(request)
    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })

  test('Should return the correct statusCode and body', () => {
    const request = mockPostRequest()
    const { sut, mockedAxios } = makeSut()
    const promise = sut.post(request)
    // Na linha de baixo, estou pegando o valor do mockedAxios, em results o 0 é o resolved e em 1 é o rejected
    expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
