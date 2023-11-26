// New list page Version - 0.0.1 (No intentional mobile or tablet support)
'use client'

import { ListOptionsContainer, ListContainer, ListTitleBlock, NewListItemBlock, ListItemBlock, LoadListModal } from '../components';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import styles from '../components.module.css';
import axios from 'axios';

export default function App() {
    const router = useRouter()
    const [lists, setLists] = useState([])
    const[showLoadListModal, setShowLoadListModal] = useState(false)

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
        setShowLoadListModal(true)
    }

    function handleLoadListModalClose(e) {
        if (e.target.id === "loadListModalBox" || e.target.id === "loadListModalCloseButton") {
            setShowLoadListModal(false)
        }
    }

    async function loadList(e) {
        const listId = parseInt(e.target.dataset.listid)

        await axios.post('../.netlify/functions/loadList', { listId: listId })
            .then(response => {
                const list = response.data.list
                console.log(list)
                setListTitle(list.title)
                setItems(list.items)
            })
            .catch(error => {
                console.error(error)
            })
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
        async function getLists(userId) {
            await axios.post('../.netlify/functions/retrieveUserLists', { userId: userId })
                .then(response => {
                    setLists(response.data);
                })
                .catch(error => {
                    console.error(error)
                })
        }

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

                    getLists(userData.id)

                })
                .catch((error) => {
                    // Not a valid token - handle the error
                    console.error('Error from server:', error);
                    router.push('../sign-in')
                });
        }

        validateUserToken();
    }, []);

    return (
        <div className="list-box">
            {showLoadListModal ? <LoadListModal closeModal={(e) => handleLoadListModalClose(e)}
                lists={lists} loadList={(e) => loadList(e)} /> : null}
            <ListOptionsContainer handleSaveClick={() => handleSaveClick()} handleLoadClick={() => handleLoadClick()}/>
            <ListContainer>
                <ListTitleBlock title={listTitle} onChange={(e) => handleTitleChange(e)}/>
                {items.map(item => {
                    return (
                        <ListItemBlock
                            value={item.value}
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
