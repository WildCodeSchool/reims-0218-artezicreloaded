# reims-0218-artezicreloaded

## Group members:

* Aurélie Bayre ([@AurelieBayre](https://github.com/AurelieBayre))
* Arnaud Gadroy ([@raspnotification](https://github.com/raspnotification))
* Max Gallois ([@GalloisMax](https://github.com/GalloisMax))
* Thibaud Royer ([@GautamaB](https://github.com/GautamaB))

## Description

*A platform designed for entertainment and team building.*

Share your best playlists with your team/coworkers, vote for the playlists you like, and enjoy stardom status when your playlist gets the most votes!

This is our second project at Wild Code School Reims, and our first SPA. We chose to use playlists from and [Soundsgood](https://soundsgood.co/) as it lets users compile playlists from a variety of platforms (Youtube, Spotify, Deezer, etc)

### Goals

- [x] use NodeJS and Express
- [x] implement routing
- [x] implement Scrum method
- [x] use a database (SQLite)
- [x] implement JWT authentication (PassportJS)

### Challenges

- we used iframes in a modal to let the user listen to the registed playlists. That means we needed the "embed" url from Soundsgood playlist. To solve this, we extract the playlist url with a regex from Soundsgood's "intégrer" code. We then insert the url to our database.
- Furthemore, the playlist appeared, but could not be played if we created one modal per playlist. So we created one empty hidden modal in the page. Now when the playlist is clicked we inject the code of that playlist into the empty modal and we turn it to show.
- We had to make sure users could vote only for playlists they had not already voted for. We created a table votes with the id of the playlist and the id of the user. Then when the user votes for a playlist, the vote button turns into a "check" button that isn't actionable.


## Demo:

0. Make sure you installed all the dependencies: ```$ npm install```
1. Open your console and type ```$ npm start```
2. Open your browser on [localhost:8000](http://localhost:8000/)
3. Authentication: we use local storage to store the token. We'll learn about cookies in the next project.

## Contributing:

1. Fork or clone this repo.
2. In your terminal, type: ```$ npm install```
3. install commitizen globally and use it to format your commit. (Please note that commitizen is already saved in the package.json so it will already be installed locally.)
4. Please follow [these instructions](https://www.npmjs.com/package/commitizen#conventional-commit-messages-as-a-global-utility) to set commitizen to use the **cz-conventional-changelog**.
5. The first time you work on a branch: **Make sure you're on develop**. Then,  ```git checkout -b <userstory>``` After that, just ```git checkout <userstory>``` When creating a branch, make sure you know the names of the branches to use. Check with your team!
6. ```git pull origin <userstory>`` to retrieve any change from that branch.
7. Make your modifications.
8. Add them, and then commit them with: ```git cz```
9. When the userstory is completed, create a pull request from that branch to develop. Make  Tag our teacher and supervisor [@dadtmt](https://github.com/dadtmt) to let him know a PR is waiting to be merged.


