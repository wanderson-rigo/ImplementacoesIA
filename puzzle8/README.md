# 8-Puzzle com Inteligência Artificial

Este projeto implementa o jogo **8-Puzzle** utilizando algoritmos de busca em Inteligência Artificial para resolver o puzzle automaticamente. O usuário pode interagir manualmente com o jogo ou optar por resolver o puzzle usando os algoritmos **A\*** ou **Busca em Largura (BFS)**.

## Índice

- [Funcionalidades](#funcionalidades)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Testes](#testes)
- [Possíveis Melhorias Futuras](#possíveis-melhorias-futuras)
- [Licença](#licença)
- [Autor](#autor)

## Funcionalidades

- **Interação Manual**: O usuário pode clicar nas peças adjacentes ao espaço vazio para mover as peças e tentar resolver o puzzle manualmente.
- **Embaralhar o Tabuleiro**: Um botão para gerar um estado inicial aleatório e solucionável.
- **Estado Personalizado**: Permite que o usuário insira um estado personalizado para o tabuleiro.
- **Resolução Automática**:
  - **Algoritmo A\***: Utiliza a distância Manhattan como heurística para encontrar a solução ótima.
  - **Busca em Largura (BFS)**: Explora todos os estados possíveis em largura até encontrar a solução.
- **Visualização das Trocas**: Exibe um log das trocas realizadas, tanto manualmente quanto durante a resolução automática.
- **Métricas e Informações**:
  - Número de inversões e paridade do estado atual.
  - Distância Manhattan em relação ao estado meta.
  - Número de peças fora do lugar.
  - Número de jogadas realizadas.
  - Métricas dos algoritmos (tempo de execução, nós expandidos, profundidade da solução).

## Como Executar o Projeto

1. **Pré-requisitos**:
   - Um navegador web moderno (Chrome, Firefox, Edge, etc.).
   - Node.js e npm instalados (apenas se for executar testes automatizados com Jest).

2. **Clone ou Baixe o Repositório**:
```bash
git clone https://github.com/thalesfb/AI/puzzle8.git
```
Ou baixe o arquivo ZIP e extraia em uma pasta local.

3. **Abra o Arquivo `index.html`**: Navegue até a pasta do projeto e abra o arquivo `index.html` em seu navegador.

## Estrutura do Projeto

```plaintext
puzzle8/
├── css/
│ └── styles.css
├── js/ 
│ └── script.js
├── index.html
├── README.md
```

- **css/styles.css**: Estilos CSS para a interface do usuário.
- **js/script.js**: Lógica do jogo e implementação dos algoritmos de busca.
- **index.html**: Contém a estrutura HTML do jogo.
- **README.md**: Documentação do projeto.

## Como Usar

- **Movimentação Manual**:
Clique em uma peça adjacente ao espaço vazio para movê-la.
Observe as informações atualizadas, como o número de jogadas e peças fora do lugar.
- **Embaralhar o Tabuleiro**:
Clique em "Sortear Estado Inicial" para gerar um novo desafio.
- **Estado Personalizado**:
Insira uma sequência de números de 0 a 8 separados por vírgulas no campo apropriado.
Clique em "Definir Estado Personalizado" para atualizar o tabuleiro.
- **Resolução Automática**:
Clique em "Resolver com A*" ou "Resolver com BFS" para que o algoritmo resolva o puzzle.
O progresso e as trocas serão exibidos, juntamente com métricas de desempenho.

## **Testes**

- **Testes Manuais**: Interaja com o jogo para garantir que as funcionalidades funcionem conforme o esperado.
- **Testes Automatizados**: Ainda não implementados. Futuramente, podemos adicionar testes unitários utilizando frameworks como Jest para testar as funções JavaScript.

## **Possíveis Melhorias Futuras**

- Implementar testes automatizados para garantir a corretude dos algoritmos.
- Adicionar outros algoritmos de busca, como **Busca Gulosa** ou **Busca em Profundidade Limitada**.
- Melhorar a interface gráfica com animações mais suaves e feedback visual aprimorado.
- Otimizar o desempenho dos algoritmos para estados iniciais mais complexos.
- Adicionar suporte a dispositivos móveis com layout responsivos.

## **Licença**

Este projeto é de uso livre para fins educacionais e não possui uma licença específica.

## **Autor**

- **Thales Ferreira** - *Desenvolvedor* - [thalesfb](https://github.com/thalesfb)

