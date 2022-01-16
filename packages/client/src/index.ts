import Game, { GameSettings } from './game'
import axios from 'axios'
interface AuthData {
  username: string
  color: string
  password: string
}

// const auth = window.localStorage.getItem('auth');

// console.log('auth', auth);

const settings: GameSettings = {
  showFPS: true,
  targetFPS: 60
}

const register = async () => {
  const username = window.prompt('Enter a username') || ''
  const password = window.prompt('Enter a password') || ''
  const color = window.prompt('Enter a hex color or color name') || ''
  const authData: AuthData = { username, color, password }

  // window.localStorage.setItem('auth', JSON.stringify(authData));

  const res = await axios.post('http://localhost:8080/register', authData)
  if (res.data.status === 'SUCCESS') {
    console.log(res.data)
    new Game(settings, res.data.player.id)
  } else {
    window.alert(res.data.error)
    register()
  }
}

// const login = async (data: AuthData) => {
//   const res = await axios.post('http://localhost:8080/register', data);

//   if (res.data.status === 'SUCCESS') {
//     console.log(res.data);
//     const game = new Game(settings, res.data.player.id);
//   } else {
//     window.alert(res.data.error);
//     register();
//   }
// };

// if (auth) {
//   const authData: AuthData = JSON.parse(auth);
//   console.log(authData);
//   login(authData);
// } else {
//   register();
// }
register()
