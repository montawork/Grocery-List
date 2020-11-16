import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(list);
  }
  return [];
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  });

  const hundleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setAlert({
        show: true,
        msg: 'empty values are not allowed, please enter valid value',
        type: 'danger',
      });
      setTimeout(() => {
        setAlert({ show: false });
      }, 2000);
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setIsEditing(false);
      setEditID(null);
      setAlert({ show: true, msg: 'update successfully', type: 'success' });
      setTimeout(() => {
        setAlert({ show: false });
      }, 2000);
    } else {
      setAlert({ show: true, msg: 'added successfully', type: 'success' });
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
      };
      setTimeout(() => {
        setAlert({ show: false });
      }, 2000);
      setList([...list, newItem]);
      setName('');
    }
  };

  const clearList = () => {
    setAlert({ show: true, msg: 'cleared !!', type: 'danger' });
    setTimeout(() => {
      setAlert({ show: false });
    }, 2000);
    setList([]);
  };

  const removeItem = (id) => {
    setAlert({ show: true, msg: 'removed !!', type: 'danger' });
    setTimeout(() => {
      setAlert({ show: false });
    }, 2000);
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const newItem = list.find((item) => item.id === id).title;
    setIsEditing(true);
    setEditID(id);
    setName(newItem);
  };

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={hundleSubmit}>
        {alert.show && <Alert {...alert} />}
        <h3>grocery list</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'add'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
