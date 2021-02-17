import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AdminPlaylistsController {
  public async create({ auth, request, response }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const validator = {
      schema: schema.create({
        title: schema.string({}, [
          rules.required()
        ]),
        description: schema.string({}, [
          rules.required()
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.insertQuery().table('playlists')
      .insert({
        title: validated.title,
        description: validated.description,
      })

    let newPlaylist = await Database.query().select('id').from('playlists').orderBy('id')
    let newPlaylistid = newPlaylist[(newPlaylist.length) - 1]

    const user_id = await Database
      .query().select('id')
      .from('users')

    user_id.forEach(async (users) => {
      await Database.insertQuery().table('users_has_playlists')
        .insert({
          user_id: users.id,
          playlist_id: newPlaylistid.id
        })
    });

    return response.status(200).json({ message: 'success, data saved' })
  }

  public async index({ response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('playlists')
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
        ])
      })
    }

    const validated = await request.validate(validator)
    await Database.from('playlists')
      .where('id', params.idPlaylist)
      .update({
        title: validated.title,
        description: validated.description
      })

    return response.status(200).json({ message: 'success, data updated' })
  }

  public async show({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    const data = await Database.query().select('*').from('playlists').where('id', params.idPlaylist)

    return response.status(200).json({ message: 'success', data })
  }

  public async delete({ params, response, auth }: HttpContextContract) {
    const user = auth.user
    if (user?.role !== 'admin') return response.status(400).json({ message: 'forbidden. you are not admin' })

    await Database.from('playlists').where('id', params.idPlaylist).delete()

    return response.status(200).json({ message: 'success, data deleted' })
  }
}
