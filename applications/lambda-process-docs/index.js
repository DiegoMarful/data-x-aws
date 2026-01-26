const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const { parse } = require('pdf-parse');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');

// Configurar logging
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Extrae texto de un documento PDF
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await parse(buffer);
    return {
      text: data.text,
      metadata: data.metadata,
      numPages: data.numpages
    };
  } catch (error) {
    logger.error('Error extrayendo texto de PDF:', error);
    throw new Error(`PDF extraction failed: ${error.message}`);
  }
}

/**
 * Extrae texto de un documento DOCX
 */
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: result.value,
      metadata: result.messages
    };
  } catch (error) {
    logger.error('Error extrayendo texto de DOCX:', error);
    throw new Error(`DOCX extraction failed: ${error.message}`);
  }
}

/**
 * Extrae texto de un archivo TXT
 */
async function extractTextFromTXT(buffer) {
  return {
    text: buffer.toString('utf-8'),
    metadata: {}
  };
}

/**
 * Procesa un documento según su extensión
 */
async function processDocument(fileContent, fileExtension) {
  logger.info(`Procesando documento con extensión: ${fileExtension}`);
  
  switch (fileExtension.toLowerCase()) {
    case '.pdf':
      return await extractTextFromPDF(fileContent);
    case '.docx':
      return await extractTextFromDOCX(fileContent);
    case '.txt':
      return await extractTextFromTXT(fileContent);
    default:
      throw new Error(`Formato no soportado: ${fileExtension}`);
  }
}

/**
 * Handler principal de Lambda
 */
exports.handler = async (event) => {
  logger.info('Evento recibido:', JSON.stringify(event, null, 2));
  
  try {
    // Obtener información del archivo subido a S3
    const record = event.Records[0];
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const fileExtension = key.substring(key.lastIndexOf('.'));
    
    logger.info(`Procesando archivo: ${key} del bucket: ${bucket}`);
    
    // Descargar archivo de S3
    const s3Object = await s3.getObject({
      Bucket: bucket,
      Key: key
    }).promise();
    
    // Procesar documento
    const documentData = await processDocument(s3Object.Body, fileExtension);
    
    // Generar metadatos
    const metadata = {
      documentId: uuidv4(),
      originalFileName: key,
      fileSize: s3Object.ContentLength,
      fileType: fileExtension,
      uploadTimestamp: new Date().toISOString(),
      environment: process.env.ENVIRONMENT,
      processingTimestamp: new Date().toISOString(),
      extractedTextLength: documentData.text.length,
      ...documentData.metadata
    };
    
    logger.info('Documento procesado exitosamente:', {
      documentId: metadata.documentId,
      fileName: key,
      textLength: documentData.text.length
    });
    
    // Aquí podrías:
    // 1. Guardar metadatos en DynamoDB
    // 2. Guardar texto extraído en otro bucket
    // 3. Publicar a SNS/SQS para procesamiento posterior
    // 4. Llamar a otro servicio (Comprehend, Textract, etc.)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Documento procesado exitosamente',
        documentId: metadata.documentId,
        metadata: metadata
      })
    };
    
  } catch (error) {
    logger.error('Error procesando documento:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Error procesando documento',
        error: error.message
      })
    };
  }
};

// Para pruebas locales (opcional)
if (require.main === module) {
  exports.handler({
    Records: [{
      s3: {
        bucket: { name: 'test-bucket' },
        object: { key: 'test.pdf' }
      }
    }]
  }).then(console.log).catch(console.error);
}
