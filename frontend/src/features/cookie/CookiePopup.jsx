import React from 'react'

const CookiePopup = ({dispatch}) => (
  <section>
    <p>We use cookies!</p>
    <button onClick={() => dispatch({type: 'acceptCurrent'})}>Accept</button>
    <button onClick={() => dispatch({type: 'declineAll'})}>Decline</button>
  </section>
)

export default CookiePopup
