import React, { useState, useEffect } from 'react';

const FilterCardsMenu = (props) => {
  const [deck, setDeck] = useState([]);
  const [activeCards, setActiveCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  useEffect(() => {
    const oldDeck = props.deck;
    setDeck(oldDeck);
    console.log("oldDeck (CardSelect.js 11): "+JSON.stringify(oldDeck));
    const [active, inActive] = oldDeck.reduce(
      ([activeArr, inActiveArr], card) => (card.active ? [[...activeArr, card], inActiveArr] : [activeArr, [...inActiveArr, card]]), [[], []]
    );
    // const active = oldDeck.filter(card => { return card.active === true });
    // const inActive = oldDeck.filter(card => { return card.active === false });
    setActiveCards(active);
    setFilteredCards(inActive)

  }, [props.deck])
  const resetFilter = () => {
    const d = props.deck;
    const reset = d.map(obj => ({ ...obj, active: true }))
    setDeck(reset);
    setFilteredCards([]);
    setActiveCards(reset);
  }
  useEffect(() => {
    props.sendFilterStatus(filterActive)
    props.sendFilteredCards(filteredCards);
    props.sendActiveCards(activeCards);
  }, [filteredCards, filterActive, setFilterActive, props, activeCards])

  const handleChange = (event) => {
    const id = JSON.parse(event.target.name);
    const oD = deck;
    const status = oD.find(item => { return item.id === id }).active;
    const nD = oD.map(item => item.id === id ? { ...item, active: !status } : item);
    const fC = nD.filter(item => { return item.active === false });
    const aC = nD.filter(item => { return item.active === true });
    if (fC.length === nD.length) {
      return alert("It's supposed to be a FILTER, not a WALL--maybe don't select EVERY SINGLE CARD?!");
    }
    setDeck(nD);
    setActiveCards(aC);
    setFilteredCards(fC)
    if (filterActive) {
      props.sendFilteredCards(filteredCards)
      props.sendActiveCards(activeCards);
    }
    props.sendUpdatedDeck(nD);

  }

  const showOrHide = props.show ? "display-block" : "display-none";
  return (
    <div className={showOrHide}>
      <button onClick={() => setFilterActive(!filterActive)}>{filterActive ? "Disable Filter" : "Enable Filter"}</button>
      <div className="card__select">
        <ul className="active__cards__filter">
          {activeCards.map(card => (
            <li key={card.id}>
              <input name={card.id} type="checkbox" checked={card.active} onChange={handleChange}></input>
              <div className="active__card"> {card.front} / {card.back}, id: {card.id} </div>
            </li>
          ))}
        </ul>
        <ul className="inactive__cards__filter">
          {filteredCards.map(card => (
            <li key={card.id}>
              <input name={card.id} type="checkbox" checked={card.active} onChange={handleChange}></input>
              <div className="inactive__card">{card.front} / {card.back}, id: {card.id} </div>
            </li>
          ))}
        </ul>
        <div className="reset__filter__div">
          <button className="reset__filter__button" onClick={resetFilter}>Reset Filter<br></br>(activates all cards)</button>
        </div>
      </div>
    </div>
  )
}
export default FilterCardsMenu;