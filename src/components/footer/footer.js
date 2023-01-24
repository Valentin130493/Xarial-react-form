import React from 'react';
import email from "../../assets/images/contact-email.svg";
import phone from "../../assets/images/contact-phone.svg";
import address from "../../assets/images/contact-address.svg";

import "./footer.css"

const Footer = ({data}) => {
    return (
        <footer className={"form__footer"}>
            <div className={'footer__mainText'}>
                {data?.mainText}
            </div>
            <div className={'footer__mainBlock'}>
                <div className={'mainBlock__left'}>
                    <a className={'links'} target='_blank' rel="noreferrer"
                       href={data?.termsLink}>Terms Of
                        Use</a>
                    <a className={'links'} target='_blank' rel="noreferrer"
                       href={data?.privacyLink}>Privacy</a>
                    <a className={'links'} target='_blank' rel="noreferrer"
                       href={data?.cookiesLink}>Cookies</a>
                </div>
                <div className={'footer__mainBlock__right'}>
                    <div className={'right__icon'}>
                        <img className={'icon__image'}
                             src={email} alt={"email_icon"}/>
                        <a target={"_blank"} rel="noreferrer"
                           className={'links'}
                           href={`mailto:${data?.mailLink}`}>{data?.mailLink}</a>
                    </div>
                    <div className={'right__icon'}>
                        <img className={'icon__image'} src={phone} alt={"phone"}/>
                        <a className={'links'} target={"_blank"} rel="noreferrer"
                           href={`tel:${data?.phoneLink}`}>{data?.phoneLink}</a>
                    </div>
                    <div className={'right__icon'}>
                        <img className={'icon__image'} src={address} alt={"convert"}/>
                        <p className={'icon__paragraph'}>{data?.address}</p>
                    </div>
                    <div className={'right__abn'}><p
                        className={'icon__paragraph'}>ABN: </p> <p
                        className={'icon__paragraph'}>{data?.abn}</p></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;