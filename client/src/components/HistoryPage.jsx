import { useState, useEffect } from "react";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/history")
      .then(res => res.json())
      .then(data => {
        setHistory(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>Global History</h2>
      {history.map((match) => (
        <div key={match._id}>
          <p>Players: {match.players.join(" vs ")}</p>
          <p>Winner: {match.winner}</p>
          <p>Played: {new Date(match.playedAt).toLocaleString()}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;