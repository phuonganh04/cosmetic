/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useEffect, useState } from "react";
import axiosClient from "../common-component/apis";
import Script from 'next/script';

export const AuthContext = createContext<any>({
  currentUser: undefined,
  setCurrentUser: () => { },
  token: undefined
})

export const AuthProvider = ({ user, token: defaultToken, children }: any) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [token, setToken] = useState(defaultToken);

  useEffect(() => {
    axiosClient.get('/me').then(response => setCurrentUser(response?.data))
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, token, setCurrentUser, setToken }}>
      {children}
      <div id="fb-root"></div>
      <div id="fb-customer-chat" className="fb-customerchat"></div>
      <Script strategy="lazyOnload" id="facebook-chat">{`
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "101483072787190");
        chatbox.setAttribute("attribution", "biz_inbox");
        
        window.fbAsyncInit = function() {
          FB.init({
            xfbml            : true,
            version          : 'v15.0'
          });
        };
  
        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      `}</Script>
    </AuthContext.Provider>
  )
}
