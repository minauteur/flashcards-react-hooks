// import from ';
import React, { useState, useEffect, useCallback } from 'react';
import SaveLoad from './SaveLoad';
import AddCard from './AddCard';
import FilterCardsMenu from './CardSelect'
import useKeyboardShortcut from './Hotkeys'
import Card from './Card'

const nextStyle = {
  marginRight: "5px",
  display: "inline",
  float: "right"
}
const prevStyle = {
  marginLeft: "5px",
  display: "inline",
  float: "left"
}
const flipStyle = {
  display: "inline",
  marginLeft: "-1.75rem"
}
const divStyle = {
  width: "auto",
  textAlign: "center"
}
const formButtons = {
  margin: "0px"
}

const initialDeck = [
  { front: "front #1", back: "back #1", active: true, id: 0 },
  { front: "front #2", back: "back #2", active: true, id: 1 },
  { front: "front #3", back: "back #3", active: true, id: 2 }
];




function App() {
  const [, setCardsAdded] = useState(0);
  const [globalIdCounter, setGlobalIdCounter] = useState(3);
  // const [state, dispatch] = useReducer(flashCardAppReducer, initialState)
  const [flipped, setFlipped] = useState(false);
  const [activeCards, setActiveCards] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [filteredCards, setFilteredCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [deck, setDeck] = useState(initialDeck);
  const [activeCard, setActiveCard] = useState({ front: "sample", back: "sample" });
  const [showCardForm, setShowCardForm] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const nextKey = ["ArrowRight"];
  const prevKey = ["ArrowLeft"];
  const upKey = ["ArrowUp"];
  const downKey = ["ArrowDown"];
  const haveCards = filtered ? (activeCards.length > 0 ? true : false) : (deck.length > 0 ? true : false);

  useEffect(() => {
    const snapshot = Array.from(deck);
    if (snapshot !== []) {
      setGlobalIdCounter(snapshot.length)
    } else if (filtered) {

      const count = activeCards.length + filteredCards.length;
      setGlobalIdCounter(count);
    } else if (!filtered && snapshot === []) {
      setGlobalIdCounter(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCards.length, filteredCards.length, deck.length])
  const getFormData = (options) => {
    switch (options.operation) {
      case "edit":
        var editedDeck = [];
        if (deck.length > 0) {
          editedDeck = Array.from(deck);
          editedDeck.map(item => { 
            if (item.id === options.data.id) {
               return Object.assign(item, options.data) 
            } else return item 
          })
        } else { editedDeck = [options.data] }
        setDeck(editedDeck);
        break
      case "add":
        const addedDeck = Array.from(deck);
        addedDeck.concat(options.data);
        setDeck(prevDeck => prevDeck.concat(options.data));
        break
      default:
        throw new Error(`Unhandled operation: ${options.operation}`);
    }
  }

  const shuffleDeck = () => {
    const newDeck = [];
    for (let i = 0; i < deck.length; i++) {
      const rand = Math.floor(Math.random() * (i + 1));
      newDeck[i] = newDeck[rand];
      newDeck[rand] = deck[i];
    }
    setDeck(newDeck);
  }
  const getChildInputStatus = (status) => {
    setInputActive(status);
  }
  const getFilterStatus = (status) => {
    setFiltered(status)
  }
  const getFilteredCards = (cards) => {
    setFilteredCards(cards)
  }
  const getActiveCards = (cards) => {
    setActiveCards(cards);
  }
  const getUpdatedDeck = (newDeck) => {
    setDeck(newDeck);
  }
  const sendNextId = (n) => {
    if (!n) {
      if (deck !== [] && !filtered) {
        const len1 = deck.length;
        setGlobalIdCounter(len1);
      } else if (filtered) {
        const len = activeCards.length + filteredCards.length;
        setGlobalIdCounter(len);
      }
    } else {
      if (n) {
        setGlobalIdCounter(n);
      }
    }
  }

  const loadCallback = (options) => {
    const op = options.operation;
    const data = options.data;
    switch (op) {
      case "add":
        const d = data;
        const old = Array.from(deck);
        const addedCount = d.length;
        const pre = [...old, ...d]
        // check for active cards. If there aren't any, set "active": true for the first card we add in case the filter is enabled
        let allFiltered = pre.filter(card => card.active === true ).length !== 0 ? false:true;
        const addedDeck = pre.map((obj, i) => {
          if (obj.hasOwnProperty("active") && !allFiltered) {
            Object.assign(obj, {
              active: obj.active,
              id: i
            })
          } else {
            Object.assign(obj, {
              active: true,
              id: i
            })
            // if there aren't any active cards, we just assign active.
            // the first card we added, now we know we have at least one active card, so we can set allFiltered to false.
            allFiltered = false;
          }

          return obj;
        });

        setCardsAdded(addedCount)
        setDeck(addedDeck);
        break
      case "replace":
        const r = data;
        const replaceCount = r.length;
        const mapped = r.map((obj, i) => {
          Object.assign(obj, {
            active: true,
            id: i
          })

          return obj;
        })
        setCardsAdded(replaceCount);
        setDeck(mapped)
        break
      default:
        throw new Error(`Unhandled operation: ${options.operation}`);
    }
  }

  const nextCard = () => {
    if ((index + 1) === deck.length) {
      setIndex(0);
    } else {
      setIndex(index + 1)
    }
  }

  const prevCard = () => {
    const len = filtered ? activeCards.length - 1 : deck.length - 1;
    if ((index - 1) >= 0) {
      setIndex(index - 1);
    } else {
      setIndex(len);
    }
  }
  const deleteDeck = useCallback(() => {
    setDeck([]);
    setGlobalIdCounter(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck])
  const handleNext = useCallback(key => {
    if (!inputActive) {
      setIndex(currentIndex => currentIndex + 1 === deck.length ? 0 : currentIndex + 1)
    }
  }, [setIndex, deck.length, inputActive]);

  const handlePrev = useCallback(key => {
    const len = filtered ? activeCards.length - 1 : deck.length - 1;
    if (!inputActive) {
      setIndex(currentIndex => currentIndex - 1 < 0 ? len : currentIndex - 1)
    }
  }, [filtered, setIndex, deck.length, inputActive, activeCards.length]);
  const handleFlip = useCallback(key => {
    if (!inputActive) {
      setFlipped(currently => !currently)
    }
  }, [setFlipped, inputActive]);
  useEffect(() => {
    if (!filtered) {
      const unFilteredActiveCard = (deck[index]);
      if (unFilteredActiveCard) {
        setActiveCard(unFilteredActiveCard);
      } else {
        setActiveCard(deck[0])
        setIndex(0);
      }
    } else {
      const filteredActiveCard = activeCards[index];
      if (filteredActiveCard) {
        setActiveCard(filteredActiveCard)
      } else {
        setActiveCard(activeCards[0]);
        setIndex(0);
      }
    }
  }, [filtered, index, deck, activeCards]);

  useKeyboardShortcut(nextKey, handleNext);
  useKeyboardShortcut(prevKey, handlePrev);
  useKeyboardShortcut(upKey, handleFlip);
  useKeyboardShortcut(downKey, handleFlip);
  const filterCardsClass = !showFilterMenu ? "filter__cards__hidden" : "filter__cards__show";
  const filterNotification = filtered ? "filter__active__notification" : "filter__inactive__notification";
  return (
    <div style={{ height: "100%", width: "100%", display: "block" }}>
      <div className={filterNotification}>
        <div
          onClick={() => setFlipped(!flipped)}
        >
          <Card flipped={flipped} show={haveCards} data={activeCard} />
        </div>
        <div style={divStyle}>

          <button onClick={() => prevCard()} style={prevStyle}>Previous Card</button>
          <button onClick={() => setFlipped(!flipped)} style={flipStyle}>{flipped ? "Flip to back" : "Flip to front"}</button>
          <button onClick={() => nextCard()} style={nextStyle}>Next Card</button>
        </div>
        <div className="menu__container">
          <div className="card__menu">
            <button onClick={() => setShowCardForm(!showCardForm)} style={formButtons}>
              {showCardForm ? "Hide" : "Show"} Card Input
				</button>
            <AddCard show={showCardForm} activeCard={activeCard} sendInputStatus={getChildInputStatus} sendFormData={getFormData} currentId={globalIdCounter} getNextId={sendNextId} cardsInDeck={filtered ? ((activeCards.length + filteredCards.length) > 0 ? true : false) : (deck.length > 0 ? true : false)} filterActive={filtered ? true : false} totalCards={filtered ? activeCards.length + filteredCards.length : deck.length} />
          </div><br></br>
          <div className="save__load">
            <button onClick={() => setShowSaveForm(!showSaveForm)} style={formButtons}>
              {showSaveForm ? "Hide" : "Show"} Save/Load Menu
				</button>
            <SaveLoad show={showSaveForm} sendLoadData={loadCallback} sendInputStatus={getChildInputStatus} activeDeck={filtered ? activeCards : deck} />
          </div><br></br><div className={filterCardsClass}>
            <button onClick={() => setShowFilterMenu(!showFilterMenu)}>{showFilterMenu ? "Hide" : "Show"} Filter Menu</button>
            <div>
              <FilterCardsMenu
                sendFilteredCards={getFilteredCards}
                sendActiveCards={getActiveCards}
                show={showFilterMenu}
                sendFilterStatus={getFilterStatus}
                filteredCards={filteredCards}
                activeCards={activeCards}
                deck={deck}
                sendUpdatedDeck={getUpdatedDeck}
              />
            </div>
          </div>
          <div className="delete__deck">
            <button className="delete__deck__button" onClick={() => {
              if (window.confirm("Do you really want to delete the whole deck?!")) {
                deleteDeck();
              }
            }}>Delete</button>
          </div>
          <div className="shuffle__deck">
            <button className="shuffle__deck__button" onClick={() => {
              if (window.confirm("Shuffle this deck?")) {
                shuffleDeck();
              }
            }}>Shuffle Deck</button>
          </div>
        </div>

        <div className="filter__status__container">
          <div className={filtered ? "filter__status" : "display-none"}>
            {
              filtered ? "CARD FILTER ACTIVE" : ""
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default App;




// const root = document.createElement('div');
// root.id = 'root';
// document.body.appendChild(root);
// const rootHandle = document.getElementById('root');
// reactDOM.render(<App />, document.getElementById('root'));
