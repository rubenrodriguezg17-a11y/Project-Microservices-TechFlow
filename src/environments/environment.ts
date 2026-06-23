export const environment = {
  production: false,
  gateway: 'http://localhost:8082',
  
  identityService: 'http://localhost:9007', 
  
  services: {
    productos:  'http://localhost:8082',
    usuarios:   'http://localhost:8082',
    pedidos:    'http://localhost:8082',
    pagos:      'http://localhost:8082',
    inventario: 'http://localhost:8082',
    envios:     'http://localhost:8082',
    identity:   'http://localhost:8082',
  }
};