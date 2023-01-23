import {useEffect, useState} from "react";
import axios from "axios";
import email from './assets/images/contact-email.svg'
import address from './assets/images/contact-address.svg'
import phone from './assets/images/contact-phone.svg'

import './App.css';

const App = () => {

    const [formData, setFormData] = useState([])
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [formValues, setFormValues] = useState({})
    const [error, serError] = useState({})


    useEffect(() => {
        setLoading(true)
        axios.get(`https://test-nscu.onrender.com/form`)
            .then((res) => {
                setFormData(res.data)
            })
        setTimeout(() => setLoading(false), 1500)
    }, [])

    useEffect(() => {
        if (Number(step) !== 0) {
            setFormValues(prev => ({
                ...prev,
                service: formData.body[0].form[formData.body[0].form.length - 1].elements[step - 1].label
            }))
        }
    }, [step])

    const nextHandleClick = () => {
        if (!Object.keys(error).length && Object.keys(formValues).length > 2) {
            const condition = formValues?.service === undefined ? 0 : formValues?.service
            setStep(Number(condition))
        }

    }

    const backHandleClick = () => {
        setStep(0)
        setFormValues({})
    }

    const handleInputChange = (e) => {
        e.target.type === "checkbox" ?
            setFormValues({...formValues, [e.target.name]: `${e.target.checked}`}) :
            setFormValues({
                ...formValues,
                [e.target.name]: e.target.value
            })
        serError({})

    }

    const radioButtonClick = (e) => {
        console.log(e.target.label)
        setFormValues({...formValues, [e.target.name]: e.target.value})
    }

    const handleClearForm = (e) => {
        e.preventDefault()
        setFormValues({})
        serError({})
        setStep(0)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setOpenDialog(true)
        console.log(formValues)
        // await axios.post(`https://test-nscu.onrender.com/docs`, formValues)
    }

    const handleClickAgain = () => {
        setFormValues({})
        setOpenDialog(false)
        setStep(0)
    }

    const handleBlur = (e) => {
        if (!e.target.value) {
            const message = "Required"
            serError({...error, [e.target.name]: message})
        }
    }

    return (
        <div className="App">
            {loading ? <div className="loader-03"/> :
                <>
                    <form id="form" className="form" onSubmit={(e) => handleSubmit(e)}>
                        <div className="form__group__header">
                            <h1>{formData?.header?.title}</h1>
                        </div>
                        {formData?.body?.map((data, index) => {
                            return <div id={`form__main__block_${index}`} key={`${index}`}
                                        className={`form ${index === step ? "" : "hidden"}`}>
                                {data.subtitle !== undefined && <h3 className={"subheader"}>{data?.subtitle}</h3>}
                                {data.form.map((item, index1) => {
                                    return item.element ?
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "form__group__uniq" : "form__group"}`}
                                            key={`${index1}`}>
                                            <p className="form__question"> {item.element.title}</p>
                                            <input type={`${item.element.type}`}
                                                   className={`input ${Object.keys(error).includes(item.element.name) ? "form__error form__errorInput" : ""}`}
                                                   name={`${item.element.name}`}
                                                   minLength={2}
                                                   value={Object.keys(formValues).includes(item.element.name) ? formValues[item.element.name] : ""}
                                                   onChange={(e) => handleInputChange(e)}
                                                   onBlur={(e) => handleBlur(e)}
                                                   placeholder={`${item.element.placeholder}`}
                                            />
                                            {error && <p className={"form__errorMessage"}>{error[item.element.name]}</p>}
                                        </div>
                                        :
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "form__group__uniq" : "form__group"}`}
                                            key={`${index1}`}>
                                            <p className="form__question">{item.title}</p>
                                            <div className="form__radioBtn service">
                                                {item?.elements.map((btn, index) => {
                                                    return <label key={`${index}`} htmlFor={btn.value}>{btn.label}
                                                        <input className="form__answer" type={btn.type}
                                                               name={btn.name}
                                                               value={btn.value}
                                                               onClick={(e) => radioButtonClick(e)}
                                                        />
                                                    </label>
                                                })}
                                            </div>
                                        </div>
                                })}
                                <div className="form__block__btn__wrapper">
                                    <button type={"button"} className="form__btn"
                                            onClick={() => index === 0 ? nextHandleClick() : backHandleClick()}>
                                        {index === 0 ? formData?.buttons?.next : formData?.buttons?.back}
                                    </button>
                                    {index !== 0 && <button type={"submit"} className="form__btn">
                                        {formData?.buttons?.submit}
                                    </button>}
                                    <button className="form__btn"
                                            onClick={(e) => handleClearForm(e)}>{formData?.buttons?.clear}
                                    </button>
                                </div>
                            </div>
                        })}
                    </form>

                    <dialog open={openDialog}>
                        <div className={"form__dialog__wrapper"}>
                            <div className="form__dialog__final__step ">
                                <h1>{formData?.modal?.title}</h1>
                                <p>{formData?.modal?.text}</p>
                                <button className={"form__final__again"} type={"button"} onClick={handleClickAgain}>Submit the form
                                    again
                                </button>
                            </div>
                        </div>
                    </dialog>

                    <footer>
                        <div className='form__footer__mainText'>
                            {formData.footer?.mainText}
                        </div>
                        <div className='form__footer__mainBlock'>
                            <div className='form__footer__mainBlock__left'>
                                <a className='form__footer__links' target='_blank' rel="noreferrer"
                                   href={formData.footer?.termsLink}>Terms Of
                                    Use</a>
                                <a className='form__footer__links' target='_blank' rel="noreferrer"
                                   href={formData.footer?.privacyLink}>Privacy</a>
                                <a className='form__footer__links' target='_blank' rel="noreferrer"
                                   href={formData.footer?.cookiesLink}>Cookies</a>
                            </div>
                            <div className='form__footer__mainBlock__right'>
                                <div className='form__footer__mainBlock__right__icon'>
                                    <img className='form__footer__icon-images'
                                         src={email} alt={"email_icon"}/>
                                    <a target={"_blank"} rel="noreferrer"
                                       className='form__footer__links'
                                       href={`mailto:${formData.footer?.mailLink}`}>{formData.footer?.mailLink}</a>
                                </div>
                                <div className='form__footer__mainBlock__right__icon'>
                                    <img className='form__footer__icon-images' src={phone} alt={"phone"}/>
                                    <a className='form__footer__links' target={"_blank"} rel="noreferrer"
                                       href={`tel:${formData.footer?.phoneLink}`}>{formData?.footer?.phoneLink}</a>
                                </div>
                                <div className='form__footer__mainBlock__right__icon'>
                                    <img className='form__footer__icon-images' src={address} alt={"convert"}/>
                                    <p className='form__footer__footer__paragraph__abn'>{formData.footer?.address}</p></div>
                                <div className='form__footer__abn'><p className='form__footer__footer__paragraph__abn'>ABN: </p> <p
                                    className='form__footer__footer__paragraph__abn'>{formData?.footer?.abn}</p></div>
                            </div>
                        </div>
                    </footer>
                </>
            }
        </div>
    );
}

export default App;
