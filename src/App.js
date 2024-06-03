import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0
  }
];

export default function App() {
  const [friends, setFriend] = useState(initialFriends);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState(null);
  // const [addFriends, SetAddFriends] = useState([]);

  function addNewFriends(friend) {
    setFriend((friends) => [...friends, friend]);
    setShowAddFriends(!showAddFriends);
  }

  function handleSelection(friend) {
    // setSelectedFriends(friend);
    setSelectedFriends((selected) =>
      selected?.id === friend.id ? null : friend
    );

    setShowAddFriends(false);
    // );
    // }
  }

  function handleSplitBill(val) {
    setFriend((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriends.id
          ? { ...friend, balance: friend.balance + val }
          : friend
      )
    );
    console.log(val);
    setSelectedFriends(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriends={selectedFriends}
        />

        {showAddFriends && (
          <FormAddFreind
            onSubmitForm={addNewFriends}
            show={showAddFriends}
            selectedFriends={selectedFriends}
            // ended={setShowAddFriends}
          />
        )}

        <ButtonSelect onClick={() => setShowAddFriends(!showAddFriends)}>
          {showAddFriends ? "Close" : "Add Friend"}
        </ButtonSelect>
      </div>
      {selectedFriends && (
        <FormSplitBill
          selectedFriends={selectedFriends}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, handleSelection, selectedFriends }) {
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friends={el}
          key={el.id}
          selectedFriends={selectedFriends}
          handleSelection={handleSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friends, handleSelection, selectedFriends }) {
  const isSelected = selectedFriends?.id === friends.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friends.image} alt={friends.name} />
      <h3>{friends.name} </h3>

      {friends.balance < 0 && (
        <p className="red">
          You owe {friends.name} {Math.abs(friends.balance)}
        </p>
      )}
      {friends.balance > 0 && (
        <p className="green">
          You owe {friends.name} {Math.abs(friends.balance)}
        </p>
      )}
      {friends.balance === 0 && <p>You and {friends.name} are even</p>}

      <ButtonSelect onClick={() => handleSelection(friends)}>
        {isSelected ? "Close" : "Select"}
      </ButtonSelect>
    </li>
  );
}

function FormAddFreind({ onSubmitForm }) {
  const [currentName, setCurrentName] = useState("");
  const [currentIMG, setCurrentIMG] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!currentName || !currentIMG) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: currentName,
      image: `${currentIMG}?=${id}`,
      balance: 0
    };
    console.log(newFriend);
    onSubmitForm(newFriend);

    setCurrentIMG("https://i.pravatar.cc/48");
    setCurrentName("");
  }
  return (
    <form form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />

      <label>🌄 Image URL </label>
      <input
        type="text"
        value={currentIMG}
        onChange={(e) => setCurrentIMG(e.target.value)}
      />

      <ButtonSelect>Add Friend</ButtonSelect>
    </form>
  );
}

function ButtonSelect({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectedFriends, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const paidByFriend = bill ? bill - paidBy : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidBy) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidBy);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriends.name}</h2>

      <label>💰 Bill value </label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👦 Your expense </label>
      <input
        type="text"
        value={paidBy}
        onChange={(e) =>
          setPaidBy(
            Number(e.target.value) > bill ? paidBy : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {selectedFriends.name}'s expense </label>
      <input type="text" disabled value={paidByFriend} />

      <label>💲 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriends.name}</option>
      </select>

      <ButtonSelect>Split bill</ButtonSelect>
    </form>
  );
}
