function GameOfLife () {
  const numRows = 64
  const numCols = 64
  const grid = Array(numRows).fill(0).map(() => Array(numCols).fill(0))
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "fit-content",
          margin: "0 auto"
        }}>
        {grid.map((row, i) =>
          row.map((k) => (
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "#AAAAAA" : undefined,
                border: "1px solid #123456"
              }}></div>
        )))}
      </div>
    </>
  )
}

export default GameOfLife