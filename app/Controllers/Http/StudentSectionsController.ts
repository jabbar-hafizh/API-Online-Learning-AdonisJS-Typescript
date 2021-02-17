import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StudentSectionsController {
    public async show({ params, response, auth }: HttpContextContract) {
        const user = await auth.authenticate()

        const section = await Database.query().select('*').from('users_has_sections')
            .where('user_id', user.id)
            .innerJoin('sections', 'users_has_sections.section_id', 'sections.id')
            .where('sections.playlist_id', params.idPlaylist)
            .where('sections.serial_number', params.numberSection)
            .first()

        const videos = await Database
            .query().select('*')
            .from('users_has_videos')
            .where('users_has_videos.user_id', user.id)
            .innerJoin('videos', 'users_has_videos.video_id', 'videos.id')
            .where('videos.section_id', section.id)
            .orderBy('videos.serial_number')

        const newSection = {
            id: section.id,
            title: section.title,
            listvideos: videos
        }

        return response.status(200).json({ message: 'success', status: 200, Section: newSection })
    }
}
