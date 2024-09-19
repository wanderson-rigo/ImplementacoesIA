import numpy as np
import matplotlib.pyplot as plt

class Perceptron:
    def __init__(self, epocas=100, taxa_aprendizagem=0.05):
        self.epocas = 100
        self.taxa_aprendizagem = 0.05
        self.pesos = None  # Inicializa os pesos como None

    def __step_function(self, entradas):
        soma_ponderada = np.dot(entradas, self.pesos[1:]) + self.pesos[0]
        return 1 if soma_ponderada > 0 else 0

    def testar(self, entradas):
        if self.pesos is None:
            raise ValueError("Modelo não treinado. Treine o modelo antes de testar.")
        return self.__step_function(entradas)

    def treinar(self, X, y):
        # Inicializa os pesos com valores aleatórios
        self.pesos = np.random.uniform(-1, 1, X.shape[1] + 1)
        mse_ = []

        for epoca in range(self.epocas):
            previsoes = []
            erros = 0

            for entradas, esperado in zip(X, y):
                previsao = self.__step_function(entradas)
                erro = esperado - previsao
                
                # Atualiza os pesos
                self.pesos[1:] += self.taxa_aprendizagem * erro * entradas
                self.pesos[0] += self.taxa_aprendizagem * erro

                erros += abs(erro)
                previsoes.append(previsao)

            # Calcula o MSE após todas as previsões
            MSE = np.square(np.subtract(y, previsoes)).mean()
            mse_.append(MSE)
            print(f'Época -> {epoca + 1}, MSE -> {MSE}')

            # Para se não houver erros
            if erros == 0:
                print(f'\nTreinamento finalizado com os seguintes \npesos -> {self.pesos}')
                break
        
        # Plota o gráfico de MSE após o treinamento
        plt.plot(range(1, len(mse_) + 1), mse_, marker='o')
        plt.title('Gráfico de Erros por Época de Treinamento')
        plt.xlabel('Época')
        plt.ylabel('MSE')
        plt.show()

# Exemplo de uso
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])

p = Perceptron()
p.treinar(X, y)

print('\nResultados')
for i in range(X.shape[0]):
    print(f'Entrada -> {X[i]}, Esperado -> {y[i]}, Resultado -> {p.testar(X[i])}')