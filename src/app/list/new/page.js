// New list page Version - 0.0.1 (No intentional mobile or tablet support)
'use client'

import { ListOptionsContainer, ListContainer, ListTitleBlock, NewListItemBlock, ListItemBlock } from '../components';
import React, { useState, useEffect } from 'react';
import styles from '../components.module.css';
import axios from 'axios';

export default function App() {
    // List Options Section - Save, Load, etc.
    function handleSaveClick() {
        console.log(listTitle, items)

        const list = {
            title: listTitle,
            item: items,
            description: 'none yet'
        }

        axios.post('../.netlify/functions/saveList', {list, user}, { withCredentials: true })
            .then(response => {
                console.log(response.data)
            }) 
            .catch(error => {
                console.error(error)
            })
    }

    function handleLoadClick() {
        console.log('Load clicked')
    }

    // List Section - Title, Items, etc.
    const [listTitle, setListTitle] = useState('');
    const [items, setItems] = useState([])

    function addItem() {
        const item = {
            id: Math.floor(Math.random() * 10000),
            value: '',
            completed: false
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
            oldList.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
        );
        target.classList.toggle(styles.completed)
    }

    function handleTitleChange(e) {
        setListTitle(e.target.value)
    }

    const [user, setUser] = useState({});
    useEffect(() => {
        function validateUserToken() {
            axios.get('../.netlify/functions/verifyToken', { withCredentials: true })
                .then((response) => {
                    // Valid token - redirect to dashboard or perform actions
                    console.log('Token Authenticated, hello ' + response.data.username);
                    let userData = {
                        username: response.data.username,
                        email: response.data.email,
                        id: response.data.id
                    }

                    setUser(userData)

                    // Initiate a function call to retrieve the user's lists to display on dashboard

                })
                .catch((error) => {
                    // Not a valid token - handle the error
                    console.error('Error from server:', error);
                });
        }

        validateUserToken();
    }, []);

    return (
        <div className="list-box">
            <ListOptionsContainer handleSaveClick={() => handleSaveClick()}/>
            <ListContainer>
                <ListTitleBlock onChange={(e) => handleTitleChange(e)}/>
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
