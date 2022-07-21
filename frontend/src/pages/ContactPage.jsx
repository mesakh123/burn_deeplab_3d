import React,{useCallback, useState}  from 'react'
import ContactData from '../components/ContactData';
import DragDropFileExample from '../components/DragDropFileExample';
import {ContactContext} from '../contexts/ContactContext';
import {CookieConsentProvider} from '../features/cookie/CookieConsent'
import { useCookieConsentState, useCookieConsentDispatch } from '../features/cookie/CookieConsent'
function ContactPage() {

    const [isCalled, setCalled] = useState(false);
    return (

        <CookieConsentProvider>
            <DragDropFileExample/>
        </CookieConsentProvider>

    )
}

export default ContactPage
