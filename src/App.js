import {useEffect, useState} from "react";
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
        axios.get(`https://test-nscu.onrender.com/form`)
            .then((res) => {
                setFormData(res.data)
            })
        setTimeout(() => setLoading(false), 1500)
    }, [])
    console.log(formValues)
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
        setFormValues({
            ...formValues,
            service: formData.body[0].form[formData.body[0].form.length - 1].elements[step - 1].label
        })
        setOpenDialog(true)
        await axios.post(`https://test-nscu.onrender.com/docs`, formValues)
    }
    const handleClickAgain = () => {
        setFormValues({})
        setOpenDialog(false)
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
                    <form id="form" className="js-form" onSubmit={(e) => handleSubmit(e)}>
                        <div className="form__group__header">
                            <h1>{formData?.header?.title}</h1>
                        </div>
                        {formData?.body?.map((data, index) => {
                            return <div id={`main-block_${index}`} key={`${index}`}
                                        className={`js-form ${index === step ? "" : "hidden"}`}>
                                {data.subtitle !== undefined && <h3 className={"subheader"}>{data?.subtitle}</h3>}
                                {data.form.map((item, index1) => {
                                    console.log(item, index1)
                                    console.log((step !== 0 && index1 === 0))
                                    return item.element ?
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "form__group__uniq" : "form__group"}`}
                                            key={`${index1}`}>
                                            <p className="question"> {item.title}</p>
                                            {item.element.tag === "input" && <input type={`${item.element.type}`}
                                                                                    className={` input ${Object.keys(error).includes(item.element.name) ? "error errorInput" : ""}`}
                                                                                    name={`${item.element.name}`}
                                                                                    minLength={2}
                                                                                    value={Object.keys(formValues).includes(item.element.name) ? formValues[item.element.name] : ""}
                                                                                    onChange={(e) => handleInputChange(e)}
                                                                                    onBlur={(e) => handleBlur(e)}
                                                                                    placeholder={`${item.element.placeholder}`}
                                                                                    required={true}
                                            />}
                                            {error && <p className={"errorMessage"}>{error[item.element.name]}</p>}

                                        </div>
                                        :
                                        <div
                                            className={`${(step !== 0 && index1 === 0) ? "form__group__uniq" : "form__group"}`}
                                            key={`${index1}`}>
                                            <p className="question">{item.title}</p>

                                            <div className="radioBtn service">
                                                {item?.elements.map((btn, index) => {
                                                    return <span key={`${index}`}><label htmlFor={btn.value}>{
                                                        btn.label
                                                    }
                                                        <input className="answer" type={btn.type}
                                                               name={btn.name}
                                                               value={btn.value}
                                                               onClick={(e) => radioButtonClick(e)}
                                                        />
                                    </label></span>
                                                })}

                                            </div>
                                        </div>
                                })}
                                <div className="block_btn">
                                    <button type={"button"} className="btn"
                                            onClick={() => index === 0 ? nextHandleClick() : backHandleClick()}>
                                        {index === 0 ? formData?.footer?.buttons?.next : formData?.footer?.buttons?.back}
                                    </button>
                                    {index !== 0 && <button type={"submit"} className="btn">
                                        {formData?.footer?.buttons?.submit}
                                    </button>}
                                    <button className="btn" onClick={(e) => handleClearForm(e)}>Clear
                                        form
                                    </button>
                                </div>
                            </div>
                        })}
                    </form>


                    <dialog open={openDialog}>
                        <div className={"dialog-wrapper"}>
                            <div className="final-step ">
                                <h1>{formData?.modal?.title}</h1>
                                <p>{formData?.modal?.text}</p>
                                <button className={"again"} type={"button"} onClick={handleClickAgain}>Submit the form
                                    again
                                </button>
                            </div>
                        </div>
                    </dialog>

                </>
            }
        </div>
    );
}

export default App;
