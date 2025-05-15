import { useRef } from 'react'
export const getStringProps = (jsonObj) => {
  let card = {
    front: "",
    back: "",
    active: true
  };
  while (card.front === "" && card.back === "") {
    if (jsonObj.hasOwnProperty("active") && typeof jsonObj.active === "boolean") {
      card.active = jsonObj.active
      console.log("card.active = " + JSON.stringify(card.active));

    }
    if (jsonObj.hasOwnProperty("front") && typeof jsonObj.front === "string" && jsonObj.front.trim() !== "") {
      card.front = jsonObj.front.trim()
      console.log("card.front = " + JSON.stringify(card.front));

    }
    if (jsonObj.hasOwnProperty("back") && typeof jsonObj.back === "string" &&
        jsonObj.back.trim() !== card.front) {
      card.back = jsonObj.back.trim()
      console.log("card.back = " + JSON.stringify(card.back));
    }
    if (card.front !== "" && card.back !== "" && card.front !== card.back) {
      console.log("got card value: "+ JSON.stringify(card))
      return card
    }
    // if the "front" and "back" properties are not explicitly stated, first we'll check the properties--
	  // if there's only one and it's a string value, we'll accept it as a card in the form of {"front": "key", "back": "value"}
	  console.log("no explicit \"front\" or \"back\" properties found--checking single property value fallback: " + JSON.stringify(jsonObj));
	  if (Object.keys(jsonObj).length === 1 && typeof jsonObj[Object.keys(jsonObj)[0]] === "string" && typeof Object.keys(jsonObj)[0] === "string") {
		  let question = Object.keys(jsonObj)[0];
		  let answer = jsonObj[Object.keys(jsonObj)[0]];
		  if (question.trim() !== "" && answer.trim() !== "" && question.trim() !== answer.trim()) {
			  card.front = question.trim();
			  card.back = answer.trim();
			  return card;
		  }
	  } else {
      console.log("object had multiple properties--checking for string values");
    }
    for (let key in jsonObj) {
      if (jsonObj.hasOwnProperty(key)) {
        const prop = jsonObj[key];
        if (typeof prop === "string" && prop.trim() !== "") {
          if (card.front === "") {
            card.front = prop.trim()
            continue
          } else if (prop.trim() !== card.front) {
            card.back = prop.trim()
            continue
          } else if (prop.trim() === card.front) {
            continue
          } else {
            return false;
          }
        } else {
          continue
        }
      }
    }
    if (card.front === "" || card.back === "") {
      return false;
    }
  }
  if ( card.front !== "" && card.back !== "" && card.front !== card.back){
    return card
  } else { return false }
}
export const getStringPropsFromArr = (arr) => {
  const deck = [];
  for (let i in arr) {
    let jsonObj = arr[i];
    if (jsonObj !== null && typeof jsonObj === "object") {
      const card = Object.keys(jsonObj).length >= 1 ? getStringProps(jsonObj) : false;
      if (card && card.front !== "" && card.back !== "") {
        deck.push(card)
      }
    }
  }

  return deck;
}
export const useFocus = () => {
  const htmlElRef = useRef(null)
  const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

  return [htmlElRef, setFocus]
}
