# 1. Use JDK for building
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Package the application (skip tests for speed)
RUN mvn clean package -DskipTests

# 2. Use slim JRE for running
FROM eclipse-temurin:21-jre

WORKDIR /app
COPY --from=builder /app/target/gemini-chat-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
