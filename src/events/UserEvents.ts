/* eslint-disable spaced-comment */
import { UserDTO } from '../models/User'
import sendgridClient from '../lib/sendgridClient'

export const onUserCreate = async (user: UserDTO, token: string): Promise<void> => {
  const activationLink = `${process.env.WEBSITE_URL}/create-password/${token}`
  await sendgridClient.send({
    to: {
      email: user.email,
      name: `${user.firstname} ${user.lastname}`
    },
    from: 'francisca.brinckfeldt.fernandez@ciisa.cl',
    subject: 'Hemos creado una cuenta con tu email en AppGolf',
    text: `Activa tu cuenta ingresando a ${activationLink}`,
    html: /*html*/`
      <html>
        <div>
          <h3>Bienvenid@ a AppGolf</h3>
          <p>Para activar tu cuenta ingresa al <a href="${activationLink}">siguiente link</a></p>
        </div>
      </html>
    `
  })
}
