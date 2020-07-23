import React, { useState, useEffect } from 'react';
import { getStringProps, getStringPropsFromArr } from './Util'
import useDebounce from './Debounce'

function SaveLoad(props, { sendLoadCallback }) {
    const [showSpinner, setShowSpinner] = useState(false);
    const [loadInfo, setLoadInfo] = useState("");
    const [filename, setFilename] = useState("");
    const [loadData, setLoadData] = useState([]);
    const [fileInputKey, setFileInputKey] = useState(Date.now())
    const [action, setAction] = useState("add");
    const [textAreaOptionActive, setTextAreaOptionActive] = useState(false);
    const [textInputIsValid, setTextInputIsValid] = useState(true);
    const [textAreaInputString, setTextAreaInputString] = useState('');
    const [textAreaInputValue, setTextAreaInputValue] = useState([]);
    const [textAreaInputKey, setTextAreaInputKey] = useState(Date.now() + 1)
    const display = props.show ? "display-block" : "display-none";
    const buttonVal = action === "add" ? "Add" : action === "replace" ? "Replace" : action === "save" ? "Save" : "";
    const debouncedValidationInput = useDebounce(textAreaInputString, 1000);
    const debouncedLoadInfo = useDebounce(loadInfo, 5000);
    const handleSerializationFailure = (optional) => {
        const opt = optional ? optional:'';
        setLoadInfo(opt)
        setShowSpinner(false)
        setTextInputIsValid(false)
        setTextAreaInputValue([]);
    }
    const handleResults = (results) => {
        if (results) {
            if (results && !Array.isArray(results) && Object.keys(results).length >= 2) {
                const resObj = getStringProps(results);
                if (resObj) {
                    setLoadInfo("Found a card! Click 'add' to load!")
                    setShowSpinner(false)
                    setTextInputIsValid(true)
                    setTextAreaInputValue([resObj])
                } else {
                    handleSerializationFailure("Couldn't find any card-like objects!");
                }
            } else if (results && Array.isArray(results) && results.length > 0) {
                const resArr = getStringPropsFromArr(results);
                if (resArr.length > 0) {
                    const cardOrCards = resArr.length > 1 ? "cards" : "card";
                    const loadInfoString = `Success! ${JSON.stringify(resArr.length)} ${cardOrCards} found! Click 'add' to load!`;
                    setLoadInfo(loadInfoString)
                    setShowSpinner(false);
                    setTextInputIsValid(true);
                    setTextAreaInputValue(resArr);
                } else {
                    handleSerializationFailure("Couldn't find any card-like objects!");
                }
            } else {
                handleSerializationFailure("Couldn't find any card-like objects!");
            }

        } else {
            handleSerializationFailure("Couldn't find any card-like objects!");
        }
    }
    useEffect(() => {
        if (debouncedLoadInfo) {
            setLoadInfo("");
        }
    }, [debouncedLoadInfo])
    useEffect(
        () => {
            if (debouncedValidationInput) {
                const results = tryParseJSON(textAreaInputString)
                handleResults(results);
            } else {
                handleSerializationFailure()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debouncedValidationInput])

    const download = (filename, text) => {
        const pom = document.createElement("a");
        pom.setAttribute(
            "href",
            "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);
        if (document.createEvent) {
            const event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
    const handleDownload = () => {
        const contents = JSON.stringify(props.activeDeck, 2, "\t");
        let fn = "flashcards.json";
        const currentFilename = filename;
        if (currentFilename.trim() !== "") {
            fn = currentFilename + ".json".toString()
        }
        download(fn, contents);
    }
    const handleFile = (e) => {
        const content = e.target.result;
        const json = JSON.parse(content);
        setLoadData(json);
    }
    const handleOptsChange = (e) => {
        const name = e.target.name;
        setAction(name);
    }
    const handleFileNameInputChange = (e) => {
        const value = e.target.value;
        setFilename(value)
    }
    const handleTextAreaInputChange = (e) => {
        const value = e.target.value;
        if (debouncedValidationInput !== value) {
            setShowSpinner(true);
        }
        setTextAreaInputString(value);
    }

    const tryParseJSON = (jsonString) => {
        try {
            const json = JSON.parse(jsonString);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object", 
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (json && typeof json === "object") {
                return json;
            }
        }
        catch (e) { return false }
        return false
    };
    const textAreaClass = () => {
        if (textAreaOptionActive && action !== "save") {
            if (showSpinner) {
                return "text__area__validating".toString()
            } else if (!showSpinner && textInputIsValid) {
                return "text__area__valid".toString()
            } else if (!showSpinner && !textInputIsValid) {
                return "text__area__invalid".toString()
            }

        } else {
            return "display-none".toString()
        }
    }
    const clearFileInput = (e) => {
        const newDate = Date.now();
        setFileInputKey(newDate);
    }
    const clearTextAreaInput = (e) => {
        const newKey = Date.now() + 1;
        setTextAreaInputString("");
        setTextAreaInputValue([])
        setTextAreaInputKey(newKey)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const currentData = textAreaOptionActive ? (textAreaInputValue ? textAreaInputValue : []) : (loadData ? loadData : []);

        if (action !== "save" && currentData.length > 0) {
            const options = {
                operation: action,
                data: currentData
            }
            props.sendLoadData(options)
            clearFileInput();
            clearTextAreaInput();
            setLoadData([]);
        } else if (action === "save") {
            handleDownload();
            setFilename("");
        } else if (action !== "save" && textAreaOptionActive) {
            alert('Check your JSON, or else select a valid file.')
        } else {
            alert('Please select a valid file')
        }

    }
    const handleFileChange = (file) => {
        const fileData = new FileReader();
        fileData.onloadend = handleFile;
        if (file) {
            fileData.readAsText(file)
        }
    }
    const labelContents = (action === "add") ?
        "adds loaded cards to the current deck" :
        (action === "replace")
            ? "replaces the current deck"
            : "save the current deck as a .json file";
    return (
        <form className={display} onSubmit={handleSubmit}>
            <input
                type="radio"
                name="save"
                checked={action === "save"}
                onChange={handleOptsChange}
            ></input>
            <label htmlFor="save">Save</label>
            <input
                type="radio"
                name="add"
                checked={action === "add"}
                onChange={handleOptsChange}
            ></input>
            <label htmlFor="load">Load (Add)</label>
            <input
                type="radio"
                name="replace"
                checked={action === "replace"}
                onChange={handleOptsChange}
            ></input>
            <label htmlFor="replace">Load (Replace)</label>
            <br></br>

            <label htmlFor="filename" className="save-load-label">{labelContents}</label>
            <br></br>
            <div className="filename__input__container">
            <input
                type="text"
                name="filename"
                placeholder="Deck name (defaults to 'flashcards')"
                value={filename}
                className={
                    (action === "save") ?
                        "filename__input" : "display-none"
                }
                
                onChange={handleFileNameInputChange}
                autoComplete="off"
                onFocus={() => props.sendInputStatus(true)}
                onBlur={() => props.sendInputStatus(false)}
            ></input>
            </div>
            <div className="text__or__file__button__container">
                <button onClick={(e) => {
                    setTextAreaOptionActive(prev => !prev)
                    e.preventDefault();
                }}
                    className={(action !== "save") ? "text__or__file__button" : "display-none"}
                >
                    {textAreaOptionActive ? 'Upload with File' : 'Upload with TextArea'}</button></div>

            <textarea
                name="text"
                key={textAreaInputKey}
                className={textAreaClass()}
                onChange={handleTextAreaInputChange}
                onFocus={() => props.sendInputStatus(true)}
                onBlur={() => props.sendInputStatus(false)}
            >
            </textarea>

            <input
                type="file"
                id="uploadDeck"
                key={fileInputKey}
                name="file"
                accept=".json"
                className={(action !== "save" && !textAreaOptionActive) ? "display-block" : "display-none"}
                onChange={(e) => {
                    if (e.target.files[0]) {
                        handleFileChange(e.target.files[0])
                    }
                }
                }
            ></input>
            <div className="">

            </div>
            <input type="submit" value={buttonVal} />

            <div className={action !== "save" && textAreaOptionActive ? "validation__msg" : "display-none"}>
                <div className={textAreaOptionActive && showSpinner ? "validating__text__spinner" : "display-none"}>
                    <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div><br></br>
                {showSpinner ? "Validating json..." : loadInfo}</div>
        </form>
    )
}
export default SaveLoad;