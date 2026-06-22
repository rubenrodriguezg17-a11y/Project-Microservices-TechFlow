export const environment = {
  production: false,
  gateway: 'http://localhost:8082',
  identityService: 'http://localhost:9007',
  services: {
    productos: 'http://localhost:9001',
    usuarios:  'http://localhost:9002',
    pedidos:   'http://localhost:9003',
    pagos:     'http://localhost:9004',
    inventario:'http://localhost:9005',
    envios:    'http://localhost:9006',
    identity:  'http://localhost:9007',
  }
};
