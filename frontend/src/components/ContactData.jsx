import React,{useContext} from 'react'
import {useCookieConsentDispatch,useCookieConsentState} from "../features/cookie/CookieConsent"
function ContactData() {
    const cookieConsentState = useCookieConsentState()
    const cookieConsentDispatch = useCookieConsentDispatch()

    return (
      <article>
        <h1>Title</h1>
        <button onClick={() => cookieConsentDispatch({type: 'showCookiePopup  '})}>Update cookie settings</button>
        {cookieConsentState.isSet && cookieConsentState.marketing ?
          <script>
            {/* Marketing code here */}
          </script>
        : ''}
      </article>
    )
}

export default ContactData
