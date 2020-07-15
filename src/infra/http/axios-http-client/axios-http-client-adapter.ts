import { HttpPostClient } from '@/data/protocols/http'
import { HttpResponse } from '@/data/protocols/http/http-response'
import { HttpPostParams } from '@/data/protocols/http/http-post-client'
import axios from 'axios'

/*
Essa classe é um Adapter, porque vamos adaptar duas interfaces diferentes, que é o HttpPostClient com o Axios com o axios. Se quisermos tirar o axios fica tranquilo.

Se quisessemos trocar o axios pelo fetch, bastaria reimplementar essa classe aqui e os métodos dela

Durante o desenvolvimento, poderiamos ter implementado tambem a parte do header da requisição http, mas vamos seguir o YAGNI, que basicamente orienta para que devs não adicionem funcionalidades ao código fonte de um programa até que estas sejam realmente necessárias

*/

export class AxiosHttpClientAdapter implements HttpPostClient<any, any> {
  async post (params: HttpPostParams<any>): Promise<HttpResponse<any>> {
    const httpResponse = await axios.post(params.url, params.body)
    return {
      statusCode: httpResponse.status,
      body: httpResponse.data
    }
  }
}
