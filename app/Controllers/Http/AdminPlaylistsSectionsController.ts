import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AdminPlaylistsSectionsController {
  public async create({ auth, request, response, params }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const validator = {
      schema: schema.create({
        title: schema.string({}, [
          rules.required()
        ]),
        serial_number: schema.string({}, [
          rules.required()
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.insertQuery().table('sections')
      .insert({
        title: validated.title,
        serial_number: validated.serial_number,
        playlist_id: params.idPlaylist,
      })

    let newSection = await Database.query().select('id').from('sections').orderBy('id')
    console.log(newSection)
    let newSectionid = newSection[(newSection.length) - 1]

    const user_id = await Database
      .query().select('id')
      .from('users')

    user_id.forEach(async (users) => {
      await Database.insertQuery().table('users_has_sections')
        .insert({
          user_id: users.id,
          section_id: newSectionid.id
        })
    });


    return response.status(200).json({ message: 'success, data saved' })
  }

  public async index({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('sections').where('playlist_id', params.idPlaylist)

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
        serial_number: schema.string({}, [
          rules.required()
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.from('sections')
      .where('id', params.idSection)
      .where('playlist_id', params.idPlaylist)
      .update({
        title: validated.title,
        serial_number: validated.serial_number
      })

    return response.status(200).json({ message: 'success, data updated' })
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('sections')
      .where('id', params.idSection)
      .where('playlist_id', params.idPlaylist)

    return response.status(200).json({ message: 'success', data })
  }

  public async delete({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    await Database.from('sections')
      .where('id', params.idSection)
      .where('playlist_id', params.idPlaylist)
      .delete()

    return response.status(200).json({ message: 'success, data deleted' })
  }
}
