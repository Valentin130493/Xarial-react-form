import React from 'react';

import "./dialog.css"

export const Dialog = ({open, onClick, body}) => {
    return (
        <dialog open={open}>
            <div className={"dialog__wrapper"}>
                <div className={"dialog__body"}>
                    <h1>{body?.title}</h1>
                    <p>{body?.text}</p>
                    <button className={"body__button"} type={"button"}
                            onClick={onClick}>Submit the form
                        again
                    </button>
                </div>
            </div>
        </dialog>
    );
};
