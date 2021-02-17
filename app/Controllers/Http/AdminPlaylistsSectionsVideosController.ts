import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AdminPlaylistsSectionsVideosController {
  public async create({ auth, request, response, params }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const validator = {
      schema: schema.create({
        title: schema.string({}, [
          rules.required()
        ]),
        description: schema.string({}, [
          rules.required()
        ]),
        link: schema.string({}, [
          rules.required()
        ]),
        serial_number: schema.string({}, [
          rules.required()
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.insertQuery().table('videos')
      .insert({
        title: validated.title,
        description: validated.description,
        link: validated.link,
        serial_number: validated.serial_number,
        section_id: params.idSection,
      })

    let newVideo = await Database.query().select('id').from('videos').orderBy('id')
    console.log(newVideo)
    let newVideoid = newVideo[(newVideo.length) - 1]

    const user_id = await Database
      .query().select('id')
      .from('users')

    user_id.forEach(async (users) => {
      await Database.insertQuery().table('users_has_videos')
        .insert({
          user_id: users.id,
          video_id: newVideoid.id
        })
    });

    return response.status(200).json({ message: 'success, data saved' })
  }

  public async index({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('videos')
      .where('section_id', params.idSection)
      .orderBy('serial_number', 'asc')

    return response.status(200).json({ message: 'success', data })
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const validator = {
      schema: schema.create({
        title: schema.string({}, [
          rules.required()
        ]),
        description: schema.string({}, [
          rules.required()
        ]),
        link: schema.string({}, [
          rules.required()
        ]),
        serial_number: schema.string({}, [
          rules.required()
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.from('videos').where('id', params.idVideo)
      .update({
        title: validated.title,
        description: validated.description,
        link: validated.link,
        serial_number: validated.serial_number
      })

    return response.status(200).json({ message: 'success, data updated' })
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('videos').where('id', params.idVideo)

    return response.status(200).json({ message: 'success', data })
  }

  public async delete({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    await Database.from('videos').where('id', params.idVideo).delete()

    return response.status(200).json({ message: 'success, data deleted' })
  }
}
