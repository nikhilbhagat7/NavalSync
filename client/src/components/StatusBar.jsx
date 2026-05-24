const StatusBar = ( {turn, status, winner} ) => {
  return (
    <section>
      <h3>Turn : {turn}</h3>
      {status==="game over" ? <h2>GAME OVER!</h2> : <h3>Status : {status}</h3>}
      {winner ? <h1>Winner: {winner}</h1> : null}
    </section>
  )
};

export default StatusBar;