import test from 'ava'
import supertest from 'supertest'
import server from '../app'

const app = supertest(server)

test('app.js  login', async t => {
 // Authorization: Basic MTgzODEzMzQ0MDI6cm9vdA==
  const mobile = '18381334402'
  const code = 'root'
  const encoded = new Buffer(`${mobile}:${code}`).toString('base64')
 // console.log('encoded', encoded)
  try {
    let res = await app.post(`/auth/mobile/login`)
                                .set('Authorization', `Basic ${encoded}`)
                                .expect(200)
    console.log('res', res.status)
    t.pass()
   // console.log('res', res)
  } catch (error) {
    console.error('error', error)
    t.fail(error)
  }
})
