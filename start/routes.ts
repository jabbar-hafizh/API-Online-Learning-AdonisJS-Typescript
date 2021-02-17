/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login').as('login')
  Route.post('/register', 'AuthController.register').as('register')
  Route.post('/register/admin', 'AuthController.register_admin').as('register.admin')

  // admin playlists
  Route.group(() => {
    Route.post('', 'AdminPlaylistsController.create')
    Route.get('', 'AdminPlaylistsController.index')
    Route.group(() => {
      Route.get('', 'AdminPlaylistsController.show')
      Route.put('', 'AdminPlaylistsController.update')
      Route.delete('', 'AdminPlaylistsController.delete')

      // admin sections
      Route.group(() => {
        Route.post('', 'AdminPlaylistsSectionsController.create')
        Route.get('', 'AdminPlaylistsSectionsController.index')
        Route.group(() => {
          Route.get('', 'AdminPlaylistsSectionsController.show')
          Route.put('', 'AdminPlaylistsSectionsController.update')
          Route.delete('', 'AdminPlaylistsSectionsController.delete')

          // admin videos
          Route.group(() => {
            Route.post('', 'AdminPlaylistsSectionsVideosController.create')
            Route.get('', 'AdminPlaylistsSectionsVideosController.index')
            Route.group(() => {
              Route.get('', 'AdminPlaylistsSectionsVideosController.show')
              Route.put('', 'AdminPlaylistsSectionsVideosController.update')
              Route.delete('', 'AdminPlaylistsSectionsVideosController.delete')
            }).prefix(':idVideo')
          }).prefix('videos')
        }).prefix(':idSection')
      }).prefix('sections')
    }).prefix(':idPlaylist')
  }).prefix('admin/playlists').middleware('auth')


  // student playlist
  Route.group(() => {
    Route.get('', 'StudentPlaylistsController.index')
    Route.get('/status', 'StudentPlaylistsController.getStatus')
    Route.get('/status/:id', 'StudentPlaylistsController.getStatusPlaylist')
    Route.group(() => {
      Route.post('', 'StudentPlaylistsController.updateStatus') // belum dibuat dokumentasinya karena ga paham maksudnya apa
      Route.post('/join', 'StudentPlaylistsController.create')
      Route.get('', 'StudentPlaylistsController.show')
      Route.group(() => {

        Route.group(() => {
          Route.get('', 'StudentSectionsController.show')
          Route.group(() => {

            Route.group(() => {
              Route.get('', 'StudentVideosController.show')
              Route.post('', 'StudentVideosController.status')
            }).prefix('/:idVideo')
          }).prefix('/videos')
        }).prefix('/:idSection')
      }).prefix('/sections')
    }).prefix('/:idPlaylist')
  }).prefix('student/playlists').middleware('auth')
}).prefix('api/v1')
