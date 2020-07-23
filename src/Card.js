import React, {useEffect, useState} from 'react';
const Card = (props) => {
    const [data, setData] = useState({ front: "sample", back: "card" })
    useEffect(
        () => {
            setData(props.data)
        },
        [props.data],
    );
    const bracketStart = () => {
        return '{'
    }
    const bracketEnd = () => {
        return '}'
    }
    const footNoteStyle = { fontSize: "11px"}
    const containerStyle = { textAlign: "center", width: "100%", display: "block"}
    const stringStyle = { textAlign: "left", background: "lightgray", width: "50%", display: "inline-block"};
    const stringTemp = () => {
        return (
`[
    {
        "front": "front 1",
        "back": "back 1",
        "active": true
    },
    {
        "front": "front 2",
        "back": "back 2"
    },
    ...,
    {
        "front": "front n",
        "back": "back n"
    }
]`
            )
    }
    const flippedClassList = props.flipped
        ? "card flip"
        : "card";
    return (
        props.show ? (
            <div className="container">
                <div className={flippedClassList}>
                    <div className="front noselect">{data ? data.front : ""}</div>
                    <div className="back noselect">{data ? data.back : ""}</div>
                </div>
            </div>
        ) : (<div className="container" style={{ margin: "10px" }}>Nothing to show!<br></br> Add individual cards using the form, or upload a whole deck!<br></br>
            The load feature takes a <code>.json</code> file containing an array of card objects in the following format <br></br>
            <div style={stringStyle}><pre><code>
            {stringTemp()}
                </code></pre></div><br></br><div style={footNoteStyle}>The "active" property may be specified optionally for filtering purposes. The default value is true. If you copy/paste the above, be sure to remove <code>'...,'</code>!</div></div>)
    )
}
export default Card;