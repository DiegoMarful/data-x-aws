Plataforma Legal en AWS, DATA-X - Documentación del Proyecto

Descripción General

Este repositorio contiene la infraestructura como código y las aplicaciones para la Plataforma Legal, una solución basada en AWS para el procesamiento automatizado de documentos legales. El proyecto sigue una arquitectura serverless-first
y está completamente versionado en Git.

Arquitectura del Proyecto

El proyecto está organizado en dos áreas principales de responsabilidad:

Infraestructura AWS (Carpeta infrastructure/)
Gestionada por el Equipo de Sistemas, contiene toda la definición de recursos AWS mediante CloudFormation:

VPC Base: Red virtual con tres subredes dedicadas:

Desarrollo (10.0.10.0/24)

Producción (10.0.20.0/24)

Administración y Normas (10.0.30.0/24)

Almacenamiento: Buckets S3 configurados para almacenar documentos y logs.

Configuración por Entorno: Parámetros específicos para desarrollo, staging y producción.

Aplicaciones (Carpeta applications/)
Para la gestión del Equipo de Desarrollo, contiene la lógica de negocio:

Lambda de Procesamiento: Función serverless que procesa automáticamente documentos (PDF, DOCX, TXT) cuando se suben a S3.

Responsabilidades del Equipo

Equipo de Sistemas

- Crear y mantener la infraestructura AWS

- Configurar redes, seguridad y permisos

- Gestionar los despliegues multi-entorno

- Monitorizar costos y rendimiento

Equipo de Desarrollo

- Desarrollar y mantener la Lambda de procesamiento

- Implementar nuevas funcionalidades de negocio

- Escribir tests y asegurar calidad

- Documentar APIs y flujos de datos

Estado Actual del Proyecto


Estructura completa del repositorio con separación clara de responsabilidades

Plantillas CloudFormation para VPC y S3

Configuración multi-entorno (dev, staging, prod)

Código de Lambda funcional con procesamiento de documentos

Pipelines CI/CD configurados (inactivos hasta tener credenciales AWS)

Pendiente de Implementación

Bases de datos (DocumentDB/RDS) - Requiere VPC primero

Recursos de cómputo (EC2, Auto Scaling) - Requiere VPC y S3

Balanceador de carga ELB - Solo para producción

Sistema de monitorización (CloudWatch dashboards)

Flujo de Trabajo con Git

Para cambios en Infraestructura:

- Crear rama con prefijo infra/: git checkout -b infra/nombre-cambio

- Modificar archivos en infrastructure/

- Hacer commit: git commit -m "infra: descripción del cambio"

- Crear Pull Request y esperar 2 aprobaciones

Para cambios en Aplicaciones:

- Crear rama con prefijo feature/ o fix/: git checkout -b feature/nueva-funcionalidad

- Modificar archivos en applications/

- Hacer commit: git commit -m "feat: nueva funcionalidad"

- Crear Pull Request y esperar 2 aprobaciones

Cómo Empezar a Trabajar

Primeros Pasos

1- Clonar el repositorio: git clone https://github.com/DiegoMarful/data-x-aws.git

2- Revisar la estructura de carpetas

3- Leer esta documentación completa

4- Configurar entorno local (Node.js 18+, AWS CLI)

5- Hacer un cambio pequeño (ej: corregir typo) para familiarizarse

Desarrollo Local (Sin AWS)

1- Navegar a la carpeta de la Lambda: cd applications/lambda-process-docs

2- Instalar dependencias: npm install

3- Probar el código localmente: node index.js

-----------------------------------------------------------------Plan de Despliegue (Cuando Tengamos Acceso AWS)-----------------------------------------------------------------
Mi idea sería hacer algo similar a lo siguiente aunque, como es lógico, estoy abierto a las sugerencias que me podáis comentar sobre cambiar orden, implementar nuevos apartados y/o fases etc. 
Evidentemente habrá fallos y habrán cosas que se deberán ir modificando así que las fases quedan pendientes de posibles cambios en función de las demoras ocasionadas por los incoveninetes e incidencias que nos vayamos encontrando.

Fase 1 - Infraestructura Base
Desplegar VPC en entorno dev

Crear buckets S3 para documentos

Verificar que todo funciona correctamente

Fase 2 - Aplicación Lambda
Desplegar la función Lambda

Configurar trigger desde S3

Probar el flujo completo con documentos de prueba

Fase 3 - Entornos Completos
Replicar para staging

Replicar para producción

Configurar monitorización y alertas

-----------------------------------------------------------------Seguridad y Mejores Prácticas-----------------------------------------------------------------
Configuración Segura
Las contraseñas y claves secretas NO van en los archivos JSON

Usar AWS Secrets Manager para datos sensibles

Todos los buckets S3 son privados por defecto

La VPC está aislada sin acceso público directo

-----------------------------------------------------------------Convenciones de Código-----------------------------------------------------------------

CloudFormation: 2 espacios de indentación

Commits: Usar convenciones convencionales (feat, fix, infra, docs)
