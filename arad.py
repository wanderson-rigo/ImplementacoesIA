import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import tkinter as tk
from tkinter import ttk

# Criar um grafo vazio
G = nx.Graph()

# Adicionar as arestas e os pesos
edges = [
    ("Arad", "Zerind", 75),
    ("Arad", "Sibiu", 140),
    ("Arad", "Timisoara", 118),
    ("Zerind", "Oradea", 71),
    ("Oradea", "Sibiu", 151),
    ("Timisoara", "Lugoj", 111),
    ("Lugoj", "Mehadia", 70),
    ("Mehadia", "Dobreta", 75),
    ("Dobreta", "Craiova", 120),
    ("Craiova", "Rimnicu Vilcea", 146),
    ("Craiova", "Pitesti", 138),
    ("Rimnicu Vilcea", "Sibiu", 80),
    ("Rimnicu Vilcea", "Pitesti", 97),
    ("Sibiu", "Fagaras", 99),
    ("Fagaras", "Bucharest", 211),
    ("Pitesti", "Bucharest", 101),
    ("Bucharest", "Giurgiu", 90),
    ("Bucharest", "Urziceni", 85),
    ("Urziceni", "Hirsova", 98),
    ("Hirsova", "Eforie", 86),
    ("Urziceni", "Vaslui", 142),
    ("Vaslui", "Iasi", 92),
    ("Iasi", "Neamt", 87),
]

# Adicionar as arestas ao grafo
G.add_weighted_edges_from(edges)

# Definir as posições dos nós
pos = nx.spring_layout(G, seed=42)

# Função para atualizar as cores e tamanhos dos nós
def update_node_colors_and_sizes(current_node):
    node_colors = []
    node_sizes = []

    for node in G.nodes:
        if node == current_node:
            node_colors.append("green")  # Nó atual destacado
            node_sizes.append(3000)  # Tamanho maior para o nó atual
        elif node in ["Arad", "Bucharest"]:
            node_colors.append("orange")  # Cor diferente para os nós destacados
            node_sizes.append(3000)  # Tamanho maior para os nós destacados
        else:
            node_colors.append("lightblue")  # Cor padrão
            node_sizes.append(2000)  # Tamanho padrão

    return node_colors, node_sizes

# Função para desenhar o grafo
def draw_graph():
    ax.clear()  # Limpar o eixo
    node_colors, node_sizes = update_node_colors_and_sizes(current_node)
    nx.draw(G, pos, with_labels=True, node_size=node_sizes, node_color=node_colors, font_size=10, font_weight="bold", ax=ax)
    labels = nx.get_edge_attributes(G, 'weight')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=labels, font_size=6, font_color="red", ax=ax)
    canvas.draw()

# Função chamada ao clicar em "Next"
def next_node():
    global current_node
    selected_node = combo_box.get()  # Nó selecionado no dropdown
    if selected_node:
        node_stack.append(current_node)
        current_node = selected_node
        draw_graph()
        update_dropdown()

# Função chamada ao clicar em "Previous"
def previous_node():
    global current_node
    if len(node_stack) > 1:
        current_node = node_stack.pop()  # Volta para o nó anterior
        draw_graph()
        update_dropdown()

# Função para atualizar o dropdown com os vizinhos do nó atual
def update_dropdown():
    neighbors = list(G.neighbors(current_node))
    combo_box['values'] = neighbors  # Atualizar as opções do combobox
    if neighbors:
        combo_box.set(neighbors[0])  # Seleciona o primeiro vizinho por padrão

# Configurar a interface gráfica com Tkinter
root = tk.Tk()
root.title("Navegação no Grafo")

# Configurar a figura do Matplotlib
fig, ax = plt.subplots(figsize=(6, 4))
canvas = FigureCanvasTkAgg(fig, master=root)  # Adicionar a figura ao Tkinter
canvas.get_tk_widget().pack(side=tk.TOP, fill=tk.BOTH, expand=1)

# Criar um frame para centralizar os botões e o combobox no topo
button_frame = tk.Frame(root)
button_frame.pack(side=tk.TOP, pady=10)

# Botão Previous
btn_prev = tk.Button(button_frame, text="Previous", command=previous_node)
btn_prev.pack(side=tk.LEFT, padx=5)

# Combobox para seleção dos vizinhos
combo_box = ttk.Combobox(button_frame)
combo_box.pack(side=tk.LEFT, padx=5)

# Botão Next
btn_next = tk.Button(button_frame, text="Next", command=next_node)
btn_next.pack(side=tk.LEFT, padx=5)

# Iniciar na cidade "Arad"
current_node = "Arad"
node_stack = [current_node]  # Para guardar o histórico dos nós visitados

# Desenhar o grafo e configurar o dropdown
draw_graph()
update_dropdown()

root.mainloop()