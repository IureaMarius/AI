import math
import numpy as np
import random
import pandas as pd

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sigmoid(x): 
    return x * (1 - x)

def ReLU(x):
    return np.where(x>0,x,0.01*x)

def deriv_ReLU(x):
    x=np.where(x<=0,x,1)
    x=np.where(x>=0,x,0.01)
    return x

nr_of_iterations = 10000

data = pd.read_csv('in.csv')

npArray = data.values

trainInput = npArray[:,:2]


trainOutput = npArray[:, 2:]




class Layer:
    def __init__(self, n_inputs, n_neurons):
        self.weights = np.random.randn(n_inputs, n_neurons) * np.sqrt(1/(n_inputs + n_neurons)) 
        self.biases = np.random.randn(1, n_neurons)
    def forwardProp(self, inputs):
        self.output = np.dot(inputs, self.weights) + self.biases

class Sigmoid_Activation:
    def forward(self, inputs):
        self.output = sigmoid(inputs)

class LeakyReLU_Activation:
    def forward(self, inputs):
        self.output = ReLU(inputs)

layer1 = Layer(2, 2)
activation1 = Sigmoid_Activation()

layer2 = Layer(2, 1)
activation2 = Sigmoid_Activation()

print('startweights:')
print(layer1.weights)
print('l2:')
print(layer2.weights)

for iteration in range(nr_of_iterations):
    layer1.forwardProp(trainInput)
    activation1.forward(layer1.output)

    layer2.forwardProp(activation1.output)
    activation2.forward(layer2.output)

    output_error = trainOutput - activation2.output # error at output
    output_delta = output_error * deriv_sigmoid(activation2.output) # delta at output

    hiddenLayer_error = output_delta.dot(layer2.weights.T)
    hiddenLayer_delta = hiddenLayer_error * deriv_sigmoid(activation1.output)

    layer1.weights += trainInput.T.dot(hiddenLayer_delta)
    layer2.weights += activation1.output.T.dot(output_delta)
    layer1.biases = layer1.biases + hiddenLayer_delta
    layer2.biases = layer2.biases + output_delta


print(trainOutput)
print('output error')
output_error = trainOutput - activation2.output # error at output
print(output_error)
output_delta = output_error * deriv_sigmoid(activation2.output) # delta at output
print('output delta')
print(output_delta)

print('hiddenLayer_error')
hiddenLayer_error = output_delta.dot(layer2.weights.T)
print(hiddenLayer_error)
print('hiddenLayer_delta')
hiddenLayer_delta = hiddenLayer_error * deriv_sigmoid(activation1.output)
print(hiddenLayer_delta)

print('output actual')
print(trainOutput)
print('output prediction')
print(activation2.output)


