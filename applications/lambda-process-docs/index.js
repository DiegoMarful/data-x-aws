// Lambda para procesar documentos legales
exports.handler = async (event) => {
  console.log('Lambda procesando documento:', event);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Documento procesado exitosamente',
      environment: process.env.ENVIRONMENT || 'dev',
      timestamp: new Date().toISOString()
    })
  };
};
