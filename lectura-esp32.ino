#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Configuración WiFi
#define WIFI_SSID "Galaxy A5267D1"
#define WIFI_PASSWORD "zomber123" // Agregar contraseña si aplica

// Configuración Firebase
#define API_KEY "AIzaSyAZo0NNuYeVhJMSDgRLRdVS8qMpUOULp_s"
#define DATABASE_URL "https://sensoresbd-90a43-default-rtdb.firebaseio.com/"

// Instancias Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variables de tiempo para envío de datos
unsigned long sendDataPrevMillis = 0;
const long timerDelay = 5000; // 5 segundos

// Variable de autenticación
bool signupOK = false;

// Pines
const int trigPin = 5;
const int echoPin = 18;
const int ledRed = 2;
const int ledGreen = 4;


void setup() {
    Serial.begin(115200);

    // Configurar pines
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    pinMode(ledRed, OUTPUT);
    pinMode(ledGreen, OUTPUT);

    // Conectar a WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Conectando a WiFi...");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConectado a WiFi");
    Serial.print("IP local: ");
    Serial.println(WiFi.localIP());

    // Configurar Firebase
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;


    // Opcional: Autenticación anónima en Firebase
    if (Firebase.signUp(&config, &auth, "", "")) {
        Serial.println("Autenticación anónima exitosa");
        signupOK = true;
    } else {
        Serial.print("Error en autenticación: ");
        Serial.println(config.signer.signupError.message.c_str());  // Solución aquí
    }

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
}

void loop() {
    // Medir distancia con el sensor HC-SR04
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    long duration = pulseIn(echoPin, HIGH);
    float distance = duration * 0.034 / 2;

    Serial.print("Distancia: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Control de LEDs según distancia
    if (distance <= 3) {
        digitalWrite(ledRed, HIGH);
        digitalWrite(ledGreen, LOW);
        Serial.println("Bote lleno");
    } else {
        digitalWrite(ledRed, LOW);
        digitalWrite(ledGreen, HIGH);
        Serial.println("Bote vacío");
    }

    // Enviar datos a Firebase cada 5 segundos
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > timerDelay)) {
        sendDataPrevMillis = millis();
        //if (Firebase.RTDB.setFloat(&fbdo, "/contenedor1/distancia", distance)) {
          if (Firebase.RTDB.setFloat(&fbdo, "/contenedor2/distancia", distance)) {

            Serial.println("Datos enviados a Firebase correctamente");
        } else {
            Serial.print("Error al enviar: ");
            Serial.println(fbdo.errorReason().c_str());  // Solución aquí
        }
    }

    delay(500);
}