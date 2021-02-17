import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentsPlaylistsController {
  public async index({ response, auth } : HttpContextContract) {
    const user = auth.user
    if(user?.role !== 'student') return response.status(400).json({message: 'forbidden. you are not student'})

    let playlist = await Database.query().select('*').from('users_has_playlists')
    .innerJoin('playlists', 'users_has_playlists.playlist_id', 'playlists.id')
    .first()

    const section = await Database.query().select('*').from('sections')
    .where('playlist_id', playlist.playlist_id)
    console.log(section.length);

    const total_status_selesai = await Database.query().count('status').from('sections')
    .where('status', 'Selesai')
    .where('playlist_id', playlist.playlist_id)
    console.log(total_status_selesai);

    return response.status(200).json({
      message : 'success',
      status : playlist.status,
      data : [playlist]
    })
  }
}
