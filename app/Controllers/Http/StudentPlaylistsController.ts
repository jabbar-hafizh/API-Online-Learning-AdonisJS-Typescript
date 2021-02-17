import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentPlaylistsController {
    public async progressKelas() {
      const allplaylists = JSON.stringify(await Database
        .query().count('* as all')
        .from('users_has_playlists')
        .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
        .innerJoin('playlists', 'playlists.id', 'users_has_playlists.playlist_id'))

      const playlistsfinish = JSON.stringify(await Database
        .query().count('* as finish')
        .from('users_has_playlists')
        .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
        .innerJoin('playlists', 'playlists.id', 'users_has_playlists.playlist_id')
        .where('status', 1))

      const progress = 1 - ((parseFloat(allplaylists[8]) - parseFloat(playlistsfinish[11]))) / parseFloat(allplaylists[8])

      return progress
    }

    public async index({ response, auth }: HttpContextContract) {
      const user = await auth.authenticate()
      const playlists = await Database
        .query().select(
          'playlists.id as id_playlist',
          'playlists.title as title_playlist',
          'playlists.description as desc_playlists',
          'users_has_playlists.status as status_playlist'
        )
        .from('users_has_playlists')
        .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
        .innerJoin('playlists', 'playlists.id', 'users_has_playlists.playlist_id')
        .where('users_has_playlists.user_id', user.id)

      const data = { progress: await this.progressKelas(), playlists: playlists }
      return response.status(200).json({
        message: 'success',
        status: 200,
        data: data
      })
    }

    public async updateStatus({ params, response }: HttpContextContract) {
      await Database.from('users_has_playlists')
      .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
      .innerJoin('playlists', 'playlists.id', 'users_has_playlists.playlist_id')
      .where('playlist_id', params.id)
      .update({
        status: 1
      })

      return response.status(200).json({ message: 'playlist has been watched' })
    }

    public async getStatus({ response }: HttpContextContract) {
      const data = await this.progressKelas()
      return response.status(200).json({ data })
    }

    public async getStatusPlaylist({ auth, params, response }: HttpContextContract) {
      const userId:number = (await auth.authenticate()).id

      const allVideos = await Database.query()
        .count('* as all')
        .from('playlists')
        .where('playlists.id', params.id)
        .innerJoin('users_has_playlists', 'playlists.id', 'users_has_playlists.playlist_id')
        .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
        .innerJoin('sections', 'sections.playlist_id', 'playlists.id')
        .innerJoin('videos', 'videos.section_id', 'sections.id')
        .where('users_has_playlists.user_id', userId)

      const videosFinish = await Database.query()
        .count('* as finish')
        .from('playlists')
        .where('playlists.id', params.id)
        .innerJoin('users_has_playlists', 'playlists.id', 'users_has_playlists.playlist_id')
        .innerJoin('users', 'users.id', 'users_has_playlists.user_id')
        .innerJoin('sections', 'sections.playlist_id', 'playlists.id')
        .innerJoin('videos', 'videos.section_id', 'sections.id')
        .innerJoin('users_has_videos', 'videos.id', 'users_has_videos.video_id')
        .where('users_has_videos.status', 1)
        .where('users_has_playlists.user_id', userId)

      const progress = 1 - (allVideos[0].all - (videosFinish[0].finish)) / allVideos[0].all

      return response.status(200).json({ progress })
    }

    public async create({ params, auth, response }: HttpContextContract) {
      const user = auth.user
      if (user?.role !== 'student') return response.status(400).json({ message: 'forbidden. you are not student' })

      await Database.insertQuery().table('users_has_playlists')
        .insert({
          user_id: user.id,
          playlist_id: params.idPlaylist,
        })

      const section = await Database.query().select('*').from('sections')
        .where('playlist_id', params.idPlaylist)

      for (let i = 0; i < section.length; i++) {
        await Database.insertQuery().table('users_has_sections')
        .insert({
          user_id: user.id,
          section_id: section[i].id,
        })
      }

      const videos = await Database.query().select('videos.id').from('videos')
        .innerJoin('sections', 'sections.id', 'videos.section_id')
        .where('sections.playlist_id', params.idPlaylist)

      for (let i = 0; i < videos.length; i++) {
        await Database.insertQuery().table('users_has_videos')
        .insert({
          user_id: user.id,
          video_id: videos[i].id,
        })
      }

      const playlists = await Database.query().select('title').from('playlists')
        .where('id', params.idPlaylist)

      return response.status(200).json({ message: `success, berhasil mengikuti playlist ${playlists[0].title}` })
    }

    public async show({ params, response, auth }: HttpContextContract) {
      const user = auth.user
      if (user?.role !== 'student') return response.status(400).json({ message: 'forbidden. you are not student' })

      let playlist = await Database
        .query().select(
          'playlists.id',
          'playlists.title',
          'playlists.description'
        )
        .from('users_has_playlists')
        .where('users_has_playlists.playlist_id', params.idPlaylist)
        .innerJoin('playlists', 'users_has_playlists.playlist_id', 'playlists.id')
        .innerJoin('users_has_sections', 'users_has_playlists.user_id', 'users_has_sections.user_id')
        .first()

      let sections = await Database.query().select('*').from('users_has_sections')
        .where('user_id', user.id)
        .innerJoin('sections', 'users_has_sections.section_id', 'sections.id')
        .where('sections.playlist_id', params.idPlaylist)
        .orderBy('sections.serial_number')

      let newPlaylist = {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        listSection: sections
      }

      return response.status(200).json({
        message: 'success',
        playlist: newPlaylist,
      })
    }
}
