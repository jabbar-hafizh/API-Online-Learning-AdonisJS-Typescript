import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentVideosController {


    public async show({ auth, params, response }: HttpContextContract) {
      const user = await auth.authenticate()
      // kalau status video ini == 0, message: "anda harus menonton video sebelumnya"
      const status_video = await Database.query().select('users_has_videos.status')
      .from('users_has_videos')
      .innerJoin('videos', 'users_has_videos.video_id', 'videos.id')
      .innerJoin('sections', 'videos.section_id', 'sections.id')
      .where('videos.id', params.idVideo)
      .where('users_has_videos.user_id', user.id)
      .where('sections.id', params.idSection)
      console.log(status_video)



        // await Database.from('users_has_videos')
        //     .innerJoin('users', 'users.id', 'users_has_videos.user_id')
        //     .innerJoin('videos', 'videos.id', 'users_has_videos.video_id')
        //     .innerJoin('sections', 'videos.section_id', 'sections.id')
        //     .where('sections.playlist_id', params.idPlaylist)
        //     .where('sections.id', params.idSection)
        //     .where('videos.id', params.idVideos)
        //     .update({
        //         status: 0
        //     })

        const data = await Database
            .query().select(
                // '*',
                'videos.id as id video',
                'videos.description as description video',
                'videos.title as title video',
                'videos.serial_number as number_video',
                'sections.serial_number as number section',
                'videos.created_at',
                'videos.updated_at',
                'videos.link'
            )
            .from('videos')
            .innerJoin('sections', 'videos.section_id', 'sections.id')
            .where('sections.playlist_id', params.idPlaylist)
            .where('sections.id', params.idSection)
            .where('videos.id', params.idVideo)

            console.log(data[0].number_video)
            if(status_video == null){
              if(data[0].number_video > 1){
                console.log('harus nonton video sebelumnya')
              }
            }


        // return response.status(200).json({ message: 'success', status: 200, data })
    }

    public async status({ params, response }: HttpContextContract) {
        await Database.from('users_has_videos')
            .innerJoin('users', 'users.id', 'users_has_videos.user_id')
            .innerJoin('videos', 'videos.id', 'users_has_videos.video_id')
            .innerJoin('sections', 'videos.section_id', 'sections.id')
            .where('sections.playlist_id', params.idPlaylist)
            .where('sections.serial_number', params.numberSection)
            .where('videos.serial_number', params.numberVideos)
            .update({
                status: 1
            })

        return response.status(200).json({ message: 'video has been watched' })
    }
}
