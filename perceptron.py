# Simulação do treinamento de um Perceptron para a função AND
import numpy as np

# Definindo a função step (degrau)
def step_function(z):
    return 1 if z >= 1 else 0

# Função para treinar o perceptron
def train_perceptron(learning_rate, max_epochs, inputs, outputs):

    # Pesos iniciais
    w = [0.6 , 0.6]

    for epoch in range(max_epochs):
        global_error = 0
        print(f"\n ****************** Época {epoch + 1}: ******************")

        for x, y_real in zip(inputs, outputs):
            # Calcula a soma ponderada z
            z = x[0] * w[0]     +     x[1] * w[1]
            y_pred = step_function(z)

            # Imprime os cálculos detalhados, incluindo as multiplicações
            print(f"\nEntrada: {x}")
            print(f"Pesos: {w}")
            # saida esperada
            print(f"Saida esperada: {y_real}")

            # Mostrando os números que estão sendo multiplicados para calcular z numa só expressão
            print(f"\nCálculos detalhados:")
            print(f"z = x1 * w1 + x2 * w2")
            print(f"z (soma ponderada) = {x[0]} * {w[0]} + {x[1]} * {w[1]} = {z}")

            # Calcula o erro
            error = y_real - y_pred
            print(f"Saída esperada: {y_real}, Saída obtida: {y_pred}, Erro: {error}")

            # se o erro for diferente de 0 deve atualizar os pesos
            if error != 0:
                # Imprima os calculos da atualização dos pesos para x1 e x2
                print(f"\nErro detectado! Atualizar pesos via w = η * erro * x")
                print(f"w1 = {w[0]} + {learning_rate} * ({y_real} - {y_pred}) * {x[0]} = {w[0] + learning_rate * (y_real - y_pred)* x[0]}")
                print(f"w2 = {w[1]} + {learning_rate} * ({y_real} - {y_pred}) * {x[1]} = {w[1] + learning_rate * (y_real - y_pred) * x[1]}")

                # Atualiza os pesos
                w_update = learning_rate * error * x

                # Mostrando a atualização dos pesos
                print(f"Atualização dos pesos: w1 de {w[0]} para {w[0] + w_update[0]}")
                print(f"Atualização dos pesos: w2 de {w[1]} para {w[1] + w_update[1]}")
                w = w + w_update
                print(f"Novos pesos: {w}")

            # Soma o erro global (absoluto)
            global_error += abs(error)

        print(f"Erro global da época {epoch + 1}: {global_error}\n")

        # Verifica se não há mais erro (convergência)
        if global_error == 0:
            print(f"Convergência atingida na época {epoch + 1}")
            break

    return w, epoch + 1


# Entradas (com x1, x2)
inputs = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])

# Saídas esperadas para a operação AND
outputsAND = np.array([0, 0, 0, 1])

# Saídas esperadas para a operação AND
outputsOR = np.array([0, 1, 1, 1])

# eta(η) é a letra grega que representa a taxa de aprendizado
eta = 0.5

# Número máximo de épocas
max_epochs = 10

# Treinamento do perceptron
final_weights, epochs_taken = train_perceptron(eta, max_epochs, inputs, outputsOR)

# Mostrar os pesos finais e número de épocas
print(f"Os pesos finais são: {final_weights}")
print(f"O treinamento durou {epochs_taken} épocas")