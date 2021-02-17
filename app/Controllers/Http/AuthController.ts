import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/user'

export default class AuthController {

    public async register({ request, response }: HttpContextContract) {
        const validator = {
            schema: schema.create({
                email: schema.string({}, [
                    rules.required(),
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                password: schema.string({}, [
                    rules.required(),
                    rules.minLength(6)
                ])
            }),
            messages: {
                'email.unique': `email ${request.input('email')} sudah ada yang make`,
                'email.email': 'emailnya yang benar dong!!!',
                'email.required': 'cukup hatiku yang kosong, emailnya jangan',
                'password.minLength': 'passwordnya kurang pajang',
                'password.required': 'cukup hatiku yang kosong, emailnya jangan'
            }
        }

        const validated = await request.validate(validator)
        const newUser = new User()
        newUser.email = validated.email
        newUser.password = validated.password
        newUser.role = 'student'

        await newUser.save()

        return response.created({ message: 'Register Successfully', user: newUser })
    }

    public async register_admin({ request, response }: HttpContextContract) {
        const validator = {
            schema: schema.create({
                email: schema.string({}, [
                    rules.required(),
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                password: schema.string({}, [
                    rules.required(),
                    rules.minLength(6)
                ])
            }),
            messages: {
                'email.required': 'cukup hatiku yang kosong, emailnya jangan',
                'email.unique': `email ${request.input('email')} sudah ada yang make`,
                'email.email': 'emailnya yang benar dong!!!',
                'password.required': 'cukup hatiku yang kosong, emailnya jangan',
                'password.minLength': 'passwordnya kurang pajang'
            }
        }

        const validated = await request.validate(validator)
        const newUser = new User()
        newUser.email = validated.email
        newUser.password = validated.password
        newUser.role = 'admin'

        await newUser.save()

        return response.created({ message: 'Register Admin Successfully', user: newUser })
    }

    public async login({ request, response, auth }: HttpContextContract) {
        const validator = {
            schema: schema.create({
                email: schema.string({}, [
                    rules.required(),
                    rules.email(),
                ]),
                password: schema.string({}, [
                    rules.required(),
                    rules.minLength(6)
                ])
            }),
            messages: {
                'email.required': 'cukup hatiku yang kosong, emailnya jangan',
                'email.email': 'emailnya yang benar dong!!!',
                'password.required': 'cukup hatiku yang kosong, passwordnya jangan',
                'password.minLength': 'passwordnya kurang panjang'
            }
        }

        const validated = await request.validate(validator)
        const token = await auth.use('api').attempt(validated.email, validated.password)

        const user = auth.user

        return response.status(200).json({
          message: 'login success',
          user: user,
          token: token
        })
    }
}
