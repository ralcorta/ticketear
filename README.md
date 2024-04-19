# Proyecto para Universidad UADE

Este repositorio contiene un proyecto desarrollado para la Universidad UADE. El objetivo del proyecto es utilizar TypeScript junto con los servicios de AWS y la biblioteca LocalStack para emular la infraestructura en la nube de forma local.

## Objetivo
Sistema de compra de tickets online.

## Características
- Configuración inicial del proyecto con TypeScript.
- Ejemplos de configuración para servicios de AWS compatibles con LocalStack.
- Archivos de configuración de Docker para ejecutar LocalStack localmente.
- Ejemplos de código y plantillas para aplicaciones basadas en TypeScript y servicios de AWS.
- Facilidad para probar la infraestructura localmente utilizando LocalStack.

## Instrucciones de Uso
1. Clonar el repositorio a tu máquina local.
2. Instalar las dependencias necesarias.
3. Iniciar LocalStack utilizando Docker, instalar con:
   
 - Comando (MAC): ` brew install localstack/tap/localstack-cli `.
 - Prerequisitos:
    - docker
    - docker-compose (version 1.9.0+)
  
  - Ejecutar el CLI instalado: `localstack start`
  - Si no tenes configurado AWS anteriormente, podes hacerlo para esta ocacion usando:
    - `aws configure set aws_access_key_id test`
    - `aws configure set aws_secret_access_key test`
    - `aws configure set region us-east-1`
    Estos valores son placeholders, LocalStack no requiere credenciales de AWS reales

4. Desarrollar y probar la aplicación utilizando TypeScript y los servicios de AWS emulados localmente con LocalStack.

### Como utilizar localstack

Documentacion y guia sobre como levantar localstack si tienen mas dudas: https://medium.com/@ben.meehan_27368/how-to-setup-aws-locally-using-localstack-without-spending-a-buck-1c6e20bce8

## Contacto
Para cualquier pregunta o consulta sobre este proyecto, por favor contacta a equipo 5.
