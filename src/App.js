import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

const App = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get(`https://test-nscu.onrender.com/form`)
      .then((res) => {
        console.log(res.data);
        setFormData(res.data);
      });
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const nextHandleClick = () => {
    const condition = formValues?.service === undefined ? 0 : formValues?.service;
    switch (condition) {
      case "New Product/Macro development":
        return setStep(1);
      case "SOLIDWORKS API consultancy":
        return setStep(2);
      case "Other":
        return setStep(3);
      default:
        setStep(0);
    }
  };

  const backHandleClick = () => {
    setStep(0);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const radioButtonClick = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    setFormValues({});
    setStep(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("click");
    setOpenDialog(true);
    // await axios.post(`http://localhost:8080/docs`, formValues)
    console.log(formValues);
  };

  const handleClickAgain = () => {
    setFormValues({});
    setStep(0);
    setOpenDialog(false);
  };

  return (
    <div className="App">
      {loading ? <div className="loader-03" /> :
        <>
          <form id="form" className="js-form">
            <div className="form__group__header">
              <h1>{formData?.header?.title}</h1>
            </div>
            {formData?.body?.map((data, index) => {
              return <div id={`main-block_${index}`} key={`${index}`}
                          className={`js-form ${index === step ? "" : "hidden"}`}>
                {data.map((item, index1) => {
                  return item.element ? <div className="form__group" key={`${index1}`}>
                      <p className="question"> {item.title}</p>
                      {
                        item.element.tag === "input" &&
                        <input type={`${item.element.type}`}
                               className="input"
                               name={`${item.element.name}`}
                               value={Object.keys(formValues).includes(item.element.name) ? formValues[item.element.name] : " "}
                               onChange={(e) => handleInputChange(e)}
                               placeholder={`${item.element.placeholder}`}
                        />
                      }
                    </div>
                    :
                    <div className="form__group" key={`${index1}`}>
                      <p className="question">{item.title}</p>
                      <div className="radioBtn service">
                        {item?.elements.map((btn, index) => {
                          return <span key={`${index}`}>
                            <label htmlFor={btn.value}>
                              { btn.label }
                              <input className="answer" type={btn.type}
                                     name={btn.name}
                                     value={btn.value}
                                     onClick={(e) => radioButtonClick(e)}
                              />
                            </label>
                          </span>;
                        })}
                      </div>
                    </div>;
                })}
                <div className="block_btn">
                  <button type={"button"} className="btn"
                          onClick={() => index === 0 ? nextHandleClick() : backHandleClick()}>
                    {index === 0 ? formData?.footer?.buttons?.next : formData?.footer?.buttons?.back}
                  </button>
                  {
                    index !== 0 &&
                    <button type={"button"} className="btn" onClick={handleSubmit}>
                      {formData?.footer?.buttons?.submit}
                    </button>
                  }
                  <button className="btn" onClick={(e) => handleClearForm(e)}>
                    Clear form
                  </button>
                </div>
              </div>;
            })}
          </form>
          <dialog open={openDialog} id="dialog">
            <div className={"dialog-wrapper"}>
              <div className="final-step ">
                <h1>{formData?.modal?.title}</h1>
                <p>{formData?.modal?.text}</p>
                <button className={"again"} type={"button"} onClick={handleClickAgain}>
                  Submit the form again
                </button>
              </div>
            </div>
          </dialog>
        </>
      }
    </div>
  );
};

export default App;
