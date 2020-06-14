// Came from auth-service.js of connecty-cube
import ConnectyCube from 'react-native-connectycube';
import config from '../config';

export default class AuthService {
  init = () => ConnectyCube.init(...config);

  login = user => {
    console.log("auth-service.js: user = ", user); //Why not see output from this console.log?
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(user)
        .then(() =>
          ConnectyCube.chat.connect({
            userId: user.id,
            password: user.password,
          }),
        )
        .then(resolve)
        .catch(reject);
    });
  };

  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
  };
}
