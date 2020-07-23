import React, { useState, useEffect, useCallback } from 'react';
import { useFocus } from './Util'
const AddCard = (props) => {
    const display = props.show ? "display-block" : "display-none";
    const [editOrAdd, setEditOrAdd] = useState("add");
    const [currentId, setCurrentId] = useState(props.currentId);

    const setId = props.filterActive ? (props.totalCards ? props.totalCards : 0) : (props.currentId ? props.currentId : 0);
    const [formState, setFormState] = useState({ front: "", back: "", active: true, id: setId })
    const [inputRef, setInputFocus] = useFocus();
    useEffect(() => {
        if (editOrAdd === "add") {
            setFormState({ front: "", back: "", active: true, id: setId });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setId])
    const setEditFields = useCallback(() => {
        const card = props.activeCard ? props.activeCard : { front: "", back: "", active: true, id: 0 };
        setFormState({
            front: card.front,
            back: card.back,
            active: card.active,
            id: card.id
        });
    }, [props.activeCard]);
    useEffect(() => {
        if (!props.currentId) {
            setCurrentId(setId)
            setFormState(prev => ({ ...prev, id: setId }));

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.currentId, currentId])
    useEffect(() => {
        if (editOrAdd === "add") {
            if (props.filterActive) {
                const tC = props.totalCards;
                setFormState(prev => ({ ...prev, id: tC }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filterActive])
    const setAddFields = useCallback(() => {
        if (props.filterActive) {
            setFormState({ front: "", back: "", active: true, id: setId });
        } else {
            setFormState({ front: "", back: "", active: true, id: setId });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.currentId, currentId, props.filterActive, props.totalCards, setId]);

    const handleEditOrAddChange = (event) => {
        const name = event.target.name;
        if (props.cardsInDeck) {
            if (name === "edit") {
                setEditFields();
            } else if (name === "add") {
                setAddFields();
            }
            setEditOrAdd(name);
        } else {
            setAddFields();
            setEditOrAdd("add");
        }

    };
    const handleInputChange = (e) => {
        // const name = e.target.name;
        const value = e.target.value;
        const name = e.target.name;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        })
        );
    }
    // prevents hotkey events from triggering while text inputs are active
    // otherwise, an L or R arrow key press would cause an edit to fail by changing cards mid-input
    const handleFocus = (e) => {
        const name = e.target.name;
        if (name === "front" || name === "back") {
            props.sendInputStatus(true)
        } else {
            props.sendInputStatus(false)
        }
    }
    useEffect(() => {
        if (props.activeCard && editOrAdd === "edit") {
            setEditFields()
        } else if (!props.activeCard) {
            setEditFields()
        } else if (editOrAdd === "add") {
            setAddFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editOrAdd, props.activeCard, setEditFields])
    const handleSubmit = (e) => {
        const frontVal = formState.front.trim();
        const backVal = formState.back.trim();
        const op = editOrAdd;
        if (
            frontVal !== "" &&
            backVal !== "" &&
            frontVal !== backVal
        ) {
            const options = { operation: op, data: formState };

            e.preventDefault();
            props.sendFormData(options);
            if (op === "add") {
                props.getNextId();
                setAddFields();
                setInputFocus();
            }
        } else {
            e.preventDefault();
            alert("pls add a real card");
        }
    }
    const checkValue = editOrAdd === "edit" ? [true, false] : [false, true];
    const buttonVal = editOrAdd.charAt(0).toUpperCase() + editOrAdd.slice(1);
    const allowEdit = props.cardsInDeck ? "" : "noselect";
    const allowEditStyle = props.cardsInDeck ? { color: "black" } : { color: "lightgray", fontStyle: "italic", textDecoration: "line-through" };
    return (
        <div className={display}>
            <form>    <div style={allowEditStyle} className={allowEdit}>
                <input
                    type="radio"
                    name="edit"
                    checked={checkValue[0]}
                    onChange={handleEditOrAddChange}
                />
                <label htmlFor="edit">Edit</label>
            </div>
                <input
                    type="radio"
                    name="add"
                    checked={checkValue[1]}
                    onChange={handleEditOrAddChange}
                />
                <label htmlFor="add">Add</label>

                <br></br>
                <input
                    type="text"
                    name="front"
                    ref={inputRef}
                    placeholder="flashcard front"
                    value={formState.front}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={() => props.sendInputStatus(false)}
                    autoComplete="off"
                ></input>
                <br></br>
                <input
                    type="text"
                    name="back"
                    placeholder="flashcard back"
                    value={formState.back}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={() => props.sendInputStatus(false)}
                    autoComplete="off"
                ></input><br></br>
                <div className="form__id">{buttonVal}ing id: {formState.id}</div>
                <input type="button" value={buttonVal} onClick={handleSubmit} />
            </form>
        </div>
    )
}
export default AddCard;