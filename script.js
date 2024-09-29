const board = document.getElementById("game-board");
const tiles = Array.from(document.querySelectorAll(".tile"));
let emptyTile = document.getElementById("empty-tile");
let moveCount = 5000; // Iniciar com o número máximo de movimentos permitidos
const resetBtn = document.getElementById("reset-btn");
const gameOverMessage = document.getElementById("game-over-message"); // Elemento para a mensagem de fim de jogo

document.getElementById("move-count").textContent = moveCount;

// Função para verificar se a peça clicada está adjacente ao espaço vazio
function isAdjacent(tile) {
  const emptyIndex = tiles.indexOf(emptyTile);
  const tileIndex = tiles.indexOf(tile);

  const adjacentIndices = [
    emptyIndex - 1, // esquerda
    emptyIndex + 1, // direita
    emptyIndex - 3, // acima
    emptyIndex + 3  // abaixo
  ];

  return adjacentIndices.includes(tileIndex);
}

// Função para trocar as peças
function swapTiles(tile) {
  const emptyIndex = tiles.indexOf(emptyTile);
  const tileIndex = tiles.indexOf(tile);

  // Troca as peças no array
  [tiles[emptyIndex], tiles[tileIndex]] = [tiles[tileIndex], tiles[emptyIndex]];

  // Atualiza a posição no tabuleiro
  board.innerHTML = '';
  tiles.forEach(tile => board.appendChild(tile));
}

// Função para embaralhar o tabuleiro
function shuffleBoard() {
  for (let i = 0; i < 100; i++) {
    const adjacentTiles = tiles.filter(isAdjacent);
    const randomTile = adjacentTiles[Math.floor(Math.random() * adjacentTiles.length)];
    swapTiles(randomTile);
  }
}

// Função para verificar se o jogador venceu
function checkWin() {
  const currentOrder = tiles.map(tile => tile.textContent.trim()); // Obter o conteúdo de cada peça
  const winningOrder = ["1", "2", "3", "4", "5", "6", "7", "8", ""]; // Ordem vencedora

  // Verifica se todas as peças estão na ordem correta, inclusive o espaço vazio no final
  const isCorrectOrder = currentOrder.every((content, index) => content === winningOrder[index]);

  if (isCorrectOrder) {
    // Disparar confete ao vencer
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Exibir a mensagem "Você venceu!"
      gameOverMessage.textContent = "Você venceu!";
      gameOverMessage.style.display = 'block';
    }, 100);
    disableGame(); // Desativa o jogo ao vencer
  }
}

// Função que conta os movimentos
function decrementMoveCount() {
  moveCount--; // Decrementa o contador de movimentos
  document.getElementById("move-count").textContent = moveCount;

  // Verifica se o jogador atingiu o limite de movimentos (0 movimentos)
  if (moveCount <= 0) {
    gameOverMessage.textContent = "PERDEU MANINHO!";
    gameOverMessage.style.display = 'block'; // Mostra a mensagem de derrota
    disableGame();
  }
}

// Função para desativar o jogo
function disableGame() {
  tiles.forEach(tile => {
    tile.removeEventListener("click", handleTileClick);
  });
}

// Função que lida com o clique nas peças
function handleTileClick() {
  if (isAdjacent(this)) {
    swapTiles(this);
    decrementMoveCount();
    checkWin();
  }
}

// Função para reativar o jogo
function enableGame() {
  gameOverMessage.style.display = 'none'; // Esconde a mensagem de fim de jogo ao reiniciar
  tiles.forEach(tile => {
    tile.addEventListener("click", handleTileClick);
  });
}

// Função para reiniciar o jogo
function resetGame() {
  moveCount = 50; // Reiniciar com o número máximo de movimentos
  document.getElementById("move-count").textContent = moveCount;
  shuffleBoard(); // Embaralhar o tabuleiro novamente
  enableGame(); // Reativar o jogo
}

// Adiciona evento de clique ao botão de reiniciar
resetBtn.addEventListener("click", resetGame);

// Evento de clique para movimentar as peças
tiles.forEach(tile => {
  tile.addEventListener("click", handleTileClick);
});

// Embaralha o tabuleiro no início do jogo
shuffleBoard();
