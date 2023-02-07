import {useEffect, useState} from "react";

import {Dialog, Footer, Loader} from "./components";

import axios from "axios";

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
        axios.get(`https://test-nscu.onrender.com/form`).then((res) => setFormData(res.data))
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
        await axios.post(`https://test-nscu.onrender.com/docs`, formValues)
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
        <div className={"App"}>
            {loading ? <Loader/> :
                <>
                    <form className={"form"} onSubmit={(e) => handleSubmit(e)}>
                        <div className={"form__header"}>
                            <h1>{formData?.header?.title}</h1>
                        </div>
                        {formData?.body?.map((data, index) => {
                            return <div key={`${index}`}
                                        className={`form__block ${index === step ? "" : "hidden"}`}>
                                {data.subtitle !== undefined &&
                                    <h3 className={"block__subheader"}>{data?.subtitle}</h3>}
                                {data.form.map((item, index1) => {
                                    return item.element ?
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "block__uniq" : "block"}`}
                                            key={`${index1}`}>
                                            <p className={"block__question"}> {item.element.title}</p>
                                            <input type={`${item.element.type}`}
                                                   className={`block__input ${Object.keys(error).includes(item.element.name) ? "error block__input__error" : ""}`}
                                                   name={`${item.element.name}`}
                                                   minLength={2}
                                                   value={Object.keys(formValues).includes(item.element.name) ? formValues[item.element.name] : ""}
                                                   onChange={(e) => handleInputChange(e)}
                                                   onBlur={(e) => handleBlur(e)}
                                                   placeholder={`${item.element.placeholder}`}
                                            />
                                            {error &&
                                                <p className={"block__error__block"}>{error[item.element.name]}</p>}
                                        </div>
                                        :
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "block__uniq" : "block"}`}
                                            key={`${index1}`}>
                                            <p className={"block__question"}>{item.title}</p>
                                            <div className={"block__radio service"}>
                                                {item?.elements.map((btn, index) => {
                                                    return <label key={`${index}`} htmlFor={btn.value}>{btn.label}
                                                        <input className={"radio__answer"} type={btn.type}
                                                               name={btn.name}
                                                               value={btn.value}
                                                               onClick={(e) => radioButtonClick(e)}
                                                        />
                                                    </label>
                                                })}
                                            </div>
                                        </div>
                                })}
                                <div className={"form__block__buttons"}>
                                    <button type={"button"} className={"buttons__btn"}
                                            onClick={() => index === 0 ? nextHandleClick() : backHandleClick()}>
                                        {index === 0 ? formData?.buttons?.next : formData?.buttons?.back}
                                    </button>
                                    {index !== 0 && <button type={"submit"} className={"buttons__btn"}>
                                        {formData?.buttons?.submit}
                                    </button>}
                                    <button className={"buttons__btn"}
                                            onClick={(e) => handleClearForm(e)}>{formData?.buttons?.clear}
                                    </button>
                                </div>
                            </div>
                        })}
                    </form>

                    <Dialog open={openDialog} onClick={handleClickAgain} body={formData.modal}/>
                    <Footer data={formData.footer}/>

                </>
            }
        </div>
    );
}

export default App;
