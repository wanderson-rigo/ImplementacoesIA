import networkx as nx
import matplotlib.pyplot as plt

# Criando um grafo vazio
G = nx.Graph()

# Adicionando nós (nós podem ter rótulos)
G.add_node(1, label='A')
G.add_node(2, label='B')
G.add_node(3, label='C')
G.add_node(4, label='D')
G.add_node(5, label='E')

# Adicionando arestas com pesos
G.add_edge(1, 2, weight=4)
G.add_edge(1, 3, weight=1)
G.add_edge(2, 3, weight=2)
G.add_edge(2, 4, weight=5)
G.add_edge(3, 5, weight=3)

# Desenhando o grafo com rótulos e pesos
pos = nx.spring_layout(G)  # Layout do grafo

# Desenha os nós com rótulos
nx.draw_networkx_nodes(G, pos, node_size=700)
nx.draw_networkx_labels(
    G, pos, labels=nx.get_node_attributes(G, 'label'))

# Desenha as arestas com os pesos
nx.draw_networkx_edges(G, pos)
nx.draw_networkx_edge_labels(
    G, pos, edge_labels=nx.get_edge_attributes(G, 'weight'))

# Mostra o grafo
plt.show()
