import React, {useState, useEffect, useCallback, useReducer} from 'react';

// function flashCardAppReducer(state, action) {
// 	switch (action.type) {
// 		case 'next':
// 			const nextIdx = (state.index + 1) === state.activeDeck.length ? 0:state.index+1;
// 			return {index: newIndex, activeCard: state.activeDeck[newIndex]}
// 		case 'prev':
// 			const prevIdx = (state.index - 1) < 0 ? state.activeDeck.length-1:state.index-1;
// 			return {index: newIndex, activeCard: state.activeDeck[newIndex]}
// 		case 'flip':
// 			return {flipped: !state.flipped}
// 		case 'toggleCardForm':
// 			return {showCardForm: !state.showCardForm}
// 		case 'toggleSaveForm':
// 			return {showSaveForm: !state.showSaveForm}
// 		case 'addCard':
// 			const deckWithAddedCard = Array.from(state.activeDeck);
// 			deckWithAddedCard.push(action.data);
// 			return {activeDeck: deckWithAddedCard}
// 		case 'editCard':
// 			const deckWithEditedCard = Array.from(state.activeDeck);
// 			deckWithEditedCard[state.index] = action.data
// 			return {activeDeck: newDeck}
// 		case 'loadDeck':
// 			return {activeDeck: [...state.activeDeck,...action.data]}
// 		case 'replaceDeck':
// 			return {activeDeck: action.data}
// 		case 'updateActiveCard':
// 			const card = state.activeDeck[state.index]
// 			return updateActiveCard(card)
// 		default:
// 			throw new Error(`Unhandled type: ${action.type}`);
// 	}
// }