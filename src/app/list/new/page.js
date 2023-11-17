'use client'

import { ListOptionsContainer, ListContainer, ListTitleBlock, NewListItemBlock, ListItemBlock } from '../components';
import React, { useState } from 'react';
import styles from '../components.module.css';

export default function App() {
    const [items, setItems] = useState([])

    function addItem() {
        const item = {
            id: Math.floor(Math.random() * 10000),
            value: '',
            finished: false
        }

        setItems(oldList => [...oldList, item])
    }

    function deleteItem(id) {
        const newArray = items.filter(item => item.id !== id)
        setItems(newArray)
    }

    function handleChange(id, newValue) {
        setItems(oldList =>
            oldList.map(item => (item.id === id ? { ...item, value: newValue } : item))
        );
    }

    function handleCompleteClick(id, target) {
        setItems(oldList =>
            oldList.map(item => (item.id === id ? { ...item, finished: !item.finished } : item))
        );
        target.classList.toggle(styles.completed)
    }

    console.log(items)

    return (
        <div className="list-box">
            <ListOptionsContainer />
            <ListContainer>
                <ListTitleBlock/>
                {items.map(item => {
                    return (
                        <ListItemBlock
                            key={item.id}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                            onDeleteClick={() => deleteItem(item.id)}
                            onCompleteClick={(e) => handleCompleteClick(item.id, e.target)} />
                    )
                })}
                <NewListItemBlock onClick={() => addItem()} />
            </ListContainer>
        </div>
    )
}
