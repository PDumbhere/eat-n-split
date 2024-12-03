import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelection(friend) {
    // selectedFriend && friend.id === selectedFriend.id
    //   ? setSelectedFriend(null)
    //   : setSelectedFriend(friend);

    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend)); // here we have used optional chain
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
    // setSelectedFriend(null);
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    console.log(value);

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  // const isSelected = selectedFriend && friend.id === selectedFriend.id;
  const isSelected = friend.id === selectedFriend?.id; // we have used optional chain
  return (
    <li className={isSelected && "selected"}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByuser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const friendExpense = bill ? bill - paidByuser : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByuser) return;
    onSplitBill(whoIsPaying === "user" ? friendExpense : -friendExpense);
  }
  return (
    <div>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split Bill with {friend.name}</h2>

        <label>💰 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>🧍‍♀️ Your expense</label>
        <input
          type="text"
          value={paidByuser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByuser
                : Number(e.target.value)
            )
          }
        />

        <label>👫 {friend.name}'s expense</label>
        <input type="text" value={friendExpense} disabled />

        <label>Who is paying the bill</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">you</option>
          <option value="Friend">{friend.name}</option>
        </select>
        <Button>Split Bill</Button>
        <Button
          onClick={() => {
            setBill("");
            setPaidByUser("");
            setWhoIsPaying("user");
          }}
        >
          Reset
        </Button>
      </form>
    </div>
  );
}
